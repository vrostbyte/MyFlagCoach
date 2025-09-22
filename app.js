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
    const loadDefaultButton = document.getElementById('load-default-button');
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
        loadDefaultButton.addEventListener('click', handleLoadDefault);
    }
    
    // --- UI RENDERING ---
    function renderUI() {
        renderFormationButtons();
        renderStrengthButtons();
        renderConceptButtons();
        renderFullFieldButtons();
        renderModifierButtons();
        drawField();
        renderAssignmentsTable();
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
        if (!state.selectedBaseFormation || !state.selectedStrength) {
            leftConceptContainer.innerHTML = '<p class="placeholder-text">Select Formation & Strength</p>';
            rightConceptContainer.innerHTML = '<p class="placeholder-text">Select Formation & Strength</p>';
            return;
        }
        const formationData = state.playbook.formations[state.selectedBaseFormation][state.selectedStrength];
        populateConceptContainer(formationData.sides.left, leftConceptContainer, handleLeftConceptSelect, state.selectedLeftConcept);
        populateConceptContainer(formationData.sides.right, rightConceptContainer, handleRightConceptSelect, state.selectedRightConcept);
    }

    function renderFullFieldButtons() {
        fullFieldContainer.innerHTML = '';
        document.getElementById('full-field-container').style.display = 'none';

        if (!state.selectedBaseFormation || !state.selectedStrength) return;

        const fullFormationName = `${state.selectedBaseFormation} ${state.selectedStrength}`;
        const plays = state.playbook.concepts.fullField || {};
        const availablePlays = Object.keys(plays).filter(key => plays[key].formation === fullFormationName);

        if (availablePlays.length > 0) {
            document.getElementById('full-field-container').style.display = 'block';
            createButtons(availablePlays, fullFieldContainer, handleFullFieldSelect, state.selectedLeftConcept);
        }
    }

    function renderModifierButtons() {
        if (!state.selectedBaseFormation || !state.selectedStrength) {
             modifierContainer.innerHTML = '<p class="placeholder-text">Select Formation & Strength</p>';
            return;
        }
        const modifiers = Object.keys(state.playbook.modifiers || {});
        createButtons(modifiers, modifierContainer, handleModifierSelect, state.selectedModifier);
    }
    
    function populateConceptContainer(sideInfo, container, handler, activeItem) {
        const countMap = { 1: 'oneMan', 2: 'twoMan', 3: 'threeMan' };
        let availableConcepts = [];
        const conceptType = countMap[sideInfo.count];
        if (conceptType) availableConcepts.push(...Object.keys(state.playbook.concepts[conceptType] || {}));
        
        if (sideInfo.count === 2) {
            Object.entries(state.playbook.concepts.threeMan || {}).forEach(([name, concept]) => {
                if (concept.usesCenter) availableConcepts.push(name);
            });
        }
        createButtons(availableConcepts, container, handler, activeItem);
    }

    function createButtons(items, container, onClick, activeItem) {
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = '<p class="placeholder-text">-</p>';
            return;
        }
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.textContent = item;
            btn.dataset.value = item;
            if (item === activeItem) btn.classList.add('active');
            btn.addEventListener('click', () => onClick(item));
            container.appendChild(btn);
        });
    }
    
    function renderAssignmentsTable() {
        assignmentsTableBody.innerHTML = '';
        const playerOrder = ['Q', 'C', 'H', 'X', 'Y', 'Z', 'F'];
        const finalAssignments = calculateFinalAssignments();
        playerOrder.forEach(player => {
            const routeKey = finalAssignments[player];
            const routeName = routeKey ? state.playbook.routeLibrary[routeKey]?.name || routeKey : '-';
            const row = assignmentsTableBody.insertRow();
            row.insertCell(0).textContent = player;
            row.insertCell(1).textContent = routeName;
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
        if (side === 'left') state.selectedLeftConcept = (state.selectedLeftConcept === conceptName) ? null : conceptName;
        if (side === 'right') state.selectedRightConcept = (state.selectedRightConcept === conceptName) ? null : conceptName;
        state.selectedLeftConcept = state.selectedLeftConcept === conceptName && side === 'left' ? null : state.selectedLeftConcept;
        if (state.playbook.concepts.fullField[state.selectedLeftConcept]) resetSelections(['selectedRightConcept', 'selectedModifier']);
        applySideConcepts();
        renderUI();
    }
    
    const handleLeftConceptSelect = (name) => handleConceptSelect(name, 'left');
    const handleRightConceptSelect = (name) => handleConceptSelect(name, 'right');

    function handleFullFieldSelect(playName) {
        const isDeselecting = state.selectedLeftConcept === playName;
        resetSelections(['selectedLeftConcept', 'selectedRightConcept', 'selectedModifier']);
        if (!isDeselecting) {
            const play = state.playbook.concepts.fullField[playName];
            if (play) {
                state.currentAssignments = { ...play.assignments };
                state.selectedLeftConcept = playName;
            }
        }
        renderUI();
    }
    
    function handleModifierSelect(modifierName) {
        state.selectedModifier = (state.selectedModifier === modifierName) ? null : modifierName;
        renderUI();
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const customPlaybook = JSON.parse(e.target.result);
                localStorage.setItem('customPlaybook', JSON.stringify(customPlaybook));
                resetPlay();
            } catch (error) {
                console.error("Error parsing playbook file:", error);
                alert("Invalid playbook file. Please upload a valid JSON file.");
            }
        };
        reader.readAsText(file);
        playbookFileInput.value = '';
    }

    function handleLoadDefault() {
        localStorage.removeItem('customPlaybook');
        resetPlay();
    }

    // --- LOGIC ---
    function resetPlay() {
        resetSelections();
        initializeApp();
    }

    function resetSelections(props = Object.keys(state).filter(k => k.startsWith('selected'))) {
        props.forEach(prop => state[prop] = null);
        state.currentAssignments = {};
    }



    function applyFormation() {
        state.currentAssignments = {};
        if (!state.selectedBaseFormation || !state.selectedStrength) return;

        state.currentAssignments['H'] = 'block';
        state.currentAssignments['C'] = 'block';
        state.currentAssignments['Q'] = 'block';

        const formationData = state.playbook.formations[state.selectedBaseFormation][state.selectedStrength];
        Object.keys(formationData.positions).forEach(player => {
            if (!state.currentAssignments[player]) {
                state.currentAssignments[player] = null;
            }
        });
    }

    function applySideConcepts() {
        applyFormation();
        if (state.selectedLeftConcept) applyConceptToSide(state.selectedLeftConcept, 'left');
        if (state.selectedRightConcept) applyConceptToSide(state.selectedRightConcept, 'right');
    }

    function applyConceptToSide(conceptName, side) {
        const formationData = state.playbook.formations[state.selectedBaseFormation][state.selectedStrength];
        const sideInfo = formationData.sides[side];
        const countMap = { 1: 'oneMan', 2: 'twoMan', 3: 'threeMan' };
        let concept;
        
        for (const type in countMap) {
            const conceptTypeKey = countMap[type];
            if(state.playbook.concepts[conceptTypeKey][conceptName]) {
                concept = state.playbook.concepts[conceptTypeKey][conceptName];
                break;
            }
        }
        
        if (!concept) return;

        if (concept.usesCenter && sideInfo.count === 2) {
            state.currentAssignments[sideInfo.players.outer] = concept.assignments.outer;
            state.currentAssignments[sideInfo.players.inner] = concept.assignments.middle;
            state.currentAssignments['C'] = concept.assignments.inner;
        } else {
            for (const position in concept.assignments) {
                const player = sideInfo.players[position];
                if (player) {
                    state.currentAssignments[player] = concept.assignments[position];
                }
            }
        }
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
        const compressedPositions = JSON.parse(JSON.stringify(positions));
        const centerPos = compressedPositions['C'];
        if (!centerPos) return compressedPositions;

        const linePlayers = Object.keys(positions).filter(p => p !== 'Q' && p !== 'H' && positions[p].y < 400);
        
        const leftSide = linePlayers.filter(p => positions[p].x < centerPos.x).sort((a, b) => positions[b].x - positions[a].x);
        const rightSide = linePlayers.filter(p => positions[p].x > centerPos.x).sort((a, b) => positions[a].x - positions[b].x);

        leftSide.forEach((player, i) => {
            compressedPositions[player].x = centerPos.x - (spacing * (i + 1));
        });
        rightSide.forEach((player, i) => {
            compressedPositions[player].x = centerPos.x + (spacing * (i + 1));
        });

        return compressedPositions;
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
            // Arrowhead definition would go in SVG <defs> for better performance
            const defs = playCanvas.querySelector('defs') || document.createElementNS(svgNamespace, 'defs');
            if (!defs.querySelector('#arrow')) {
                const marker = document.createElementNS(svgNamespace, 'marker');
                marker.setAttribute('id', 'arrow');
                marker.setAttribute('viewBox', '0 0 10 10');
                marker.setAttribute('refX', '8');
                marker.setAttribute('refY', '5');
                marker.setAttribute('markerWidth', '6');
                marker.setAttribute('markerHeight', '6');
                marker.setAttribute('orient', 'auto-start-reverse');
                const arrowPath = document.createElementNS(svgNamespace, 'path');
                arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
                arrowPath.setAttribute('fill', 'yellow');
                marker.appendChild(arrowPath);
                defs.appendChild(marker);
                playCanvas.prepend(defs);
            }
            path.setAttribute('marker-end', 'url(#arrow)');
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