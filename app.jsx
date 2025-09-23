const { useState, useMemo } = React;

// --- UTILITY FUNCTIONS ---
const YARDS_TO_PIXELS = 12;

// The "Playbook Brain" - converts route definitions into SVG paths
const generateRoutePath = (route, startPos, side) => {
    if (!route || !route.steps || route.steps.length === 0) return "";
    let path = `M ${startPos.x} ${startPos.y}`;
    let currentX = startPos.x;
    let currentY = startPos.y;

    route.steps.forEach(step => {
        const yards = step.yards * YARDS_TO_PIXELS;
        let angleRad = 0;
        
        switch (step.type) {
            case 'stem':
                currentY -= yards;
                break;
            case 'break':
            case 'release':
                const angleDeg = side === 'left' ? step.angle : -step.angle;
                angleRad = (angleDeg - 90) * (Math.PI / 180);
                currentX += yards * Math.cos(angleRad);
                currentY += yards * Math.sin(angleRad);
                break;
        }
        path += ` L ${currentX} ${currentY}`;
    });
    return path;
};

// --- REACT COMPONENTS ---

// Player Component: Renders a single player circle and label
const Player = ({ player, pos }) => (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
        <circle r="20" fill="white" stroke="#374151" strokeWidth="3" />
        <text
            textAnchor="middle"
            dy=".3em"
            className="text-xl font-bold text-gray-800 select-none"
        >
            {player}
        </text>
    </g>
);

