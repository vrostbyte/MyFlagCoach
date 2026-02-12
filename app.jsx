/**
 * MyFlagCoach App - Project Phoenix v2
 * Mobile-first flag football play calling app.
 * Features: formation/concept play builder, custom play creator, sideline-optimized UI.
 */

const { useState, useMemo, useCallback, useEffect, useRef } = React;

// --- CONSTANTS ---
const PLAYER_COLORS = {
    X: '#3b82f6', Y: '#ec4899', Z: '#ef4444', F: '#f59e0b',
    H: '#8b5cf6', C: '#6b7280', Q: '#10b981', DEFAULT: '#374151'
};
const ALL_PLAYERS = ['Q', 'C', 'H', 'X', 'Y', 'Z', 'F'];
const YARD_SCALE = 12;

// All available individual routes for the custom play builder
const ROUTE_OPTIONS = [
    'block', 'go', 'slant', 'in', 'out', 'flat', 'post', 'corner',
    'comeback', 'drag', 'curl', 'wheel', 'hitch_6yd', 'swingR', 'swingL'
];

// --- HELPER: Convert route steps to SVG path ---
const routeToPath = (routeKey, startPos, routeLibrary) => {
    if (!routeKey) return "";
    const route = routeLibrary[routeKey];
    if (!route || !route.steps || route.steps.length === 0) return "";

    let path = `M ${startPos.x} ${startPos.y}`;
    let currentX = startPos.x;
    let currentY = startPos.y;

    route.steps.forEach(step => {
        let dX, dY, radians;
        switch (step.type) {
            case 'stem':
                currentY -= step.yards * YARD_SCALE;
                path += ` L ${currentX} ${currentY}`;
                break;
            case 'break':
                radians = step.angle * (Math.PI / 180);
                dX = Math.sin(radians) * step.yards * YARD_SCALE;
                dY = -Math.cos(radians) * step.yards * YARD_SCALE;
                currentX += dX; currentY += dY;
                path += ` L ${currentX} ${currentY}`;
                break;
            case 'release':
                radians = step.angle * (Math.PI / 180);
                dX = Math.sin(radians) * step.yards * YARD_SCALE;
                dY = -Math.cos(radians) * step.yards * YARD_SCALE;
                currentX += dX; currentY += dY;
                path += ` L ${currentX} ${currentY}`;
                break;
            case 'drag':
                currentX += (step.direction === 'left' ? -1 : 1) * step.yards * YARD_SCALE;
                path += ` L ${currentX} ${currentY}`;
                break;
            case 'swing':
                const dir = step.direction === 'left' ? -1 : 1;
                const c1x = startPos.x + dir * 50, c1y = startPos.y + 30;
                const c2x = startPos.x + dir * 150, c2y = startPos.y + 30;
                currentX = startPos.x + dir * 200; currentY = startPos.y + 10;
                path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${currentX} ${currentY}`;
                break;
        }
    });
    return path;
};

// --- HELPER: Resolve route key with side suffix ---
const resolveRouteKey = (routeKey, side, routeLibrary) => {
    const suffix = side === 'left' ? '_L' : '_R';
    if (routeLibrary[routeKey + suffix]) return routeKey + suffix;
    return routeKey;
};

// =============================================
// FIELD VISUALIZATION COMPONENT
// =============================================
const FieldView = ({ playerAssignments, routeLibrary }) => {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="-350 -320 700 400"
            preserveAspectRatio="xMidYMid meet"
            style={{ touchAction: 'none' }}
        >
            <rect x="-350" y="-320" width="700" height="400" fill="#365B3E" />
            {/* Yard lines */}
            <line x1="-350" y1="0" x2="350" y2="0" stroke="white" strokeWidth="3" />
            {Array.from({ length: 5 }).map((_, i) => (
                <g key={i}>
                    <line x1="-350" y1={-(i + 1) * 60} x2="350" y2={-(i + 1) * 60}
                        stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="8 12" />
                    <text x="-340" y={-(i + 1) * 60 + 4} fill="rgba(255,255,255,0.3)"
                        fontSize="12" fontFamily="sans-serif">{(i + 1) * 5}yd</text>
                </g>
            ))}
            {/* Routes */}
            <g>
                {Object.entries(playerAssignments.routes).map(([player, routeKey]) => {
                    const startPos = playerAssignments.positions[player];
                    if (!startPos) return null;
                    const pathData = routeToPath(routeKey, startPos, routeLibrary);
                    if (!pathData) return null;
                    const color = PLAYER_COLORS[player] || PLAYER_COLORS.DEFAULT;
                    return <path key={player} d={pathData} stroke={color} strokeWidth="3.5"
                        fill="none" strokeLinecap="round" strokeLinejoin="round"
                        markerEnd={`url(#arrow-${player})`} />;
                })}
            </g>
            {/* Players */}
            <g>
                {Object.entries(playerAssignments.positions).map(([player, pos]) => {
                    const color = PLAYER_COLORS[player] || PLAYER_COLORS.DEFAULT;
                    return (
                        <g key={player} transform={`translate(${pos.x}, ${pos.y})`}>
                            <circle r="16" fill={color} stroke="white" strokeWidth="2.5" />
                            <text textAnchor="middle" dy=".35em" fill="white"
                                fontSize="14" fontWeight="bold" fontFamily="sans-serif">{player}</text>
                        </g>
                    );
                })}
            </g>
            {/* Arrow markers */}
            <defs>
                {ALL_PLAYERS.map(player => {
                    const color = PLAYER_COLORS[player] || PLAYER_COLORS.DEFAULT;
                    return (
                        <marker key={player} id={`arrow-${player}`} viewBox="0 0 10 10"
                            refX="8" refY="5" markerWidth="5" markerHeight="5"
                            orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                        </marker>
                    );
                })}
            </defs>
        </svg>
    );
};

