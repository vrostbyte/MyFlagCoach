/**
 * MyFlagCoach Playbook - Project Phoenix
 * This file defines the global 'playbook' variable.
 * It contains all formations, routes, concepts, and modifiers for the app.
 * The coordinate system is now vertical: X is horizontal, Y is vertical depth.
 * Line of Scrimmage is at Y = 0.
 */

const playbook = {
    // Master library of all possible routes, defined by their steps.
    routeLibrary: {
        // Universal Routes
        go: { name: "Go", steps: [{ type: 'stem', yards: 22 }] },
        block: { name: "Block", steps: [] },
        swingR: { name: "Swing Right", steps: [{ type: 'swing', direction: 'right' }] },
        swingL: { name: "Swing Left", steps: [{ type: 'swing', direction: 'left' }] },
        
        // --- CORRECTED & NEW ROUTES ---
        
        // Dallas Routes
        dallas_slant_L: { name: "Dallas Slant", steps: [{ type: 'stem', yards: 3 }, { type: 'break', angle: 45, yards: 15 }] },
        dallas_slant_R: { name: "Dallas Slant", steps: [{ type: 'stem', yards: 3 }, { type: 'break', angle: -45, yards: 15 }] },
        dallas_now_L: { name: "Dallas Now", steps: [{ type: 'break', angle: 25, yards: 18 }] },
        dallas_now_R: { name: "Dallas Now", steps: [{ type: 'break', angle: -25, yards: 18 }] },

        // Fresno Routes
        fresno_go_L: { name: "Fresno Go", steps: [{ type: 'release', angle: -20, yards: 3 }, { type: 'stem', yards: 18 }] },
        fresno_sit_L: { name: "Fresno Sit", steps: [{ type: 'break', angle: 45, yards: 8 }, { type: 'break', angle: -90, yards: 3 }] }, // Corrected 90-degree cut
        fresno_drag_L: { name: "Fresno Drag", steps: [{ type: 'stem', yards: 2 }, { type: 'drag', direction: 'left', yards: 15 }] }, // Shortened
        fresno_go_R: { name: "Fresno Go", steps: [{ type: 'release', angle: 20, yards: 3 }, { type: 'stem', yards: 18 }] },
        fresno_sit_R: { name: "Fresno Sit", steps: [{ type: 'break', angle: -45, yards: 8 }, { type: 'break', angle: 90, yards: 3 }] }, // Corrected 90-degree cut
        fresno_drag_R: { name: "Fresno Drag", steps: [{ type: 'stem', yards: 2 }, { type: 'drag', direction: 'right', yards: 15 }] }, // Shortened

        // Yale (Screen Left) Routes
        yale_bubble: { name: "Yale Bubble", steps: [{ type: 'break', angle: -135, yards: 4 }] },
        yale_blocker: { name: "Yale Blocker", steps: [{ type: 'release', angle: -45, yards: 4 }, { type: 'break', angle: -135, yards: 8 }] },
        yale_clearout: { name: "Yale Clearout", steps: [{ type: 'break', angle: 20, yards: 20 }] },
        
        // Harvard (Screen Right) Routes
        harvard_bubble: { name: "Harvard Bubble", steps: [{ type: 'break', angle: 135, yards: 4 }] },
        harvard_blocker: { name: "Harvard Blocker", steps: [{ type: 'release', angle: 45, yards: 4 }, { type: 'break', angle: 135, yards: 8 }] },
        harvard_clearout: { name: "Harvard Clearout", steps: [{ type: 'break', angle: -20, yards: 20 }] },

        // Stupid Routes
        stupid_out_5yd_L: { name: "5yd Out", steps: [{ type: 'stem', yards: 5 }, { type: 'break', angle: -90, yards: 8 }] }, // Shortened
        stupid_corner_6yd_L: { name: "6yd Corner", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: -45, yards: 12 }] },
        stupid_out_5yd_R: { name: "5yd Out", steps: [{ type: 'stem', yards: 5 }, { type: 'break', angle: 90, yards: 8 }] }, // Shortened
        stupid_corner_6yd_R: { name: "6yd Corner", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: 45, yards: 12 }] },

        // --- EXISTING ROUTES ---
        hitch_6yd_L: { name: "6yd Hitch", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: 135, yards: 2 }] },
        hitch_6yd_R: { name: "6yd Hitch", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: -135, yards: 2 }] },
        
        scissors_post_L: { name: "Scissors Post", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: 45, yards: 8 }] },
        scissors_corner_L: { name: "Scissors Corner", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: -45, yards: 8 }] },
        scissors_post_R: { name: "Scissors Post", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: -45, yards: 8 }] },
        scissors_corner_R: { name: "Scissors Corner", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: 45, yards: 8 }] },
    },
    formations: {
        "Trips": {
            "Lt": { "positions": { "X": { x: -250, y: 0 }, "F": { x: -170, y: 0 }, "Y": { x: -90, y: 0 }, "C": { x: 0, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: 70, y: 40 } }, "sides": { "left": { "count": 3, "players": ["X", "F", "Y"] }, "right": { "count": 1, "players": ["Z"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "C": { x: 0, y: 0 }, "Y": { x: 90, y: 0 }, "F": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: -70, y: 40 } }, "sides": { "left": { "count": 1, "players": ["X"] }, "right": { "count": 3, "players": ["Z", "F", "Y"] } } }
        },
        "Divide": {
            "Lt": { "positions": { "X": { x: -250, y: 0 }, "Y": { x: -170, y: 0 }, "C": { x: 0, y: 0 }, "F": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: 70, y: 40 } }, "sides": { "left": { "count": 2, "players": ["X", "Y"] }, "right": { "count": 2, "players": ["Z", "F"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "F": { x: -170, y: 0 }, "C": { x: 0, y: 0 }, "Y": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: -70, y: 40 } }, "sides": { "left": { "count": 2, "players": ["X", "F"] }, "right": { "count": 2, "players": ["Z", "Y"] } } }
        },
        "Bunch": {
            "Lt": { "positions": { "X": { x: -230, y: 0 }, "Y": { x: -160, y: 0 }, "F": { x: -195, y: -20 }, "C": { x: 0, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: 70, y: 40 } }, "sides": { "left": { "count": 3, "players": ["X", "Y", "F"] }, "right": { "count": 1, "players": ["Z"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "C": { x: 0, y: 0 }, "Y": { x: 160, y: 0 }, "F": { x: 195, y: -20 }, "Z": { x: 230, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: -70, y: 40 } }, "sides": { "left": { "count": 1, "players": ["X"] }, "right": { "count": 3, "players": ["Z", "Y", "F"] } } }
        },
        "Empty": {
            "Lt": { "positions": { "X": { x: -250, y: 0 }, "F": { x: -170, y: 0 }, "Y": { x: -90, y: 0 }, "C": { x: 0, y: 0 }, "H": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 } }, "sides": { "left": { "count": 3, "players": ["X", "F", "Y"] }, "right": { "count": 2, "players": ["Z", "H"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "H": { x: -170, y: 0 }, "C": { x: 0, y: 0 }, "Y": { x: 90, y: 0 }, "F": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 } }, "sides": { "left": { "count": 2, "players": ["X", "H"] }, "right": { "count": 3, "players": ["Z", "F", "Y"] } } }
        }
    },
    concepts: {
        "1Man": {
            "Go": { assignments: { "0": "go" } },
            "Houston": { assignments: { "0": "hitch_6yd" } },
        },
        "2Man": {
            "Houston": { assignments: { "0": "hitch_6yd", "1": "hitch_6yd" } },
            "Dallas": { assignments: { "0": "dallas_slant", "1": "dallas_now" } }, // Corrected
            "Scissors": { assignments: { "0": "scissors_post", "1": "scissors_corner" } }
        },
        "3Man": {
            "Houston": { assignments: { "0": "hitch_6yd", "1": "hitch_6yd", "2": "hitch_6yd" } },
            "Fresno": { usesCenter: true, assignments: { "0": "fresno_go", "1": "fresno_sit", "2": "fresno_drag" } },
            "Spacing": { formation: "Bunch", assignments: { "0": "hitch_6yd", "1": "flat", "2": "slant" } }
        },
        "fullField": {
            "Yale": { name: "Yale Screen", formation: "Empty Lt", assignments: { "X": "yale_bubble", "F": "yale_blocker", "Y": "yale_blocker", "Z": "yale_clearout", "H": "yale_clearout", "C": "block", "Q": "block" } },
            "Harvard": { name: "Harvard Screen", formation: "Empty Rt", assignments: { "Z": "harvard_bubble", "F": "harvard_blocker", "Y": "harvard_blocker", "X": "harvard_clearout", "H": "harvard_clearout", "C": "block", "Q": "block" } },
            "Stupid Lt": { name: "Stupid", formation: "Divide Lt", assignments: { "X": "stupid_out_5yd_L", "Y": "stupid_corner_6yd_L", "Z": "stupid_out_5yd_R", "F": "stupid_corner_6yd_R", "C": "block", "H": "block", "Q": "block" } },
            "Stupid Rt": { name: "Stupid", formation: "Divide Rt", assignments: { "X": "stupid_out_5yd_L", "F": "stupid_corner_6yd_L", "Z": "stupid_out_5yd_R", "Y": "stupid_corner_6yd_R", "C": "block", "H": "block", "Q": "block" } }
        }
    },
    modifiers: {
        "Max": { type: "positional", player: "F", assignment: "block", position: "mirrorH" },
        "Tight": { type: "formationCompression", spacing: 60 }
    }
};

