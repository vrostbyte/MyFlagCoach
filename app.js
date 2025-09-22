// app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let state = {
        playbook: null,
        selectedBaseFormation: null,
        selectedStrength: null, // 'Lt' or 'Rt'
        selectedLeftConcept: null,
        selectedRightConcept: null,
        activeModifiers: new Set(),
    };

    // --- DOM ELEMENT REFERENCES ---
    const dom = {
        formationButtons: document.getElementById('formation-buttons'),
        strengthButtons: document.getElementById('strength-buttons'),
        leftConceptButtons: document.getElementById('left-concept-buttons'),
        rightConceptButtons: document.getElementById('right-concept-buttons'),
        modifierButtons: document.getElementById('modifier-buttons'),
        playCanvas: document.getElementById('play-canvas'),
        display: document.getElementById('current-play-display'),
        resetButton: document.getElementById('reset-button'),
        // Control Group Steps
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
        step5: document.getElementById('step5'),
    };

    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    // --- INITIALIZATION ---
    function init() {
        // In a real app, you might load this from a file or API.
        // For now, it uses the global `defaultPlaybook` from playbook.js
        state.playbook = defaultPlaybook; 
        
        populateFormationButtons();
        resetUIState();
        drawField();
        dom.resetButton.addEventListener('click', resetSelection);
    }

    // --- UI POPULATION ---

    function populateFormationButtons() {
        createButtons(Object.keys(state.playbook.formations), dom.formationButtons, handleBaseFormationClick);
    }
    
    function populateStrengthButtons() {
        if (!state.selectedBaseFormation) return;
        const strengths = Object.keys(state.playbook.formations[state.selectedBaseFormation]);
        createButtons(strengths, dom.strengthButtons, handleStrengthClick);
    }

    function populateConceptButtons() {
        if (!state.selectedBaseFormation || !state.selectedStrength) return;

        const formationData = state.playbook.formations[state.selectedBaseFormation][state.selectedStrength];
        
        const leftCount = formationData.sides.left.count;
        const leftConcepts = getConceptsByPlayerCount(leftCount);
        createButtons(Object.keys(leftConcepts), dom.leftConceptButtons, handleLeftConceptClick);

        const rightCount = formationData.sides.right.count;
        const rightConcepts = getConceptsByPlayerCount(rightCount);
        createButtons(Object.keys(rightConcepts), dom.rightConceptButtons, handleRightConceptClick);
    }
    
    function populateModifierButtons() {
        createButtons(Object.keys(state.playbook.modifiers), dom.modifierButtons, handleModifierClick, 'modifier');
    }

    // --- EVENT HANDLERS ---

    function handleBaseFormationClick(baseFormationName) {
        if (state.selectedBaseFormation === baseFormationName) return;
        
        resetSelection(false); // Soft reset
        state.selectedBaseFormation = baseFormationName;
        
        updateActiveButton(dom.formationButtons, baseFormationName);
        populateStrengthButtons();
        updateUIState();
        updateDisplay();
    }
    
    function handleStrengthClick(strength) {
        state.selectedStrength = strength;
        
        updateActiveButton(dom.strengthButtons, strength);
        populateConceptButtons();
        populateModifierButtons();
        updateUIState();
        drawPlay(); // First draw happens here
    }

    function handleLeftConceptClick(conceptName) {
        state.selectedLeftConcept = (state.selectedLeftConcept === conceptName) ? null : conceptName;
        updateActiveButton(dom.leftConceptButtons, state.selectedLeftConcept);
        drawPlay();
    }

    function handleRightConceptClick(conceptName) {
        state.selectedRightConcept = (state.selectedRightConcept === conceptName) ? null : conceptName;
        updateActiveButton(dom.rightConceptButtons, state.selectedRightConcept);
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
        if (fullReset) {
            state.selectedBaseFormation = null;
        }
        state.selectedStrength = null;
        state.selectedLeftConcept = null;
        state.selectedRightConcept = null;
        state.activeModifiers.clear();
        
        resetUIState();
        drawField();
        updateDisplay();
    }

    // --- DRAWING LOGIC ---

    function drawField() {
        dom.playCanvas.innerHTML = '';
        const line = document.createElementNS(SVG_NAMESPACE, 'line');
        line.setAttribute('x1', '0'); line.setAttribute('y1', '390');
        line.setAttribute('x2', '700'); line.setAttribute('y2', '390');
        line.setAttribute('stroke', '#ffffff'); line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-dasharray', '10 10');
        dom.playCanvas.appendChild(line);
    }
    
    function drawPlay() {
        drawField();
        if (!state.selectedBaseFormation || !state.selectedStrength) return;

        const formationData = state.playbook.formations[state.selectedBaseFormation][state.selectedStrength];
        let finalAssignments = getFinalAssignments(formationData);

        for (const player in formationData.positions) {
            const pos = formationData.positions[player];
            const routeKey = finalAssignments[player];
            drawPlayer(player, pos, routeKey);
        }
        updateDisplay();
    }

    function drawPlayer(player, pos, routeKey) {
        const routeData = state.playbook.routeLibrary[routeKey];
        const group = document.createElementNS(SVG_NAMESPACE, 'g');
        group.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

        if (routeData && routeData.path) {
            const path = document.createElementNS(SVG_NAMESPACE, 'path');
            path.setAttribute('d', routeData.path);
            path.setAttribute('stroke', 'yellow'); path.setAttribute('stroke-width', '4');
            path.setAttribute('fill', 'none'); path.setAttribute('stroke-linecap', 'round');
            group.appendChild(path);
        }
        
        const circle = document.createElementNS(SVG_NAMESPACE, 'circle');
        circle.setAttribute('r', '18'); circle.setAttribute('fill', '#0a84ff');
        circle.setAttribute('stroke', 'white'); circle.setAttribute('stroke-width', '3');
        
        const label = document.createElementNS(SVG_NAMESPACE, 'text');
        label.setAttribute('text-anchor', 'middle'); label.setAttribute('dy', '.35em');
        label.setAttribute('font-size', '20'); label.setAttribute('font-weight', 'bold');
        label.setAttribute('fill', 'white'); label.textContent = player;
        
        group.appendChild(circle);
        group.appendChild(label);
        dom.playCanvas.appendChild(group);
    }

    // --- HELPER & UTILITY FUNCTIONS ---

    function getFinalAssignments(formationData) {
        let assignments = {};

        if (state.selectedLeftConcept) {
            const concept = getConceptByName(state.selectedLeftConcept);
            const sidePlayers = formationData.sides.left.players;
            for (const role in concept.assignments) {
                assignments[sidePlayers[role]] = concept.assignments[role];
            }
        }
        
        if (state.selectedRightConcept) {
            const concept = getConceptByName(state.selectedRightConcept);
            const sidePlayers = formationData.sides.right.players;
            for (const role in concept.assignments) {
                assignments[sidePlayers[role]] = concept.assignments[role];
            }
        }

        for (const player in formationData.positions) {
            if (!assignments[player]) assignments[player] = 'block';
        }

        state.activeModifiers.forEach(modName => {
            const modifier = state.playbook.modifiers[modName];
            for (const player in modifier) {
                assignments[player] = modifier[player];
            }
        });
        
        return assignments;
    }

    function updateDisplay() {
        const formationName = state.selectedBaseFormation ? `${state.selectedBaseFormation} ${state.selectedStrength || ''}`.trim() : '';
        const parts = [
            formationName,
            state.selectedLeftConcept,
            state.selectedRightConcept,
            ...state.activeModifiers
        ].filter(Boolean);
        dom.display.textContent = parts.length > 0 ? parts.join(' ') : 'Build your play...';
    }

    function createButtons(items, container, onClick, type = 'default') {
        container.innerHTML = '';
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
        if (count === 1) return state.playbook.concepts.oneMan;
        if (count === 2) return state.playbook.concepts.twoMan;
        if (count === 3) return state.playbook.concepts.threeMan;
        return {};
    }
    
    function getConceptByName(name) {
        return {
            ...state.playbook.concepts.oneMan,
            ...state.playbook.concepts.twoMan,
            ...state.playbook.concepts.threeMan
        }[name];
    }

    function updateActiveButton(container, value) {
        container.querySelectorAll('.control-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.value === value);
        });
    }

    function resetUIState() {
        if (state.selectedBaseFormation === null) {
            dom.formationButtons.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            dom.step2.classList.add('disabled');
            dom.strengthButtons.innerHTML = '<p class="placeholder">Select a Formation</p>';
        }
        
        dom.strengthButtons.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
        dom.step3.classList.add('disabled');
        dom.step4.classList.add('disabled');
        dom.step5.classList.add('disabled');

        dom.leftConceptButtons.innerHTML = '<p class="placeholder">Select Strength</p>';
        dom.rightConceptButtons.innerHTML = '<p class="placeholder">Select Strength</p>';
        dom.modifierButtons.innerHTML = '<p class="placeholder">Select Strength</p>';
    }
    
    function updateUIState() {
        const baseSelected = !!state.selectedBaseFormation;
        const strengthSelected = !!state.selectedStrength;

        dom.step2.classList.toggle('disabled', !baseSelected);
        dom.step3.classList.toggle('disabled', !strengthSelected);
        dom.step4.classList.toggle('disabled', !strengthSelected);
        dom.step5.classList.toggle('disabled', !strengthSelected);
    }
    
    init();
});

