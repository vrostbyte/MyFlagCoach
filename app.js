// app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let selectedFormation = null;
    let selectedPlay = null;
    let selectedModifier = null;
    let activeZoneFilter = null;

    // --- DOM ELEMENT REFERENCES ---
    const formationButtonsContainer = document.getElementById('formation-buttons');
    const playButtonsContainer = document.getElementById('play-buttons');
    const modifierButtonsContainer = document.getElementById('modifier-buttons');
    const defensiveZonesContainer = document.getElementById('defensive-zones');
    const playDrawingContainer = document.getElementById('play-drawing');
    const signalDisplayContainer = document.getElementById('signal-display');
    const currentPlayDisplay = document.getElementById('current-play-display');

    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    // --- INITIALIZATION ---
    function initializeApp() {
        createButtons(Object.keys(PLAYBOOK.formations), formationButtonsContainer, handleFormationSelect);
        createButtons(Object.keys(PLAYBOOK.plays), playButtonsContainer, handlePlaySelect);
        createButtons(Object.keys(PLAYBOOK.modifiers), modifierButtonsContainer, handleModifierSelect);
        drawDefensiveZones();
        initializeCanvas();
        updateDisplay();
    }

    // --- EVENT HANDLERS ---
    function handleFormationSelect(formationName) {
        selectedFormation = formationName;
        drawPlay();
    }

    function handlePlaySelect(playName) {
        selectedPlay = playName;
        drawPlay();
    }

    function handleModifierSelect(modifierName, btn) {
        if (selectedModifier === modifierName) {
            selectedModifier = null;
            btn.classList.remove('active');
        } else {
            // Deactivate other modifier buttons if any
            modifierButtonsContainer.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedModifier = modifierName;
        }
        drawPlay();
    }

    // --- DRAWING & DISPLAY LOGIC ---
    function initializeCanvas() {
        playDrawingContainer.innerHTML = ''; // Clear only the play drawing, not zones
        const line = document.createElementNS(SVG_NAMESPACE, 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', '350');
        line.setAttribute('x2', '650');
        line.setAttribute('y2', '350');
        line.setAttribute('stroke', '#333');
        line.setAttribute('stroke-width', '2');
        playDrawingContainer.appendChild(line);
    }

    function drawPlay() {
        initializeCanvas();
        if (!selectedFormation || !selectedPlay) {
            updateDisplay();
            updateSignalDisplay();
            return;
        }

        const formationData = PLAYBOOK.formations[selectedFormation];
        const playData = PLAYBOOK.plays[selectedPlay];
        const blockers = selectedModifier ? PLAYBOOK.modifiers[selectedModifier] : [];

        for (const player in formationData) {
            if (!formationData.hasOwnProperty(player)) continue;

            const pos = formationData[player];
            const route = playData[player];
            const isBlocker = blockers.includes(player);
            
            const playerGroup = document.createElementNS(SVG_NAMESPACE, 'g');
            playerGroup.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

            const playerCircle = document.createElementNS(SVG_NAMESPACE, 'circle');
            playerCircle.setAttribute('r', '15');
            playerCircle.setAttribute('fill', isBlocker ? '#ffc107' : 'white');
            playerCircle.setAttribute('stroke', 'black');
            playerCircle.setAttribute('stroke-width', '2');
            
            const playerLabel = document.createElementNS(SVG_NAMESPACE, 'text');
            playerLabel.setAttribute('text-anchor', 'middle');
            playerLabel.setAttribute('dy', '.3em');
            playerLabel.setAttribute('font-size', '16');
            playerLabel.setAttribute('font-weight', 'bold');
            playerLabel.textContent = player;
            
            playerGroup.appendChild(playerCircle);
            playerGroup.appendChild(playerLabel);

            if (route && !isBlocker) {
                const routePath = document.createElementNS(SVG_NAMESPACE, 'path');
                routePath.setAttribute('d', route.path);
                routePath.setAttribute('stroke', route.color || 'black');
                routePath.setAttribute('stroke-width', '3');
                routePath.setAttribute('fill', 'none');
                playerGroup.appendChild(routePath);
            }
            
            if (isBlocker) {
                const blockSymbol = document.createElementNS(SVG_NAMESPACE, 'rect');
                blockSymbol.setAttribute('x', '-10');
                blockSymbol.setAttribute('y', '-25');
                blockSymbol.setAttribute('width', '20');
                blockSymbol.setAttribute('height', '5');
                blockSymbol.setAttribute('fill', 'black');
                playerGroup.appendChild(blockSymbol);
            }
            playDrawingContainer.appendChild(playerGroup);
        }
        updateDisplay();
        updateSignalDisplay();
    }
    
    function updateDisplay() {
        let text = 'SELECT FORMATION & PLAY';
        if (selectedFormation && selectedPlay) {
            text = `${selectedFormation} > ${selectedPlay}`;
            if (selectedModifier) {
                text += ` > ${selectedModifier}`;
            }
        } else if (selectedFormation) {
            text = `${selectedFormation} > ...`;
        }
        currentPlayDisplay.textContent = text;
    }

    function updateSignalDisplay() {
        signalDisplayContainer.innerHTML = 'No Signals';
        const signals = [];
        if (selectedFormation) {
            const formationBase = selectedFormation.split(' ')[0];
            const signalPath = PLAYBOOK.handSignals.formations[formationBase];
            if (signalPath) signals.push(signalPath);
        }
        if (selectedPlay) {
            const signalPath = PLAYBOOK.handSignals.plays[selectedPlay];
            if (signalPath) signals.push(signalPath);
        }
        if (signals.length > 0) {
            signalDisplayContainer.innerHTML = '';
            signals.forEach(path => {
                const img = document.createElement('img');
                img.src = path;
                img.alt = "Hand Signal";
                // Handle image loading errors gracefully
                img.onerror = () => { img.style.display = 'none'; };
                signalDisplayContainer.appendChild(img);
            });
        }
    }

    // --- DEFENSIVE ZONE & FILTERING LOGIC ---
    function drawDefensiveZones() {
        defensiveZonesContainer.innerHTML = '';
        for (const zoneId in ZONES) {
            const zone = ZONES[zoneId];
            const zoneRect = document.createElementNS(SVG_NAMESPACE, 'rect');
            zoneRect.setAttribute('class', 'zone');
            zoneRect.setAttribute('id', zoneId);
            zoneRect.setAttribute('x', zone.x);
            zoneRect.setAttribute('y', zone.y);
            zoneRect.setAttribute('width', zone.width);
            zoneRect.setAttribute('height', zone.height);
            zoneRect.addEventListener('click', () => toggleZoneFilter(zoneId, zoneRect));
            defensiveZonesContainer.appendChild(zoneRect);
        }
    }

    function toggleZoneFilter(zoneId, zoneRect) {
        if (activeZoneFilter === zoneId) {
            activeZoneFilter = null;
            zoneRect.classList.remove('active-filter');
        } else {
            activeZoneFilter = zoneId;
            document.querySelectorAll('.zone').forEach(z => z.classList.remove('active-filter'));
            zoneRect.classList.add('active-filter');
        }
        filterPlayButtons();
    }

    function filterPlayButtons() {
        const playButtons = playButtonsContainer.querySelectorAll('.control-btn');
        if (!activeZoneFilter) {
            playButtons.forEach(btn => btn.style.display = 'block');
            return;
        }
        const validPlays = new Set(Object.keys(PLAYBOOK.plays).filter(playName => {
            const play = PLAYBOOK.plays[playName];
            return Object.values(play).some(route => route.zoneTargets?.includes(activeZoneFilter));
        }));
        playButtons.forEach(btn => {
            btn.style.display = validPlays.has(btn.dataset.value) ? 'block' : 'none';
        });
    }

    // --- UTILITY FUNCTIONS ---
    function createButtons(items, container, onClickCallback) {
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.textContent = item;
            btn.dataset.value = item;
            btn.addEventListener('click', () => {
                // For formations and plays, only one can be active.
                if (container !== modifierButtonsContainer) {
                    container.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
                onClickCallback(item, btn);
            });
            container.appendChild(btn);
        });
    }

    // --- START THE APP ---
    initializeApp();
});