// Route Component: Renders a single route path
const Route = ({ routeKey, startPos, side }) => {
    const routeData = playbook.routeLibrary[routeKey];
    if (!routeData) return null;

    // A simple way to get a color based on the route name for variety
    const color = useMemo(() => {
        const colors = ['#ef4444', '#3b82f6', '#f97316', '#8b5cf6', '#14b8a6'];
        let hash = 0;
        for (let i = 0; i < routeKey.length; i++) {
            hash = routeKey.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }, [routeKey]);
    
    // Generate the path using the new, smarter utility
    const path = useMemo(() => {
        const startPoint = { x: 0, y: 0 }; // Path is relative to the player's group
        let p = `M ${startPoint.x} ${startPoint.y}`;
        let currentX = startPoint.x;
        let currentY = startPoint.y;

        routeData.steps.forEach(step => {
            const yards = step.yards * YARDS_TO_PIXELS;
            let angleRad = 0;
            
            // Adjust angle for side of the field
            const effectiveAngle = side === 'left' ? (step.angle || 0) : -(step.angle || 0);

            switch (step.type) {
                case 'stem':
                    currentY -= yards;
                    break;
                case 'break':
                case 'release':
                    angleRad = (effectiveAngle - 90) * (Math.PI / 180);
                    currentX += yards * Math.cos(angleRad);
                    currentY += yards * Math.sin(angleRad);
                    break;
            }
            p += ` L ${currentX.toFixed(2)} ${currentY.toFixed(2)}`;
        });
        return p;

    }, [routeData, side]);

    return (
        <g transform={`translate(${startPos.x}, ${startPos.y})`}>
            <path d={path} stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    );
};


// Field Component: The main display area for the play
const Field = ({ formation, assignments }) => {
    if (!formation) return (
        <div className="flex-1 bg-white rounded-lg shadow-inner flex items-center justify-center">
            <p className="text-gray-400 text-2xl">Select a Formation</p>
        </div>
    );
    
    return (
        <div className="flex-1 bg-white rounded-lg shadow-inner p-4">
            <svg viewBox="0 0 700 600" className="w-full h-full">
                {/* Yard Markers */}
                {[...Array(10)].map((_, i) => (
                    <line key={i} x1="0" y1={380 - (i + 1) * 5 * YARDS_TO_PIXELS} x2="700" y2={380 - (i + 1) * 5 * YARDS_TO_PIXELS} stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,10" />
                ))}
                {/* Line of Scrimmage */}
                <line x1="0" y1="380" x2="700" y2="380" stroke="#4b5563" strokeWidth="3" />

                {/* Draw Routes */}
                {Object.entries(assignments).map(([player, routeKey]) => {
                    if (routeKey && formation.positions[player]) {
                         const side = Object.values(formation.sides.left.players).includes(player) ? 'left' : 'right';
                         return <Route key={player} routeKey={`${routeKey}_${side.toUpperCase()}`} startPos={formation.positions[player]} side={side} />;
                    }
                    return null;
                })}

                {/* Draw Players */}
                {Object.entries(formation.positions).map(([player, pos]) => (
                    <Player key={player} player={player} pos={pos} />
                ))}
            </svg>
        </div>
    );
};

// Main App Component
function App() {
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [selectedStrength, setSelectedStrength] = useState(null);
    const [leftConcept, setLeftConcept] = useState(null);
    const [rightConcept, setRightConcept] = useState(null);
    const [fullFieldPlay, setFullFieldPlay] = useState(null);

    const currentFormationData = useMemo(() => {
        if (selectedFormation && selectedStrength) {
            return playbook.formations[selectedFormation]?.[selectedStrength];
        }
        return null;
    }, [selectedFormation, selectedStrength]);

    const handleFormationSelect = (formation) => {
        setSelectedFormation(formation);
        setSelectedStrength(null);
        setLeftConcept(null);
        setRightConcept(null);
        setFullFieldPlay(null);
    };

    const handleStrengthSelect = (strength) => {
        setSelectedStrength(strength);
    };
    
    const handleConceptSelect = (side, concept) => {
        if (side === 'left') setLeftConcept(concept);
        if (side === 'right') setRightConcept(concept);
        setFullFieldPlay(null);
    }
    
     const handleFullFieldSelect = (play) => {
        setFullFieldPlay(play);
        setLeftConcept(null);
        setRightConcept(null);
    };
    
    const assignments = useMemo(() => {
        const newAssignments = { C: 'block', H: 'block' };
        if (!currentFormationData) return newAssignments;

        if(fullFieldPlay) {
             return playbook.concepts.fullField[fullFieldPlay].assignments;
        }

        const processSide = (side, conceptName) => {
            const sideData = currentFormationData.sides[side];
            const conceptData = playbook.concepts[`${sideData.count}Man`]?.[conceptName];
            if (!conceptData) return;
            
            Object.entries(conceptData.assignments).forEach(([pos, route]) => {
                 const player = sideData.players[pos];
                 if(player) newAssignments[player] = route;
            });

            if (conceptData.usesCenter) {
                newAssignments['C'] = conceptData.assignments.inner;
            }
        };

        if (leftConcept) processSide('left', leftConcept);
        if (rightConcept) processSide('right', rightConcept);
        
        return newAssignments;
    }, [currentFormationData, leftConcept, rightConcept, fullFieldPlay]);
    
    const renderConceptButtons = (side) => {
        if (!currentFormationData) return null;
        const sideData = currentFormationData.sides[side];
        const conceptType = `${sideData.count}Man`;
        
        return (
            <div>
                <h3 className="font-bold text-lg mb-2 capitalize">{side} Side Concepts</h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(playbook.concepts[conceptType]).map(concept => (
                         <button key={concept} onClick={() => handleConceptSelect(side, concept)} className="p-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all text-sm">
                            {concept}
                        </button>
                    ))}
                </div>
            </div>
        )
    };

    return (
        <div className="h-screen w-screen flex flex-col p-4 bg-gray-200 gap-4">
            <header className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">MyFlagCoach <span className="text-blue-600">Phoenix</span></h1>
                 <p className="text-gray-600">
                    {selectedFormation || 'Select Formation'} 
                    {selectedStrength ? ` > ${selectedStrength}` : ''} 
                    {leftConcept ? ` > L: ${leftConcept}` : ''}
                    {rightConcept ? ` > R: ${rightConcept}` : ''}
                    {fullFieldPlay ? ` > ${fullFieldPlay}` : ''}
                </p>
            </header>

            <main className="flex-1 flex gap-4 min-h-0">
                <div className="w-1/4 flex flex-col gap-4 overflow-y-auto pr-2">
                    {/* Formation Selection */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-bold mb-3 border-b pb-2">1. Formation</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(playbook.formations).map(f => (
                                <button key={f} onClick={() => handleFormationSelect(f)} className={`p-4 rounded-lg shadow transition-all ${selectedFormation === f ? 'bg-green-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                     {/* Strength Selection */}
                    {selectedFormation && (
                         <div className="bg-white rounded-lg shadow p-4">
                             <h2 className="text-xl font-bold mb-3 border-b pb-2">2. Strength</h2>
                             <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleStrengthSelect('Lt')} className={`p-4 rounded-lg shadow transition-all ${selectedStrength === 'Lt' ? 'bg-green-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>Left</button>
                                <button onClick={() => handleStrengthSelect('Rt')} className={`p-4 rounded-lg shadow transition-all ${selectedStrength === 'Rt' ? 'bg-green-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>Right</button>
                             </div>
                         </div>
                    )}

                    {/* Concept Selection */}
                    {currentFormationData && (
                        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
                             <h2 className="text-xl font-bold mb-3 border-b pb-2">3. Concepts</h2>
                             {renderConceptButtons('left')}
                             {renderConceptButtons('right')}
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <Field formation={currentFormationData} assignments={assignments} />
                    {/* Assignments Table can be added here */}
                </div>
            </main>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

