// app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- APPLICATION STATE ---
    let playbook = null;
    let selectedDefense = null;
    let selectedFormation = null;
    let selectedPlay = null;

    // --- DOM ELEMENT REFERENCES ---
    const defenseSelector = document.getElementById('defense-selector');
    const formationSelector = document.getElementById('formation-selector');
    const playSelector = document.getElementById('play-selector');
    const playDrawingContainer = document.getElementById('play-drawing');
    const signalDisplayContainer = document.getElementById('signal-display');
    const currentPlayTitle = document.getElementById('current-play-title');
    const playbookUpload = document.getElementById('playbook-upload');
    const resetPlaybookBtn = document.getElementById('reset-playbook');
    const recommendedPlaysSection = document.getElementById('recommended-plays-section');
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    // --- INITIALIZATION ---
    function initializeApp() {
        loadPlaybook();
        renderControls();
        addEventListeners();
    }

    // --- PLAYBOOK MANAGEMENT ---
    function loadPlaybook() {
        const savedPlaybook = localStorage.getItem('customPlaybook');
        if (savedPlaybook) {
            playbook = JSON.parse(savedPlaybook);
        } else {
            playbook = defaultPlaybook;
        }
    }

    function savePlaybook() {
        localStorage.setItem('customPlaybook', JSON.stringify(playbook));
    }

    function handlePlaybookUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newPlaybook = JSON.parse(e.target.result);
                playbook = newPlaybook;
                savePlaybook();
                resetSelections();
                renderControls();
            } catch (error) {
                alert('Error parsing playbook file. Please ensure it is a valid JSON file.');
                console.error("Playbook parsing error:", error);
            }
        };
        reader.readAsText(file);
    }
    
    function handleResetPlaybook() {
        if (confirm('Are you sure you want to reset to the default playbook? This will erase your uploaded playbook.')) {
            localStorage.removeItem('customPlaybook');
            playbook = defaultPlaybook;
            resetSelections();
            renderControls();
        }
    }
    
    function resetSelections() {
        selectedDefense = null;
        selectedFormation = null;
        selectedPlay = null;
        updateUI();
    }

    // --- UI RENDERING ---
    function renderControls() {
        renderSelector('defense', playbook.defenses, defenseSelector, handleDefenseSelect);
        renderSelector('formation', Object.keys(playbook.formations), formationSelector, handleFormationSelect);
        updateUI(); // Initial UI update
    }

    function renderSelector(type, items, container, handler) {
        container.innerHTML = '';
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'selector-btn';
            btn.textContent = item;
            btn.dataset.type = type;
            btn.dataset.value = item;
            btn.addEventListener('click', () => handler(item, btn));
            container.appendChild(btn);
        });
    }

    function updateUI() {
        // Update active buttons
        updateActiveButton('defense', selectedDefense, defenseSelector);
        updateActiveButton('formation', selectedFormation, formationSelector);

        // Filter and render plays
        const playsToRender = getFilteredPlays();
        renderPlays(playsToRender);
        updateActiveButton('play', selectedPlay, playSelector);

        // Draw the selected play
        drawPlay();

        // Update titles and signals
        updateHeader();
        updateSignalDisplay();
    }

    function updateActiveButton(type, selectedValue, container) {
        container.querySelectorAll(`[data-type="${type}"]`).forEach(btn => {
            if (btn.dataset.value === selectedValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    function renderPlays(playNames) {
        playSelector.innerHTML = '';
        if (playNames.length === 0) {
            recommendedPlaysSection.style.display = 'none';
            return;
        }
        recommendedPlaysSection.style.display = 'block';
        playNames.forEach(playName => {
            const play = playbook.plays[playName];
            const btn = document.createElement('button');
            btn.className = 'selector-btn';
            btn.textContent = play.name;
            btn.dataset.type = 'play';
            btn.dataset.value = playName;
            btn.addEventListener('click', () => handlePlaySelect(playName, btn));
            playSelector.appendChild(btn);
        });
    }

    // --- EVENT HANDLERS ---
    function addEventListeners() {
        playbookUpload.addEventListener('change', handlePlaybookUpload);
        resetPlaybookBtn.addEventListener('click', handleResetPlaybook);
    }

  	function handleDefenseSelect(defense, btn) {
        selectedDefense = selectedDefense === defense ? null : defense;
        selectedPlay = null; // Reset play selection when defense changes
        updateUI();
    }
    
    function handleFormationSelect(formation, btn) {
        selectedFormation = selectedFormation === formation ? null : formation;
        selectedPlay = null; // Reset play selection when formation changes
        updateUI();
    }
    
    function handlePlaySelect(playName, btn) {
        selectedPlay = selectedPlay === playName ? null : playName;
        updateUI();
    }

    // --- LOGIC & DRAWING ---
    function getFilteredPlays() {
        if (!selectedDefense) {
            return Object.keys(playbook.plays); // Return all plays if no defense is selected
        }
        return Object.keys(playbook.plays).filter(playName => {
            const play = playbook.plays[playName];
            return play.strongAgainst && play.strongAgainst.includes(selectedDefense);
        });
    }
    
    function drawPlay() {
        playDrawingContainer.innerHTML = ''; // Clear canvas
        
        // Draw Line of Scrimmage
        const line = document.createElementNS(SVG_NAMESPACE, 'line');
        line.setAttribute('x1', '0'); line.setAttribute('y1', '385');
        line.setAttribute('x2', '700'); line.setAttribute('y2', '385');
        line.setAttribute('stroke', '#ffffff'); line.setAttribute('stroke-width', '3');
        playDrawingContainer.appendChild(line);

        if (!selectedFormation || !selectedPlay) return;

        const formationData = playbook.formations[selectedFormation];
        const playData = playbook.plays[selectedPlay];

        for (const player in formationData) {
            const pos = formationData[player];
            const routeKey = playData.assignments[player];
            if (!routeKey) continue;

            const routeData = playbook.routeLibrary[routeKey];
            const playerGroup = document.createElementNS(SVG_NAMESPACE, 'g');
            playerGroup.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

            // Draw player
            const playerCircle = document.createElementNS(SVG_NAMESPACE, 'circle');
            playerCircle.setAttribute('r', '18');
            playerCircle.setAttribute('class', 'player-circle');
            
            const playerLabel = document.createElementNS(SVG_NAMESPACE, 'text');
            playerLabel.setAttribute('dy', '.35em');
            playerLabel.setAttribute('class', 'player-label');
            playerLabel.textContent = player;
            
            playerGroup.appendChild(playerCircle);
            playerGroup.appendChild(playerLabel);

            // Draw route
            if (routeKey !== 'block') {
                const routePath = document.createElementNS(SVG_NAMESPACE, 'path');
                routePath.setAttribute('d', routeData.path);
                routePath.setAttribute('class', 'route-path');
                const customColor = playData.routeColors && playData.routeColors[player];
                routePath.setAttribute('stroke', customColor || '#f9d423');
                playerGroup.appendChild(routePath);
            } else {
                 playerCircle.style.fill = '#8e8e93'; // Make blockers grey
            }

            playDrawingContainer.appendChild(playerGroup);
        }
    }

    function updateHeader() {
        if (selectedFormation && selectedPlay) {
            currentPlayTitle.textContent = `${selectedFormation} - ${playbook.plays[selectedPlay].name}`;
        } else if (selectedFormation) {
            currentPlayTitle.textContent = `${selectedFormation}`;
        } else {
            currentPlayTitle.textContent = 'Select a Formation and Play';
        }
    }

    function updateSignalDisplay() {
        signalDisplayContainer.innerHTML = 'No Signals';
        if (!playbook.handSignals) return;

        const signals = [];
        if (selectedFormation) {
            const baseFormation = selectedFormation.split(' ')[0];
            const path = playbook.handSignals.formations?.[baseFormation];
            if(path) signals.push(path);
        }
        if (selectedPlay) {
            const path = playbook.handSignals.plays?.[selectedPlay];
            if(path) signals.push(path);
        }

        if (signals.length > 0) {
            signalDisplayContainer.innerHTML = '';
            signals.forEach(path => {
                const img = document.createElement('img');
                img.src = path;
                img.alt = "Hand Signal";
                img.onerror = () => img.style.display = 'none'; // Hide if image is missing
                signalDisplayContainer.appendChild(img);
            });
        }
    }

    // --- START THE APP ---
    initializeApp();
});