// app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let state = {
        playbook: null,
        selectedFormation: null,
        selectedLeftConcept: null,
        selectedRightConcept: null,
        activeModifiers: new Set(),
    };

    // --- DOM ELEMENT REFERENCES ---
    const dom = {
        formationButtons: document.getElementById('formation-buttons'),
        leftConceptButtons: document.getElementById('left-concept-buttons'),
        rightConceptButtons: document.getElementById('right-concept-buttons'),
        modifierButtons: document.getElementById('modifier-buttons'),
        playCanvas: document.getElementById('play-canvas'),
        display: document.getElementById('current-play-display'),
        resetButton: document.getElementById('reset-button'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
    };

    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    // --- INITIALIZATION ---
    function init() {
        state.playbook = defaultPlaybook; // Load the playbook from playbook.js
        populateFormationButtons();
        resetUIState();
        drawField(); // Initial draw of the empty field
        dom.resetButton.addEventListener('click', resetSelection);
    }

    // --- UI POPULATION ---

    function populateFormationButtons() {
        createButtons(Object.keys(state.playbook.formations), dom.formationButtons, handleFormationClick);
    }

    function populateConceptButtons() {
        if (!state.selectedFormation) return;

        const formationData = state.playbook.formations[state.selectedFormation];
        
        // Populate Left Concepts
        const leftCount = formationData.sides.left.count;
        const leftConcepts = getConceptsByPlayerCount(leftCount);
        createButtons(Object.keys(leftConcepts), dom.leftConceptButtons, handleLeftConceptClick);

        // Populate Right Concepts
        const rightCount = formationData.sides.right.count;
        const rightConcepts = getConceptsByPlayerCount(rightCount);
        createButtons(Object.keys(rightConcepts), dom.rightConceptButtons, handleRightConceptClick);
    }
    
    function populateModifierButtons() {
        createButtons(Object.keys(state.playbook.modifiers), dom.modifierButtons, handleModifierClick, 'modifier');
    }

    // --- EVENT HANDLERS ---

    function handleFormationClick(formationName) {
        if (state.selectedFormation === formationName) return; // No change
        
        resetSelection(false); // Soft reset, keeps the formation
        state.selectedFormation = formationName;
        
        updateActiveButton(dom.formationButtons, formationName);
        populateConceptButtons();
        populateModifierButtons();
        updateUIState();
        drawPlay();
    }

    function handleLeftConceptClick(conceptName) {
        state.selectedLeftConcept = conceptName;
        updateActiveButton(dom.leftConceptButtons, conceptName);
        drawPlay();
    }

    function handleRightConceptClick(conceptName) {
        state.selectedRightConcept = conceptName;
        updateActiveButton(dom.rightConceptButtons, conceptName);
        drawPlay();
    }

    function handleModifierClick(modifierName, btn) {
        if (state.activeModifiers.has(modifierName)) {
            state.activeModifiers.delete(modifierName);
            btn.classList.remove('active');
        } else {
            state.activeModifiers.add(modifierName);
            btn.classList.add('active');
        }
        drawPlay();
    }
    
    function resetSelection(fullReset = true) {
        state.selectedLeftConcept = null;
        state.selectedRightConcept = null;
        state.activeModifiers.clear();
        
        if (fullReset) {
            state.selectedFormation = null;
            resetUIState();
            drawField();
        } else {
             // Clear concepts but keep formation
            dom.leftConceptButtons.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            dom.rightConceptButtons.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        }
        
        dom.modifierButtons.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        updateDisplay();
    }

    // --- DRAWING LOGIC ---

    function drawField() {
        dom.playCanvas.innerHTML = ''; // Clear canvas
        // Line of Scrimmage
        const line = document.createElementNS(SVG_NAMESPACE, 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', '390');
        line.setAttribute('x2', '700');
        line.setAttribute('y2', '390');
        line.setAttribute('stroke', '#ffffff');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-dasharray', '10 10');
        dom.playCanvas.appendChild(line);
    }
    
    function drawPlay() {
        drawField();
        if (!state.selectedFormation) return;

        const formationData = state.playbook.formations[state.selectedFormation];
        let finalAssignments = getFinalAssignments();

        // Draw players and routes
        for (const player in formationData.positions) {
            const pos = formationData.positions[player];
            const routeKey = finalAssignments[player];
            
            drawPlayer(player, pos, routeKey);
        }
        updateDisplay();
    }

    function drawPlayer(player, pos, routeKey) {
        const routeData = state.playbook.routeLibrary[routeKey];
        
        const playerGroup = document.createElementNS(SVG_NAMESPACE, 'g');
        playerGroup.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

        // Draw Route
        if (routeData && routeData.path) {
            const routePath = document.createElementNS(SVG_NAMESPACE, 'path');
            routePath.setAttribute('d', routeData.path);
            routePath.setAttribute('stroke', 'yellow');
            routePath.setAttribute('stroke-width', '4');
            routePath.setAttribute('fill', 'none');
            routePath.setAttribute('stroke-linecap', 'round');
            playerGroup.appendChild(routePath);
        }
        
        // Draw Player Circle
        const playerCircle = document.createElementNS(SVG_NAMESPACE, 'circle');
        playerCircle.setAttribute('r', '18');
        playerCircle.setAttribute('fill', '#0a84ff');
        playerCircle.setAttribute('stroke', 'white');
        playerCircle.setAttribute('stroke-width', '3');
        
        // Draw Player Label
        const playerLabel = document.createElementNS(SVG_NAMESPACE, 'text');
        playerLabel.setAttribute('text-anchor', 'middle');
        playerLabel.setAttribute('dy', '.35em');
        playerLabel.setAttribute('font-size', '20');
        playerLabel.setAttribute('font-weight', 'bold');
        playerLabel.setAttribute('fill', 'white');
        playerLabel.textContent = player;
        
        playerGroup.appendChild(playerCircle);
        playerGroup.appendChild(playerLabel);
        dom.playCanvas.appendChild(playerGroup);
    }

    // --- HELPER & UTILITY FUNCTIONS ---

    function getFinalAssignments() {
        const formationData = state.playbook.formations[state.selectedFormation];
        let assignments = {};

        // 1. Apply Left Concept
        if (state.selectedLeftConcept) {
            const concept = state.playbook.concepts.twoMan[state.selectedLeftConcept] || state.playbook.concepts.threeMan[state.selectedLeftConcept];
            const sidePlayers = formationData.sides.left.players;
            for (const role in concept.assignments) {
                const player = sidePlayers[role];
                assignments[player] = concept.assignments[role];
            }
        }
        
        // 2. Apply Right Concept
        if (state.selectedRightConcept) {
            const concept = state.playbook.concepts.twoMan[state.selectedRightConcept] || state.playbook.concepts.threeMan[state.selectedRightConcept];
            const sidePlayers = formationData.sides.right.players;
            for (const role in concept.assignments) {
                const player = sidePlayers[role];
                assignments[player] = concept.assignments[role];
            }
        }

        // 3. Fill remaining players with 'block' as a default
        for(const player in formationData.positions){
            if(!assignments[player]){
                assignments[player] = 'block';
            }
        }

        // 4. Apply Modifiers (they override everything)
        state.activeModifiers.forEach(modName => {
            const modifier = state.playbook.modifiers[modName];
            for (const player in modifier) {
                assignments[player] = modifier[player];
            }
        });
        
        return assignments;
    }

    function updateDisplay() {
        const parts = [
            state.selectedFormation,
            state.selectedLeftConcept,
            state.selectedRightConcept,
            ...state.activeModifiers
        ].filter(Boolean); // Filter out null/undefined values
        
        if (parts.length > 0) {
            dom.display.textContent = parts.join(' ');
        } else {
            dom.display.textContent = 'Build your play...';
        }
    }

    function createButtons(items, container, onClick, type = 'default') {
        container.innerHTML = ''; // Clear existing buttons or placeholder
        if (items.length === 0) {
            container.innerHTML = '<p class="placeholder">N/A</p>';
            return;
        }
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = `control-btn ${type}`;
            btn.textContent = item;
            btn.dataset.value = item;
            btn.addEventListener('click', () => onClick(item, btn));
            container.appendChild(btn);
        });
    }
    
    function getConceptsByPlayerCount(count) {
        if (count === 2) return state.playbook.concepts.twoMan;
        if (count === 3) return state.playbook.concepts.threeMan;
        return {};
    }

    function updateActiveButton(container, value) {
        container.querySelectorAll('.control-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.value === value);
        });
    }

    function resetUIState() {
        ['.control-btn.active', '.modifier.active'].forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.classList.remove('active'));
        });
        
        dom.leftConceptButtons.innerHTML = '<p class="placeholder">Select a Formation</p>';
        dom.rightConceptButtons.innerHTML = '<p class="placeholder">Select a Formation</p>';
        dom.modifierButtons.innerHTML = '<p class="placeholder">Select a Formation</p>';
        
        updateUIState();
    }
    
    function updateUIState() {
        // Enable/disable concept and modifier panels
        const isFormationSelected = !!state.selectedFormation;
        dom.step2.classList.toggle('disabled', !isFormationSelected);
        dom.step3.classList.toggle('disabled', !isFormationSelected);
        dom.step4.classList.toggle('disabled', !isFormationSelected);
    }
    
    // --- START THE APP ---
    init();
});

