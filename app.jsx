/**
 * MyFlagCoach App - Project Phoenix
 * The core React component for the application.
 * This version removes all module 'import' statements to work directly in the browser.
 */

// Since React and ReactDOM are loaded globally from the <script> tags in index.html,
// we can use them directly without importing. The same applies to the 'playbook' variable.
const { useState, useMemo } = React;

const App = () => {
    // --- STATE MANAGEMENT ---
    // The playbook object is now available globally from playbook.js
    const [currentPlaybook, setCurrentPlaybook] = useState(playbook);
    
    // Tracks the user's selections in the play-calling process
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [selectedStrength, setSelectedStrength] = useState(null);
    const [leftConcept, setLeftConcept] = useState(null);
    const [rightConcept, setRightConcept] = useState(null);
    const [fullFieldPlay, setFullFieldPlay] = useState(null);
    const [activeModifiers, setActiveModifiers] = useState([]);

    // --- COMPUTED VALUES (MEMOIZED FOR PERFORMANCE) ---

    const activeFormation = useMemo(() => {
        if (!selectedFormation || !selectedStrength) return null;
        return currentPlaybook.formations[selectedFormation]?.[selectedStrength];
    }, [selectedFormation, selectedStrength, currentPlaybook]);

    const playerAssignments = useMemo(() => {
        if (!activeFormation) return { routes: {}, positions: {} };

        let routes = {};
        let basePositions = { ...activeFormation.positions };

        // Default blocking assignments
        if (basePositions.H) routes.H = "block"; // Only if H exists in the formation
        routes.C = "block";

        const applyConcept = (concept, side) => {
            if (!concept) return;
            const sideInfo = activeFormation.sides[side];
            const players = [...sideInfo.players];
            let conceptDefinition = playbook.concepts[`${players.length}Man`]?.[concept];
            
            const routeSuffix = side === 'left' ? '_L' : '_R';

            if (conceptDefinition) {
                if (conceptDefinition.usesCenter && players.length < 3) {
                    players.push('C');
                }
                
                Object.entries(conceptDefinition.assignments).forEach(([index, routeKey]) => {
                    const player = players[index];
                    if (player) {
                        // Check if a side-specific version of the route exists
                        if (playbook.routeLibrary[routeKey + routeSuffix]) {
                            routes[player] = routeKey + routeSuffix;
                        } else {
                            routes[player] = routeKey; // Fallback to non-suffixed version
                        }
                    }
                });
            }
        };

        if (fullFieldPlay) {
            const playDef = currentPlaybook.concepts.fullField[fullFieldPlay];
            if(playDef) {
                routes = { ...playDef.assignments };
            }
        } else {
            applyConcept(leftConcept, 'left');
            applyConcept(rightConcept, 'right');
        }

        // Apply Modifiers
        let finalPositions = { ...basePositions };
        activeModifiers.forEach(modName => {
            const modifier = currentPlaybook.modifiers[modName];
            if (modifier.type === 'positional') {
                routes[modifier.player] = modifier.assignment;
                if (modifier.position === 'mirrorH' && finalPositions.H && finalPositions.Q) {
                    const hPos = finalPositions.H;
                    finalPositions[modifier.player] = { x: -hPos.x, y: hPos.y };
                }
            }
            if (modifier.type === 'formationCompression') {
                const linemen = ['X', 'F', 'Y', 'C', 'Z', 'H'].filter(p => finalPositions[p] && finalPositions[p].y >= -10);
                const centerPos = finalPositions.C.x;
                const sortedLinemen = linemen.sort((a, b) => finalPositions[a].x - finalPositions[b].x);
                const centerIndex = sortedLinemen.findIndex(p => p === 'C');
                
                sortedLinemen.forEach((player, i) => {
                    finalPositions[player] = {
                        ...finalPositions[player],
                        x: centerPos + (i - centerIndex) * modifier.spacing
                    };
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

    const handleFormationSelect = (formationName) => {
        resetPlay();
        setSelectedFormation(formationName);
    };

    const handleStrengthSelect = (strength) => {
        setSelectedStrength(strength);
        setLeftConcept(null);
        setRightConcept(null);
        setFullFieldPlay(null);
    };
    
    const handleConceptSelect = (concept, side) => {
        setFullFieldPlay(null);
        if (side === 'left') {
            setLeftConcept(prev => prev === concept ? null : concept);
        } else {
            setRightConcept(prev => prev === concept ? null : concept);
        }
    };
    
    const handleFullFieldSelect = (playName) => {
        setLeftConcept(null);
        setRightConcept(null);
        setFullFieldPlay(prev => prev === playName ? null : playName);
    };

    const toggleModifier = (modName) => {
        setActiveModifiers(prev =>
            prev.includes(modName) ? prev.filter(m => m !== modName) : [...prev, modName]
        );
    };

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
            switch (step.type) {
                case 'stem':
                    currentY -= step.yards * YARD_SCALE;
                    path += ` L ${currentX} ${currentY}`;
                    break;
                case 'break':
                    const radians = (step.angle - 90) * (Math.PI / 180);
                    currentX += Math.cos(radians) * step.yards * YARD_SCALE;
                    currentY += Math.sin(radians) * step.yards * YARD_SCALE;
                    path += ` L ${currentX} ${currentY}`;
                    break;
                case 'release':
                    const relRadians = (step.angle - 90) * (Math.PI / 180);
                    const dX = Math.cos(relRadians) * step.yards * YARD_SCALE;
                    const dY = Math.sin(relRadians) * step.yards * YARD_SCALE;
                    currentX += dX;
                    currentY += dY;
                    path += ` l ${dX} ${dY}`;
                    break;
                case 'drag':
                    currentX += (step.direction === 'left' ? -1 : 1) * step.yards * YARD_SCALE;
                    path += ` L ${currentX} ${currentY}`;
                    break;
                case 'swing':
                     const controlX1 = startPos.x + (step.direction === 'left' ? -50 : 50);
                     const controlY1 = startPos.y + 30;
                     const controlX2 = startPos.x + (step.direction === 'left' ? -150 : 150);
                     const controlY2 = startPos.y + 30;
                     currentX = startPos.x + (step.direction === 'left' ? -200 : 200);
                     currentY = startPos.y + 10;
                     path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${currentX} ${currentY}`;
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
        if (!concepts) return null; // Return null if no concepts for this number of players

        const selectedConcept = side === 'left' ? leftConcept : rightConcept;

        return (
            <div className="bg-white rounded-lg shadow p-4 text-gray-900">
                <h2 className="text-xl font-bold mb-3 border-b pb-2 capitalize">{side} Side Concepts</h2>
                 <div className="grid grid-cols-2 gap-2">
                    {Object.keys(concepts).map(conceptName => {
                        const conceptDef = concepts[conceptName];
                        if (conceptDef.formation && conceptDef.formation !== selectedFormation) {
                            return null;
                        }
                        
                        return (
                            <button
                                key={conceptName}
                                onClick={() => handleConceptSelect(conceptName, side)}
                                className={`p-4 rounded-lg shadow transition-all text-sm font-semibold ${selectedConcept === conceptName ? 'bg-green-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}
                            >
                                {conceptName}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- JSX RENDER ---
    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            {/* Control Panel */}
            <div className="w-1/4 bg-gray-800 p-6 space-y-6 overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">MyFlagCoach</h1>
                    <button onClick={resetPlay} className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Reset</button>
                </div>

                {/* Formation Selection */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold mb-3 border-b pb-2 text-gray-900">1. Formation</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(currentPlaybook.formations).map(name => (
                            <button key={name} onClick={() => handleFormationSelect(name)} className={`p-4 rounded-lg shadow transition-all font-semibold ${selectedFormation === name ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>{name}</button>
                        ))}
                    </div>
                </div>

                {/* Strength Selection */}
                {selectedFormation && (
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-bold mb-3 border-b pb-2 text-gray-900">2. Strength</h2>
                        <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => handleStrengthSelect('Lt')} className={`p-4 rounded-lg shadow transition-all font-semibold ${selectedStrength === 'Lt' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>Left</button>
                           <button onClick={() => handleStrengthSelect('Rt')} className={`p-4 rounded-lg shadow transition-all font-semibold ${selectedStrength === 'Rt' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>Right</button>
                        </div>
                    </div>
                )}
                
                {/* Side Concepts & Full Field Plays */}
                {activeFormation && (
                    <div className="space-y-4">
                        {renderConceptButtons('left')}
                        {renderConceptButtons('right')}
                        <div className="bg-white rounded-lg shadow p-4 text-gray-900">
                            <h2 className="text-xl font-bold mb-3 border-b pb-2">Full Field Plays</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(currentPlaybook.concepts.fullField).map(([key, play]) => (
                                    play.formation === `${selectedFormation} ${selectedStrength}` && (
                                        <button key={key} onClick={() => handleFullFieldSelect(key)} className={`p-4 rounded-lg shadow transition-all text-sm font-semibold ${fullFieldPlay === key ? 'bg-green-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>
                                            {play.name}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                 {/* Modifiers */}
                <div className="bg-white rounded-lg shadow p-4">
                     <h2 className="text-xl font-bold mb-3 border-b pb-2 text-gray-900">Modifiers</h2>
                     <div className="grid grid-cols-2 gap-2">
                         {Object.keys(currentPlaybook.modifiers).map(name => (
                             <button key={name} onClick={() => toggleModifier(name)} className={`p-4 rounded-lg shadow transition-all font-semibold ${activeModifiers.includes(name) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>{name}</button>
                         ))}
                     </div>
                 </div>

            </div>

            {/* Main Content Area */}
            <div className="w-3/4 flex flex-col p-6">
                {/* Field View */}
                <div className="flex-grow bg-white rounded-lg shadow-inner relative">
                    <svg width="100%" height="100%" viewBox="-350 -250 700 300">
                        <g className="yard-markers" opacity="0.3">
                            <line x1="-350" y1="-10" x2="350" y2="-10" stroke="#4a5568" strokeWidth="1" />
                             {Array.from({ length: 13 }).map((_, i) => (
                                <line key={i} x1={-300 + i * 50} y1="-10" x2={-300 + i * 50} y2="-240" stroke="#4a5568" strokeWidth="1" strokeDasharray="2 4"/>
                             ))}
                        </g>

                        {/* Player Routes */}
                        <g className="routes">
                            {Object.entries(playerAssignments.routes).map(([player, routeKey]) => {
                                const startPos = playerAssignments.positions[player];
                                if (!startPos) return null;
                                const pathData = routeToPath(routeKey, startPos);
                                return <path key={player} d={pathData} stroke="#e53e3e" strokeWidth="3" fill="none" markerEnd="url(#arrow)" />;
                            })}
                        </g>

                        <g className="players">
                             {Object.entries(playerAssignments.positions).map(([player, pos]) => (
                                <g key={player} transform={`translate(${pos.x}, ${pos.y})`}>
                                    <circle r="15" fill="#2d3748" stroke="white" strokeWidth="2" />
                                    <text textAnchor="middle" dy=".3em" fill="white" fontSize="16" fontWeight="bold">{player}</text>
                                </g>
                            ))}
                        </g>
                        
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#e53e3e" />
                            </marker>
                        </defs>
                    </svg>
                </div>
                <div className="h-48 bg-white mt-6 rounded-lg shadow p-4 overflow-y-auto text-gray-900">
                    <h3 className="text-2xl font-bold mb-2">Player Responsibilities</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {['Q', 'C', 'H', 'X', 'Y', 'Z', 'F'].map(player => {
                             const routeKey = playerAssignments.routes[player];
                             const routeName = (currentPlaybook.routeLibrary[routeKey]?.name || routeKey || 'Block');
                            return (
                                <div key={player} className="flex items-baseline">
                                    <span className="font-bold text-lg w-8">{player}:</span>
                                    <span className="text-gray-700 capitalize">{routeName}</span>
                                </div>
                            );
                         })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- APPLICATION INITIALIZATION ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