// =============================================
// PLAYER RESPONSIBILITIES TABLE
// =============================================
const ResponsibilitiesTable = ({ playerAssignments, routeLibrary }) => {
    const receivers = ['X', 'Y', 'Z', 'F', 'H'];
    const others = ['Q', 'C'];
    const allPlayers = [...receivers, ...others];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {allPlayers.map(player => {
                const routeKey = playerAssignments.routes[player];
                const routeName = routeLibrary[routeKey]?.name || routeKey || 'Block';
                const color = PLAYER_COLORS[player] || PLAYER_COLORS.DEFAULT;
                return (
                    <div key={player} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                        <span className="font-bold text-base" style={{ color }}>{player}</span>
                        <span className="text-gray-200 text-sm capitalize truncate">{routeName}</span>
                    </div>
                );
            })}
        </div>
    );
};

// =============================================
// CUSTOM PLAY BUILDER MODAL
// =============================================
const CustomPlayBuilder = ({ currentPlaybook, onSave, onClose }) => {
    const [playName, setPlayName] = useState('');
    const [selectedFormation, setSelectedFormation] = useState('Trips');
    const [selectedStrength, setSelectedStrength] = useState('Lt');
    const [assignments, setAssignments] = useState({
        X: 'go', Y: 'slant', Z: 'out', F: 'flat', H: 'block', C: 'block', Q: 'block'
    });

    const formation = currentPlaybook.formations[selectedFormation]?.[selectedStrength];

    const handleRouteChange = (player, route) => {
        setAssignments(prev => ({ ...prev, [player]: route }));
    };

    const handleSave = () => {
        if (!playName.trim()) return;
        // Determine side for each player to resolve the route key
        const resolvedAssignments = {};
        const leftPlayers = formation?.sides?.left?.players || [];
        const rightPlayers = formation?.sides?.right?.players || [];

        Object.entries(assignments).forEach(([player, routeKey]) => {
            let side = 'left';
            if (rightPlayers.includes(player)) side = 'right';
            resolvedAssignments[player] = resolveRouteKey(routeKey, side, currentPlaybook.routeLibrary);
        });

        onSave({
            name: playName.trim(),
            formation: `${selectedFormation} ${selectedStrength}`,
            assignments: resolvedAssignments,
        });
    };

    const editablePlayers = ['X', 'Y', 'Z', 'F', 'H'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Create Custom Play</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>

                {/* Play Name */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Play Name</label>
                    <input type="text" value={playName} onChange={e => setPlayName(e.target.value)}
                        placeholder="e.g. My Go-To Play"
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* Formation + Strength */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Formation</label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(currentPlaybook.formations).map(f => (
                                <button key={f} onClick={() => setSelectedFormation(f)}
                                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${selectedFormation === f ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Strength</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Lt', 'Rt'].map(s => (
                                <button key={s} onClick={() => setSelectedStrength(s)}
                                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${selectedStrength === s ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'}`}>
                                    {s === 'Lt' ? 'Left' : 'Right'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Route Assignments */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Route Assignments</label>
                    <div className="space-y-2">
                        {editablePlayers.map(player => {
                            const color = PLAYER_COLORS[player] || PLAYER_COLORS.DEFAULT;
                            return (
                                <div key={player} className="flex items-center gap-3 bg-gray-700 rounded-lg px-3 py-2">
                                    <span className="font-bold text-base w-8 text-center" style={{ color }}>{player}</span>
                                    <select value={assignments[player]}
                                        onChange={e => handleRouteChange(player, e.target.value)}
                                        className="flex-1 bg-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none">
                                        {ROUTE_OPTIONS.map(r => (
                                            <option key={r} value={r}>
                                                {currentPlaybook.routeLibrary[r]?.name ||
                                                    currentPlaybook.routeLibrary[r + '_L']?.name || r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Save */}
                <button onClick={handleSave}
                    disabled={!playName.trim()}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${playName.trim() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                    Save Play
                </button>
            </div>
        </div>
    );
};

// =============================================
// SAVED PLAYS PANEL
// =============================================
const SavedPlaysPanel = ({ savedPlays, onSelect, onDelete, activeSavedPlay }) => {
    if (savedPlays.length === 0) {
        return (
            <div className="text-center text-gray-400 py-6 text-sm">
                No custom plays yet. Tap "Create Play" to get started.
            </div>
        );
    }
    return (
        <div className="space-y-2">
            {savedPlays.map((play, idx) => (
                <div key={idx}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors cursor-pointer ${activeSavedPlay === idx ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => onSelect(idx)}>
                    <div>
                        <div className="font-bold text-white">{play.name}</div>
                        <div className="text-xs text-gray-300">{play.formation}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(idx); }}
                        className="text-red-400 hover:text-red-300 text-lg font-bold px-2">&times;</button>
                </div>
            ))}
        </div>
    );
};

// =============================================
// GAME SITUATIONS PANEL
// =============================================
const SituationsPanel = ({ situations, onSelectPlay, activeSituation, onSelectSituation }) => {
    return (
        <div className="space-y-3">
            {/* Situation Chips */}
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(situations).map(([name, sit]) => (
                    <button key={name}
                        onClick={() => onSelectSituation(name)}
                        className={`py-3 px-3 rounded-xl text-sm font-bold transition-all active:scale-95 text-left ${
                            activeSituation === name
                                ? 'ring-2 ring-white text-white'
                                : 'text-white hover:brightness-110'
                        }`}
                        style={{
                            backgroundColor: activeSituation === name ? sit.color : `${sit.color}33`,
                            borderLeft: `4px solid ${sit.color}`
                        }}>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black opacity-60">{sit.icon}</span>
                            <span className="truncate">{name}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Recommended Plays for selected situation */}
            {activeSituation && situations[activeSituation] && (
                <div className="space-y-2 mt-2">
                    <div className="px-1">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                            {activeSituation}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {situations[activeSituation].description}
                        </p>
                    </div>
                    <div className="space-y-2">
                        {situations[activeSituation].recommendedPlays.map((play, idx) => (
                            <button key={idx}
                                onClick={() => onSelectPlay(play)}
                                className="w-full text-left bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-xl px-4 py-3 transition-all active:scale-[0.98]">
                                <div className="font-semibold text-white text-sm">{play.label}</div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                    {play.formation} {play.strength}
                                    {play.fullField ? ` — ${play.fullField}` :
                                        ` — ${[play.left, play.right].filter(Boolean).join(' / ')}`}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================
// MAIN APP COMPONENT
// =============================================
const App = ({ initialPlaybook }) => {
    // --- STATE ---
    const [currentPlaybook] = useState(initialPlaybook);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [selectedStrength, setSelectedStrength] = useState(null);
    const [leftConcept, setLeftConcept] = useState(null);
    const [rightConcept, setRightConcept] = useState(null);
    const [fullFieldPlay, setFullFieldPlay] = useState(null);
    const [activeModifiers, setActiveModifiers] = useState([]);
    const [showControls, setShowControls] = useState(true);
    const [showPlayBuilder, setShowPlayBuilder] = useState(false);
    const [savedPlays, setSavedPlays] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('myflagcoach_custom_plays') || '[]');
        } catch { return []; }
    });
    const [activeSavedPlay, setActiveSavedPlay] = useState(null);
    const [activeTab, setActiveTab] = useState('playbook'); // 'playbook', 'custom', or 'situations'
    const [activeSituation, setActiveSituation] = useState(null);

    // Persist custom plays to localStorage
    useEffect(() => {
        localStorage.setItem('myflagcoach_custom_plays', JSON.stringify(savedPlays));
    }, [savedPlays]);

    // --- COMPUTED VALUES ---
    const activeFormation = useMemo(() => {
        if (!selectedFormation || !selectedStrength) return null;
        return currentPlaybook.formations[selectedFormation]?.[selectedStrength];
    }, [selectedFormation, selectedStrength, currentPlaybook]);

    const playerAssignments = useMemo(() => {
        // If a saved custom play is active, use it directly
        if (activeSavedPlay !== null && savedPlays[activeSavedPlay]) {
            const play = savedPlays[activeSavedPlay];
            const [formName, strength] = play.formation.split(' ');
            const formation = currentPlaybook.formations[formName]?.[strength];
            if (!formation) return { routes: {}, positions: {} };
            return {
                routes: { ...play.assignments },
                positions: JSON.parse(JSON.stringify(formation.positions)),
            };
        }

        if (!activeFormation) return { routes: {}, positions: {} };

        let routes = {};
        const basePositions = { ...activeFormation.positions };

        // Default blocking assignments
        if (basePositions.H) routes.H = "block";
        if (basePositions.C) routes.C = "block";

        const applyConcept = (concept, side) => {
            if (!concept) return;
            const sideInfo = activeFormation.sides[side];
            const players = [...sideInfo.players];

            let conceptDefinition = currentPlaybook.concepts[`${players.length}Man`]?.[concept];
            if (!conceptDefinition && players.length === 2) {
                const threeManConcept = currentPlaybook.concepts['3Man']?.[concept];
                if (threeManConcept?.usesCenter) {
                    conceptDefinition = threeManConcept;
                }
            }

            const routeSuffix = side === 'left' ? '_L' : '_R';

            if (conceptDefinition) {
                if (conceptDefinition.usesCenter && players.length < 3 && basePositions.C) {
                    players.push('C');
                }

                Object.entries(conceptDefinition.assignments).forEach(([index, routeKey]) => {
                    const player = players[index];
                    if (player) {
                        routes[player] = currentPlaybook.routeLibrary[routeKey + routeSuffix]
                            ? routeKey + routeSuffix : routeKey;
                    }
                });
            }
        };

        if (fullFieldPlay) {
            const playDef = currentPlaybook.concepts.fullField[fullFieldPlay];
            if (playDef) routes = { ...playDef.assignments };
        } else {
            applyConcept(leftConcept, 'left');
            applyConcept(rightConcept, 'right');
        }

        let finalPositions = JSON.parse(JSON.stringify(basePositions));

        activeModifiers.forEach(modName => {
            const modifier = currentPlaybook.modifiers[modName];
            if (!modifier) return;
            if (modifier.type === 'positional' && finalPositions[modifier.player]) {
                routes[modifier.player] = modifier.assignment;
                if (modifier.position === 'mirrorH' && finalPositions.H && finalPositions.Q) {
                    finalPositions[modifier.player] = { x: -finalPositions.H.x, y: finalPositions.H.y };
                }
            }
            if (modifier.type === 'formationCompression') {
                // Compress linemen positions along the line of scrimmage (y === 0)
                const linemen = ALL_PLAYERS.filter(p => finalPositions[p] && finalPositions[p].y === 0);
                const sortedLinemen = linemen.sort((a, b) => basePositions[a].x - basePositions[b].x);
                const centerIndex = sortedLinemen.findIndex(p => p === 'C');
                if (centerIndex >= 0) {
                    sortedLinemen.forEach((player, i) => {
                        finalPositions[player].x = finalPositions.C.x + (i - centerIndex) * modifier.spacing;
                    });
                }
            }
        });

        return { routes, positions: finalPositions };
    }, [activeFormation, leftConcept, rightConcept, fullFieldPlay, activeModifiers, currentPlaybook, activeSavedPlay, savedPlays]);

    const computedPlayName = useMemo(() => {
        if (activeSavedPlay !== null && savedPlays[activeSavedPlay]) {
            return savedPlays[activeSavedPlay].name;
        }

        const parts = [];
        if (selectedFormation) parts.push(selectedFormation);
        if (selectedStrength) parts.push(selectedStrength);
        if (activeModifiers.length > 0) parts.push(...activeModifiers);

        if (fullFieldPlay) {
            parts.push(currentPlaybook.concepts.fullField[fullFieldPlay]?.name || fullFieldPlay);
        } else {
            if (leftConcept) parts.push(leftConcept);
            if (rightConcept && rightConcept !== leftConcept) parts.push(rightConcept);
            else if (rightConcept && !leftConcept) parts.push(rightConcept);
        }

        return parts.join(' - ');
    }, [selectedFormation, selectedStrength, activeModifiers, leftConcept, rightConcept, fullFieldPlay, currentPlaybook, activeSavedPlay, savedPlays]);

    // --- EVENT HANDLERS ---
    const resetPlay = useCallback(() => {
        setSelectedFormation(null);
        setSelectedStrength(null);
        setLeftConcept(null);
        setRightConcept(null);
        setFullFieldPlay(null);
        setActiveModifiers([]);
        setActiveSavedPlay(null);
        setActiveSituation(null);
    }, []);

    const handleFormationSelect = useCallback(name => {
        setActiveSavedPlay(null);
        setSelectedStrength(null);
        setLeftConcept(null);
        setRightConcept(null);
        setFullFieldPlay(null);
        setActiveModifiers([]);
        setSelectedFormation(prev => prev === name ? null : name);
    }, []);

    const handleStrengthSelect = useCallback(str => {
        setLeftConcept(null);
        setRightConcept(null);
        setFullFieldPlay(null);
        setSelectedStrength(str);
    }, []);

    const handleConceptSelect = useCallback((conceptName, side) => {
        setFullFieldPlay(null);
        setActiveSavedPlay(null);
        if (side === 'left') {
            setLeftConcept(prev => {
                const next = prev === conceptName ? null : conceptName;
                if (next === 'Fresno') setRightConcept(rc => rc === 'Fresno' ? null : rc);
                return next;
            });
        } else {
            setRightConcept(prev => {
                const next = prev === conceptName ? null : conceptName;
                if (next === 'Fresno') setLeftConcept(lc => lc === 'Fresno' ? null : lc);
                return next;
            });
        }
    }, []);

    const handleFullFieldSelect = useCallback(name => {
        setLeftConcept(null);
        setRightConcept(null);
        setActiveSavedPlay(null);
        setFullFieldPlay(p => p === name ? null : name);
    }, []);

    const toggleModifier = useCallback(name => {
        setActiveModifiers(p => p.includes(name) ? p.filter(m => m !== name) : [...p, name]);
    }, []);

    const handleSaveCustomPlay = useCallback((play) => {
        setSavedPlays(prev => [...prev, play]);
        setShowPlayBuilder(false);
    }, []);

    const handleDeleteCustomPlay = useCallback((idx) => {
        if (activeSavedPlay === idx) setActiveSavedPlay(null);
        else if (activeSavedPlay !== null && activeSavedPlay > idx) setActiveSavedPlay(activeSavedPlay - 1);
        setSavedPlays(prev => prev.filter((_, i) => i !== idx));
    }, [activeSavedPlay]);

    const handleSelectSavedPlay = useCallback((idx) => {
        setSelectedFormation(null);
        setSelectedStrength(null);
        setLeftConcept(null);
        setRightConcept(null);
        setFullFieldPlay(null);
        setActiveModifiers([]);
        setActiveSavedPlay(prev => prev === idx ? null : idx);
    }, []);

    const handleSelectSituation = useCallback((name) => {
        setActiveSituation(prev => prev === name ? null : name);
    }, []);

    const handleSituationPlaySelect = useCallback((play) => {
        // Auto-configure the playbook controls from the recommended play
        setActiveSavedPlay(null);
        setActiveModifiers([]);

        setSelectedFormation(play.formation);
        setSelectedStrength(play.strength);

        if (play.fullField) {
            setLeftConcept(null);
            setRightConcept(null);
            setFullFieldPlay(play.fullField);
        } else {
            setFullFieldPlay(null);
            setLeftConcept(play.left || null);
            setRightConcept(play.right || null);
        }

        // On mobile, switch to field view after selecting
        setShowControls(false);
    }, []);

    // --- RENDER HELPERS ---
    const renderConceptButtons = (side) => {
        if (!activeFormation) return null;
        const sideInfo = activeFormation.sides[side];
        const numPlayers = sideInfo.players.length;
        const conceptCategory = `${numPlayers}Man`;

        let availableConcepts = { ...(currentPlaybook.concepts[conceptCategory] || {}) };

        if (numPlayers === 2) {
            const threeManConcepts = currentPlaybook.concepts["3Man"] || {};
            Object.entries(threeManConcepts).forEach(([name, conceptDef]) => {
                if (conceptDef.usesCenter) availableConcepts[name] = conceptDef;
            });
        }

        if (selectedFormation === 'Bunch' && availableConcepts['Fresno']) {
            delete availableConcepts['Fresno'];
        }

        const filteredConcepts = Object.entries(availableConcepts).filter(([, def]) => {
            return !def.formation || def.formation === selectedFormation;
        });

        if (filteredConcepts.length === 0) return null;

        const selectedConcept = side === 'left' ? leftConcept : rightConcept;

        return (
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide capitalize">
                    {side} Side
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    {filteredConcepts.sort(([a], [b]) => a.localeCompare(b)).map(([name]) => (
                        <button key={name}
                            onClick={() => handleConceptSelect(name, side)}
                            className={`py-3 px-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                                selectedConcept === name
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                            }`}>
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const hasFullFieldPlays = activeFormation && Object.entries(currentPlaybook.concepts.fullField)
        .some(([, play]) => play.formation === `${selectedFormation} ${selectedStrength}`);

    // --- MAIN RENDER ---
    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white font-sans">
            {/* Top Bar - Play Name */}
            <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between safe-top">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <h1 className="text-lg font-bold text-white whitespace-nowrap">MFC</h1>
                    <div className="h-6 w-px bg-gray-600 flex-shrink-0"></div>
                    <span className="text-base font-semibold text-gray-200 truncate">
                        {computedPlayName || 'Select a Play'}
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={resetPlay}
                        className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        Reset
                    </button>
                    <button onClick={() => setShowControls(prev => !prev)}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors md:hidden">
                        {showControls ? 'Field' : 'Menu'}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Control Panel - collapsible on mobile */}
                <div className={`${showControls ? 'flex' : 'hidden'} md:flex flex-col md:w-80 lg:w-96 flex-shrink-0 bg-gray-800 overflow-y-auto control-panel`}>
                    {/* Tab Switcher */}
                    <div className="flex border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                        <button onClick={() => setActiveTab('playbook')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${
                                activeTab === 'playbook'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}>
                            Playbook
                        </button>
                        <button onClick={() => setActiveTab('situations')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${
                                activeTab === 'situations'
                                    ? 'text-orange-400 border-b-2 border-orange-400'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}>
                            Situations
                        </button>
                        <button onClick={() => setActiveTab('custom')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${
                                activeTab === 'custom'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}>
                            My Plays {savedPlays.length > 0 && `(${savedPlays.length})`}
                        </button>
                    </div>

                    <div className="p-4 space-y-4 flex-1">
                        {activeTab === 'situations' ? (
                            <SituationsPanel
                                situations={currentPlaybook.situations}
                                onSelectPlay={handleSituationPlaySelect}
                                activeSituation={activeSituation}
                                onSelectSituation={handleSelectSituation}
                            />
                        ) : activeTab === 'playbook' ? (
                            <>
                                {/* Step 1: Formation */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                        1. Formation
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.keys(currentPlaybook.formations).map(name => (
                                            <button key={name}
                                                onClick={() => handleFormationSelect(name)}
                                                className={`py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                                                    selectedFormation === name
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                                }`}>
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 2: Strength */}
                                {selectedFormation && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                            2. Strength
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => handleStrengthSelect('Lt')}
                                                className={`py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                                                    selectedStrength === 'Lt'
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                                }`}>Left</button>
                                            <button onClick={() => handleStrengthSelect('Rt')}
                                                className={`py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                                                    selectedStrength === 'Rt'
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                                }`}>Right</button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Concepts */}
                                {activeFormation && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                            3. Concepts
                                        </h3>
                                        {renderConceptButtons('left')}
                                        {renderConceptButtons('right')}
                                    </div>
                                )}

                                {/* Full Field Plays */}
                                {hasFullFieldPlays && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                            Full Field Plays
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(currentPlaybook.concepts.fullField).map(([key, play]) => {
                                                if (play.formation !== `${selectedFormation} ${selectedStrength}`) return null;
                                                return (
                                                    <button key={key}
                                                        onClick={() => handleFullFieldSelect(key)}
                                                        className={`py-3 px-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                                                            fullFieldPlay === key
                                                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                                                : 'bg-gray-700 text-white hover:bg-gray-600'
                                                        }`}>
                                                        {play.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Modifiers */}
                                {activeFormation && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                                            Modifiers
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.keys(currentPlaybook.modifiers).map(name => (
                                                <button key={name}
                                                    onClick={() => toggleModifier(name)}
                                                    className={`py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                                                        activeModifiers.includes(name)
                                                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30'
                                                            : 'bg-gray-700 text-white hover:bg-gray-600'
                                                    }`}>
                                                    {name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Custom Plays Tab */
                            <>
                                <button onClick={() => setShowPlayBuilder(true)}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-sm transition-colors active:scale-95">
                                    + Create Play
                                </button>
                                <SavedPlaysPanel
                                    savedPlays={savedPlays}
                                    onSelect={handleSelectSavedPlay}
                                    onDelete={handleDeleteCustomPlay}
                                    activeSavedPlay={activeSavedPlay}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Field + Responsibilities */}
                <div className={`${showControls ? 'hidden' : 'flex'} md:flex flex-col flex-1 overflow-hidden`}>
                    {/* Field */}
                    <div className="flex-1 min-h-0 p-2 md:p-4">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                            <FieldView
                                playerAssignments={playerAssignments}
                                routeLibrary={currentPlaybook.routeLibrary}
                            />
                        </div>
                    </div>

                    {/* Player Responsibilities */}
                    <div className="flex-shrink-0 p-2 md:p-4 pt-0 md:pt-0">
                        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                                Assignments
                            </h3>
                            <ResponsibilitiesTable
                                playerAssignments={playerAssignments}
                                routeLibrary={currentPlaybook.routeLibrary}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Play Builder Modal */}
            {showPlayBuilder && (
                <CustomPlayBuilder
                    currentPlaybook={currentPlaybook}
                    onSave={handleSaveCustomPlay}
                    onClose={() => setShowPlayBuilder(false)}
                />
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App initialPlaybook={playbook} />);
