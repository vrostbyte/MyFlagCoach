document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let state = {
        playbook: null,
        selectedBaseFormation: null,
        selectedStrength: null,
        selectedLeftConcept: null,
        selectedRightConcept: null,
        selectedModifier: null,
        currentAssignments: {}
    };

    // --- DOM ELEMENTS ---
    const formationContainer = document.getElementById('formation-buttons');
    const strengthContainer = document.getElementById('strength-buttons');
    const leftConceptContainer = document.getElementById('left-concept-buttons');
    const rightConceptContainer = document.getElementById('right-concept-buttons');
    const fullFieldContainer = document.getElementById('full-field-buttons');
    const modifierContainer = document.getElementById('modifier-buttons');
    const assignmentsTableBody = document.querySelector('#assignments-table tbody');
    const playCanvas = document.getElementById('play-canvas');
    const currentPlayDisplay = document.getElementById('current-play-display');
    const playbookFileInput = document.getElementById('playbook-file');
    const uploadButton = document.getElementById('upload-button');
    const resetButton = document.getElementById('reset-button');
    const svgNamespace = "http://www.w3.org/2000/svg";

    // --- INITIALIZATION ---
    function initializeApp() {
        loadPlaybook();
        setupEventListeners();
        renderUI();
    }

    function loadPlaybook() {
        try {
            const savedPlaybook = localStorage.getItem('customPlaybook');
            state.playbook = savedPlaybook ? JSON.parse(savedPlaybook) : defaultPlaybook;
        } catch (error) {
            console.error("Failed to load or parse playbook:", error);
            state.playbook = defaultPlaybook;
        }
    }
    
    function setupEventListeners() {
        uploadButton.addEventListener('click', () => playbookFileInput.click());
        playbookFileInput.addEventListener('change', handleFileUpload);
        resetButton.addEventListener('click', resetPlay);
    }
    
    // --- UI RENDERING ---
    function renderUI() {
        renderFormationButtons();
        renderStrengthButtons();
        renderConceptButtons();
        renderFullFieldButtons();
        renderModifierButtons();
        drawField();
        renderAssignmentsTable(); // NEW Call
        updateDisplay();
    }

    function renderFormationButtons() {
        createButtons(Object.keys(state.playbook.formations), formationContainer, handleFormationSelect, state.selectedBaseFormation);
    }

    function renderStrengthButtons() {
        const strengths = state.selectedBaseFormation ? Object.keys(state.playbook.formations[state.selectedBaseFormation]) : [];
        createButtons(strengths, strengthContainer, handleStrengthSelect, state.selectedStrength);
    }

    function renderConceptButtons() {
        // ... (same as before)
    }

    function renderFullFieldButtons() {
        // ... (same as before)
    }

    function renderModifierButtons() {
        // ... (same as before)
    }
    
    function populateConceptContainer(sideInfo, container, handler, activeItem) {
        // ... (same as before)
    }

    function createButtons(items, container, onClick, activeItem) {
        // ... (same as before)
    }
    
    // --- NEW: ASSIGNMENTS TABLE RENDERER ---
    function renderAssignmentsTable() {
        assignmentsTableBody.innerHTML = '';
        const playerOrder = ['Q', 'C', 'H', 'X', 'Y', 'Z', 'F'];

        const finalAssignments = calculateFinalAssignments();

        playerOrder.forEach(player => {
            const routeKey = finalAssignments[player];
            const routeName = routeKey ? state.playbook.routeLibrary[routeKey]?.name || routeKey : '-';
            
            const row = assignmentsTableBody.insertRow();
            const cellPos = row.insertCell(0);
            const cellAssign = row.insertCell(1);

            cellPos.textContent = player;
            cellAssign.textContent = routeName;
        });
    }


    // --- EVENT HANDLERS ---
    function handleFormationSelect(formationName) {
        state.selectedBaseFormation = formationName;
        resetSelections(['selectedStrength', 'selectedLeftConcept', 'selectedRightConcept', 'selectedModifier']);
        renderUI();
    }

    function handleStrengthSelect(strength) {
        state.selectedStrength = strength;
        resetSelections(['selectedLeftConcept', 'selectedRightConcept', 'selectedModifier']);
        applyFormation();
        renderUI();
    }

    function handleConceptSelect(conceptName, side) {
        // ... (same as before)
    }
    
    const handleLeftConceptSelect = (name) => handleConceptSelect(name, 'left');
    const handleRightConceptSelect = (name) => handleConceptSelect(name, 'right');

    function handleFullFieldSelect(playName) {
        // ... (same as before)
    }
    
    function handleModifierSelect(modifierName) {
        state.selectedModifier = (state.selectedModifier === modifierName) ? null : modifierName;
        renderUI();
    }

    function handleFileUpload(event) {
        // ... (same as before)
    }

    // --- LOGIC ---
    function resetPlay() {
        resetSelections();
        renderUI();
    }

    function resetSelections(props = Object.keys(state).filter(k => k.startsWith('selected'))) {
        props.forEach(prop => state[prop] = null);
        state.currentAssignments = {};
    }

    function applyFormation() {
        state.currentAssignments = {};
        if (!state.selectedBaseFormation || !state.selectedStrength) return;

        // Set default assignments
        state.currentAssignments['H'] = 'block';
        state.currentAssignments['C'] = 'block';
        state.currentAssignments['Q'] = 'block'; // QB is implicitly a passer, 'block' here means non-receiver

        const formationData = state.playbook.formations[state.selectedBaseFormation][state.selectedStrength];
        Object.keys(formationData.positions).forEach(player => {
            if (!state.currentAssignments[player]) {
                state.currentAssignments[player] = null; // Placeholder for receivers
            }
        });
    }

    function applySideConcepts() {
        applyFormation();
        if (state.selectedLeftConcept) applyConceptToSide(state.selectedLeftConcept, 'left');
        if (state.selectedRightConcept) applyConceptToSide(state.selectedRightConcept, 'right');
    }

    function applyConceptToSide(conceptName, side) {
        // ... (same as before)
    }

    function calculateFinalAssignments() {
        const { playbook, selectedBaseFormation, selectedStrength, currentAssignments, selectedModifier } = state;
        let finalAssignments = { ...currentAssignments };

        if (selectedModifier && playbook.modifiers[selectedModifier]) {
            const modifier = playbook.modifiers[selectedModifier];
            if (modifier.player && modifier.assignment) {
                finalAssignments[modifier.player] = modifier.assignment;
            }
        }
        return finalAssignments;
    }

    function applyTightFormation(positions, spacing) {
        // ... (same as before)
    }


    // --- DRAWING ---
    function drawField() {
        playCanvas.innerHTML = '';
        drawScrimmageLine();
        const { playbook, selectedBaseFormation, selectedStrength, selectedModifier } = state;
        if (!playbook || !selectedBaseFormation || !selectedStrength) return;
        
        const formation = playbook.formations[selectedBaseFormation][selectedStrength];
        if (!formation) return;
        
        let finalAssignments = calculateFinalAssignments();
        let finalPositions = JSON.parse(JSON.stringify(formation.positions));

        // Apply Position-Altering Modifiers
        if (selectedModifier && playbook.modifiers[selectedModifier]) {
            const modifier = playbook.modifiers[selectedModifier];
            
            if (modifier.player && modifier.position === 'mirrorH') {
                const qPos = finalPositions['Q'];
                const hPos = finalPositions['H'];
                if (qPos && hPos) {
                    const dx = hPos.x - qPos.x;
                    const dy = hPos.y - qPos.y;
                    finalPositions[modifier.player] = { x: qPos.x - dx, y: qPos.y - dy };
                }
            }

            if (modifier.type === 'formationCompression') {
                finalPositions = applyTightFormation(finalPositions, modifier.spacing);
            }
        }

        Object.keys(formation.positions).forEach(player => {
            if (finalPositions[player]) {
                const routeKey = finalAssignments[player];
                const route = playbook.routeLibrary[routeKey];
                const isRight = finalPositions[player].x > playCanvas.viewBox.baseVal.width / 2;
                drawPlayer(player, finalPositions[player], route, isRight);
            }
        });
    }

    function drawScrimmageLine() {
        const line = document.createElementNS(svgNamespace, 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', '385');
        line.setAttribute('x2', '700');
        line.setAttribute('y2', '385');
        line.setAttribute('stroke', 'rgba(255,255,255,0.7)');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5 5');
        playCanvas.appendChild(line);
    }
    
    function drawPlayer(label, pos, route, isRightSide) {
        const group = document.createElementNS(svgNamespace, 'g');
        group.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

        if (route && route.path) {
            const path = document.createElementNS(svgNamespace, 'path');
            path.setAttribute('d', route.path);
            path.setAttribute('stroke', "yellow");
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('marker-end', 'url(#arrow)');
            // Flip path for right side if needed (future feature)
            group.appendChild(path);
        }

        const circle = document.createElementNS(svgNamespace, 'circle');
        circle.setAttribute('r', '18');
        circle.setAttribute('fill', 'rgba(0, 0, 0, 0.5)');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        group.appendChild(circle);

        const text = document.createElementNS(svgNamespace, 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.35em');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '16px');
        text.setAttribute('font-weight', 'bold');
        text.textContent = label;
        group.appendChild(text);

        playCanvas.appendChild(group);
    }

    function updateDisplay() {
        const { selectedBaseFormation, selectedStrength, selectedLeftConcept, selectedRightConcept, selectedModifier } = state;
        
        let playCall = "";
        if (selectedModifier) playCall += `${selectedModifier} `;
        playCall += `${selectedBaseFormation || '...'} ${selectedStrength || ''}`;

        if (selectedLeftConcept && state.playbook.concepts.fullField[selectedLeftConcept]) {
            playCall = `${selectedModifier ? selectedModifier + ' ' : ''}${state.playbook.concepts.fullField[selectedLeftConcept].formation} ${selectedLeftConcept}`;
        } else {
            playCall += ` > ${selectedLeftConcept || '...'} | ${selectedRightConcept || '...'}`;
        }
        currentPlayDisplay.textContent = playCall.trim().replace(/\s+/g, ' ');
    }

    initializeApp();
});
