const defaultPlaybook = {
  // Master library of all routes. Plays will reference these keys.
  routeLibrary: {
    'go': { name: 'Go', path: 'M 0 0 V -220' },
    'post': { name: 'Post', path: 'M 0 0 L 80 -160' },
    'corner': { name: 'Corner', path: 'M 0 0 L -80 -160' },
    'out': { name: 'Out', path: 'M 0 0 V -80 H 100' },
    'in': { name: 'In', path: 'M 0 0 V -80 H -100' },
    'slant': { name: 'Slant', path: 'M 0 0 L -60 -60' },
    'flat': { name: 'Flat', path: 'M 0 0 C 20 -5, 40 -5, 60 0 H 100' },
    'shallow': { name: 'Shallow Cross', path: 'M 0 0 C 100 -20, 250 -20, 400 0' },
    'deepCross': { name: 'Deep Cross', path: 'M 0 0 C 150 -150, 300 -180, 400 -180' },
    'comeback': { name: 'Comeback', path: 'M 0 0 V -120 L -20 -100' },
    'block': { name: 'Block', path: '' }, // Empty path for blocking assignment
    'swingR': { name: 'Swing Right', path: 'M 0 0 C 50 30, 150 30, 200 10' },
    'swingL': { name: 'Swing Left', path: 'M 0 0 C -50 30, -150 30, -200 10' },
    'screen': { name: 'Screen', path: 'M 0 0 L 20 20' }
  },

  // List of all formations with player coordinates.
  formations: {
    "Trips Lt": {
      X: { x: 100, y: 380 }, F: { x: 180, y: 380 }, Y: { x: 260, y: 380 },
      C: { x: 450, y: 390 }, Z: { x: 600, y: 380 }, H: { x: 400, y: 450 }, Q: { x: 400, y: 500 },
    },
    "Divide Rt": {
      X: { x: 100, y: 380 }, F: { x: 180, y: 380 }, C: { x: 350, y: 390 },
      Y: { x: 520, y: 380 }, Z: { x: 600, y: 380 }, H: { x: 350, y: 450 }, Q: { x: 350, y: 500 },
    },
    "Bunch Rt": {
      X: { x: 100, y: 380 }, C: { x: 350, y: 390 }, Y: { x: 550, y: 380 },
      F: { x: 580, y: 400 }, Z: { x: 610, y: 380 }, H: { x: 350, y: 450 }, Q: { x: 350, y: 500 },
    },
    "Empty Lt": {
      X: { x: 50, y: 380 }, F: { x: 130, y: 380 }, Y: { x: 210, y: 380 },
      C: { x: 350, y: 390 }, H: { x: 490, y: 380 }, Z: { x: 570, y: 380 }, Q: { x: 350, y: 500 },
    }
    // TODO: Add Trips Rt, Divide Lt, Bunch Lt, Empty Rt
  },

  // List of all plays with metadata and route assignments.
  plays: {
    "Flood": {
      name: "Flood",
      description: "Overloads one side of the field with routes at different depths.",
      strongAgainst: ["Cover 3", "Zone"],
      assignments: {
        X: 'go', Y: 'flat', F: 'out', Z: 'post', H: 'swingL', C: 'block', Q: 'block'
      },
      routeColors: { X: '#ff453a', Z: '#ff453a' } // Example of custom coloring
    },
    "Shallows": {
      name: "Shallow Cross",
      description: "Two receivers cross at shallow depth, creating a natural pick.",
      strongAgainst: ["Man", "Cover 1"],
      assignments: {
        X: 'post', Y: 'shallow', F: 'in', Z: 'go', H: 'swingR', C: 'block', Q: 'block'
      }
    },
    "Crossers": {
        name: "Crossers",
        description: "Multiple receivers run deep crossing routes.",
        strongAgainst: ["Zone", "Cover 3"],
        assignments: {
            X: 'deepCross', Y: 'post', F: 'in', Z: 'go', H: 'flat', C: 'block', Q: 'block'
        }
    },
    "Screens": {
        name: "Jailbreak Screen",
        description: "Quick throw to a receiver with blockers in front.",
        strongAgainst: ["Blitz", "Man"],
        assignments: {
            X: 'block', Y: 'screen', F: 'block', Z: 'go', H: 'go', C: 'block', Q: 'block'
        }
    }
  },

  // Available defensive formations for the recommendation engine.
  defenses: [
    "Cover 1", "Cover 2", "Cover 3", "Man", "Zone", "Blitz"
  ],

  // Modifiers can override a player's assignment
  modifiers: {
    "Max": { F: 'block' } // "Max" modifier makes F a blocker
  },
  
  // Hand signals can be linked to formations or plays
  handSignals: {
    formations: {
        "Trips": "signals/trips_signal.png",
        "Divide": "signals/divide_signal.png",
    },
    plays: {
        "Flood": "signals/flood_signal.png",
        "Shallows": "signals/shallows_signal.png",
    }
  }
};
