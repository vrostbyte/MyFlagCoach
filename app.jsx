/**
 * MyFlagCoach App - Project Phoenix
 * The core React component for the application.
 */

const { useState, useMemo } = React;

// Player color configuration
const PLAYER_COLORS = {
    X: '#3b82f6', // blue-500
    Y: '#F61A97', // dark-pink
    Z: '#ef4444', // red-500
    DEFAULT: '#374151' // gray-700
};

const App = () => {
    // --- STATE MANAGEMENT ---
    const [currentPlaybook, setCurrentPlaybook] = useState(playbook);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [selectedStrength, setSelectedStrength] = useState(null);
    const [leftConcept, setLeftConcept] = useState(null);
    const [rightConcept, setRightConcept] = useState(null);
    const [fullFieldPlay, setFullFieldPlay] = useState(null);
    const [activeModifiers, setActiveModifiers] = useState([]);

    // --- COMPUTED VALUES ---
    const activeFormation = useMemo(() => {
        if (!selectedFormation || !selectedStrength) return null;
        return currentPlaybook.formations[selectedFormation]?.[selectedStrength];
    }, [selectedFormation, selectedStrength, currentPlaybook]);

    const playerAssignments = useMemo(() => {
        if (!activeFormation) return { routes: {}, positions: {} };

        let routes = {};
        let basePositions = { ...activeFormation.positions };
        
        // Default blocking assignments
        if (basePositions.H) routes.H = "block";
        if (basePositions.C) routes.C = "block";

        const applyConcept = (concept, side) => {
            if (!concept) return;
            const sideInfo = activeFormation.sides[side];
            const players = [...sideInfo.players];
            let conceptDefinition = playbook.concepts[`${players.length}Man`]?.[concept];
            const routeSuffix = side === 'left' ? '_L' : '_R';

            if (conceptDefinition) {
                if (conceptDefinition.usesCenter && players.length < 3 && basePositions.C) {
                    players.push('C');
                }
                
                Object.entries(conceptDefinition.assignments).forEach(([index, routeKey]) => {
                    const player = players[index];
                    if (player) {
                        routes[player] = playbook.routeLibrary[routeKey + routeSuffix] ? routeKey + routeSuffix : routeKey;
                    }
                });
            }
        };

        if (fullFieldPlay) {
            const playDef = currentPlaybook.concepts.fullField[fullFieldPlay];
            if(playDef) routes = { ...playDef.assignments };
        } else {
            applyConcept(leftConcept, 'left');
            applyConcept(rightConcept, 'right');
        }

        let finalPositions = { ...basePositions };
        activeModifiers.forEach(modName => {
            const modifier = currentPlaybook.modifiers[modName];
            if (modifier.type === 'positional' && finalPositions[modifier.player]) {
                routes[modifier.player] = modifier.assignment;
                if (modifier.position === 'mirrorH' && finalPositions.H && finalPositions.Q) {
                    const hPos = finalPositions.H;
                    const qPos = finalPositions.Q;
                    finalPositions[modifier.player] = { x: -hPos.x, y: hPos.y };
                }
            }
            if (modifier.type === 'formationCompression') {
                const linemen = ['X', 'F', 'Y', 'C', 'Z', 'H'].filter(p => finalPositions[p] && finalPositions[p].y <= 0);
                const centerPos = finalPositions.C.x;
                const sortedLinemen = linemen.sort((a, b) => finalPositions[a].x - finalPositions[b].x);
                const centerIndex = sortedLinemen.findIndex(p => p === 'C');
                
                sortedLinemen.forEach((player, i) => {
                    finalPositions[player].x = centerPos + (i - centerIndex) * modifier.spacing;
                });
            }
        });

        return { routes, positions: finalPositions };
    }, [activeFormation, leftConcept, rightConcept, fullFieldPlay, activeModifiers, currentPlaybook]);

    // --- EVENT HANDLERS ---
    const resetPlay = () => {
        setSelectedFormation(null);
        setSelectedStrength(null);
        setLeftConcept(null);
        setRightConcept(null);
        setFullFieldPlay(null);
        setActiveModifiers([]);
    };

    const handleFormationSelect = name => (resetPlay(), setSelectedFormation(name));
    const handleStrengthSelect = str => (setLeftConcept(null), setRightConcept(null), setFullFieldPlay(null), setSelectedStrength(str));
    const handleConceptSelect = (con, side) => (setFullFieldPlay(null), side === 'left' ? setLeftConcept(p => p === con ? null : con) : setRightConcept(p => p === con ? null : con));
    const handleFullFieldSelect = name => (setLeftConcept(null), setRightConcept(null), setFullFieldPlay(p => p === name ? null : name));
    const toggleModifier = name => setActiveModifiers(p => p.includes(name) ? p.filter(m => m !== name) : [...p, name]);

    // --- RENDER LOGIC ---
    const routeToPath = (routeKey, startPos) => {
        if (!routeKey) return "";
        const route = currentPlaybook.routeLibrary[routeKey];
        if (!route || !route.steps || route.steps.length === 0) return "";
    
        let path = `M ${startPos.x} ${startPos.y}`;
        let currentX = startPos.x;
        let currentY = startPos.y;
        const YARD_SCALE = 12;

        route.steps.forEach(step => {
            let dX, dY, radians;
            switch (step.type) {
                case 'stem': currentY -= step.yards * YARD_SCALE; path += ` L ${currentX} ${currentY}`; break;
                case 'break':
                    // Angle system: 0 is vertical, positive is right, negative is left
                    radians = step.angle * (Math.PI / 180);
                    dX = Math.sin(radians) * step.yards * YARD_SCALE;
                    dY = -Math.cos(radians) * step.yards * YARD_SCALE; // Y is negative to go "up"
                    currentX += dX;
                    currentY += dY;
                    path += ` L ${currentX} ${currentY}`;
                    break;
                case 'release':
                    radians = step.angle * (Math.PI / 180);
                    dX = Math.sin(radians) * step.yards * YARD_SCALE;
                    dY = -Math.cos(radians) * step.yards * YARD_SCALE;
                    currentX += dX; currentY += dY; path += ` l ${dX} ${dY}`;
                    break;
                case 'drag': currentX += (step.direction === 'left' ? -1 : 1) * step.yards * YARD_SCALE; path += ` L ${currentX} ${currentY}`; break;
                case 'swing':
                    const c1x = startPos.x + (step.direction === 'left' ? -50 : 50), c1y = startPos.y + 30;
                    const c2x = startPos.x + (step.direction === 'left' ? -150 : 150), c2y = startPos.y + 30;
                    currentX = startPos.x + (step.direction === 'left' ? -200 : 200); currentY = startPos.y + 10;
                    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${currentX} ${currentY}`;
                    break;
            }
        });
        return path;
    };

    const renderConceptButtons = (side) => {
        if (!activeFormation) return null;
        const sideInfo = activeFormation.sides[side];
        const numPlayers = sideInfo.players.length;
        const conceptCategory = `${numPlayers}Man`;
        const concepts = currentPlaybook.concepts[conceptCategory];
        if (!concepts) return null;
        const selectedConcept = side === 'left' ? leftConcept : rightConcept;

        return (
            <div className="bg-white rounded-lg shadow p-4 text-gray-900">
                <h2 className="text-xl font-bold mb-3 border-b pb-2 capitalize">{side} Side Concepts</h2>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(concepts).map(name => {
                        const def = concepts[name];
                        if (def.formation && def.formation !== selectedFormation) return null;
                        return (<button key={name} onClick={() => handleConceptSelect(name, side)} className={`p-4 rounded-lg shadow transition-all text-sm font-semibold ${selectedConcept === name ? 'bg-green-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>{name}</button>);
                    })}
                </div>
            </div>
        );
    };

    // --- JSX RENDER ---
    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <div className="w-1/4 bg-gray-800 p-6 space-y-6 overflow-y-auto control-panel">
                <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">MyFlagCoach</h1><button onClick={resetPlay} className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Reset</button></div>
                <div className="bg-white rounded-lg shadow p-4"><h2 className="text-xl font-bold mb-3 border-b pb-2 text-gray-900">1. Formation</h2><div className="grid grid-cols-2 gap-2">{Object.keys(currentPlaybook.formations).map(name => (<button key={name} onClick={() => handleFormationSelect(name)} className={`p-4 rounded-lg shadow transition-all font-semibold ${selectedFormation === name ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>{name}</button>))}</div></div>
                {selectedFormation && <div className="bg-white rounded-lg shadow p-4"><h2 className="text-xl font-bold mb-3 border-b pb-2 text-gray-900">2. Strength</h2><div className="grid grid-cols-2 gap-2"><button onClick={() => handleStrengthSelect('Lt')} className={`p-4 rounded-lg shadow transition-all font-semibold ${selectedStrength === 'Lt' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>Left</button><button onClick={() => handleStrengthSelect('Rt')} className={`p-4 rounded-lg shadow transition-all font-semibold ${selectedStrength === 'Rt' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>Right</button></div></div>}
                {activeFormation && <div className="space-y-4">{renderConceptButtons('left')}{renderConceptButtons('right')}<div className="bg-white rounded-lg shadow p-4 text-gray-900"><h2 className="text-xl font-bold mb-3 border-b pb-2">Full Field Plays</h2><div className="grid grid-cols-2 gap-2">{Object.entries(currentPlaybook.concepts.fullField).map(([key, play]) => (play.formation === `${selectedFormation} ${selectedStrength}` && <button key={key} onClick={() => handleFullFieldSelect(key)} className={`p-4 rounded-lg shadow transition-all text-sm font-semibold ${fullFieldPlay === key ? 'bg-green-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>{play.name}</button>))}</div></div></div>}
                <div className="bg-white rounded-lg shadow p-4"><h2 className="text-xl font-bold mb-3 border-b pb-2 text-gray-900">Modifiers</h2><div className="grid grid-cols-2 gap-2">{Object.keys(currentPlaybook.modifiers).map(name => (<button key={name} onClick={() => toggleModifier(name)} className={`p-4 rounded-lg shadow transition-all font-semibold ${activeModifiers.includes(name) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>{name}</button>))}</div></div>
            </div>
            <div className="w-3/4 flex flex-col p-6">
                <div className="flex-grow bg-gray-100 rounded-lg shadow-inner relative overflow-hidden">
                    <svg width="100%" height="100%" viewBox="-350 -300 700 350">
                        <rect x="-350" y="-300" width="700" height="350" fill="white" />
                        <g className="yard-markers">
                            {/* Line of Scrimmage */}
                            <line x1="-350" y1="0" x2="350" y2="0" stroke="#172554" strokeWidth="3" />
                            
                            {/* 5-Yard Markers */}
                            {Array.from({ length: 5 }).map((_, i) => (
                                <line 
                                    key={i} 
                                    x1="-350" y1={-(i + 1) * 60} 
                                    x2="350" y2={-(i + 1) * 60} 
                                    stroke="#e5e7eb" 
                                    strokeWidth="1" 
                                    strokeDasharray="4 8" 
                                />
                            ))}
                        </g>
                        <g className="routes">
                            {Object.entries(playerAssignments.routes).map(([player, routeKey]) => {
                                const startPos = playerAssignments.positions[player];
                                if (!startPos) return null;
                                const pathData = routeToPath(routeKey, startPos);
                                const color = PLAYER_COLORS[player] || PLAYER_COLORS.DEFAULT;
                                return <path key={player} d={pathData} stroke={color} strokeWidth="3" fill="none" markerEnd={`url(#arrow-${player})`} />;
                            })}
                        </g>
                        <g className="players">
                            {Object.entries(playerAssignments.positions).map(([player, pos]) => {
                                const color = PLAYER_COLORS[player] || PLAYER_COLORS.DEFAULT;
                                return (<g key={player} transform={`translate(${pos.x}, ${pos.y})`}><circle r="15" fill={color} stroke="white" strokeWidth="2" /><text textAnchor="middle" dy=".3em" fill="white" fontSize="16" fontWeight="bold">{player}</text></g>);
                            })}
                        </g>
                        <defs>
                            {Object.keys(PLAYER_COLORS).map(player => (
                                <marker key={player} id={`arrow-${player}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill={PLAYER_COLORS[player] || PLAYER_COLORS.DEFAULT} />
                                </marker>
                            ))}
                        </defs>
                    </svg>
                </div>
                <div className="h-48 bg-white mt-6 rounded-lg shadow p-4 overflow-y-auto text-gray-900">
                    <h3 className="text-2xl font-bold mb-2">Player Responsibilities</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {['Q', 'C', 'H', 'X', 'Y', 'Z', 'F'].map(player => {
                             const routeKey = playerAssignments.routes[player];
                             const routeName = (currentPlaybook.routeLibrary[routeKey]?.name || routeKey || 'Block');
                            return (<div key={player} className="flex items-baseline"><span className="font-bold text-lg w-8">{player}:</span><span className="text-gray-700 capitalize">{routeName}</span></div>);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

