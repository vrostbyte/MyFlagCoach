/**
 * MyFlagCoach Playbook - Project Phoenix
 * This file is now a simple script that defines a global 'playbook' variable.
 * The 'export' keyword has been removed to simplify loading in the browser.
 */

const playbook = {
    // Master library of all possible routes. Routes are defined by steps.
    routeLibrary: {
        // Universal Routes
        go: { name: "Go", steps: [{ type: 'stem', yards: 22 }] },
        now_seam: { name: "Now Seam", steps: [{ type: 'stem', yards: 18 }] },
        block: { name: "Block", steps: [] },
        swingR: { name: "Swing Right", steps: [{ type: 'swing', direction: 'right' }] },
        swingL: { name: "Swing Left", steps: [{ type: 'swing', direction: 'left' }] },
        
        // Mirrored Routes (Side-Specific)
        hitch_6yd_L: { name: "6yd Hitch", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: 135, yards: 1 }] },
        hitch_6yd_R: { name: "6yd Hitch", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: -135, yards: 1 }] },
        
        dallas_slant_L: { name: "Dallas Slant", steps: [{ type: 'stem', yards: 3 }, { type: 'break', angle: 45, yards: 15 }] },
        dallas_slant_R: { name: "Dallas Slant", steps: [{ type: 'stem', yards: 3 }, { type: 'break', angle: -45, yards: 15 }] },

        scissors_post_L: { name: "Scissors Post", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: 45, yards: 8 }] },
        scissors_corner_L: { name: "Scissors Corner", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: -45, yards: 8 }] },
        scissors_post_R: { name: "Scissors Post", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: -45, yards: 8 }] },
        scissors_corner_R: { name: "Scissors Corner", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: 45, yards: 8 }] },

        fresno_go_L: { name: "Fresno Go", steps: [{ type: 'release', angle: -20, yards: 3 }, { type: 'stem', yards: 18 }] },
        fresno_sit_L: { name: "Fresno Sit", steps: [{ type: 'break', angle: 45, yards: 8 }, { type: 'break', angle: 180, yards: 3 }] },
        fresno_drag_L: { name: "Fresno Drag", steps: [{ type: 'stem', yards: 2 }, { type: 'drag', direction: 'left', yards: 25 }] },
        fresno_go_R: { name: "Fresno Go", steps: [{ type: 'release', angle: 20, yards: 3 }, { type: 'stem', yards: 18 }] },
        fresno_sit_R: { name: "Fresno Sit", steps: [{ type: 'break', angle: -45, yards: 8 }, { type: 'break', angle: 0, yards: 3 }] },
        fresno_drag_R: { name: "Fresno Drag", steps: [{ type: 'stem', yards: 2 }, { type: 'drag', direction: 'right', yards: 25 }] },
        
        screen_rcv: { name: "Screen Receiver", steps: [{ type: 'stem', yards: -1 }, { type: 'break', angle: -135, yards: 4 }] },
        screen_block: { name: "Screen Blocker", steps: [{ type: 'stem', yards: 2 }, { type: 'break', angle: -110, yards: 6 }] },

        stupid_out_5yd: { name: "5yd Out", steps: [{ type: 'stem', yards: 5 }, { type: 'break', angle: -90, yards: 10 }] },
        stupid_corner_6yd: { name: "6yd Corner", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: -45, yards: 12 }] },
    },
    formations: {
        "Trips": {
            "Lt": { "positions": { "X": { x: -250, y: 0 }, "F": { x: -170, y: 0 }, "Y": { x: -90, y: 0 }, "C": { x: 0, y: -10 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: -50 }, "H": { x: 70, y: -50 } }, "sides": { "left": { "count": 3, "players": ["X", "F", "Y"] }, "right": { "count": 1, "players": ["Z"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "C": { x: 0, y: -10 }, "Y": { x: 90, y: 0 }, "F": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: -50 }, "H": { x: -70, y: -50 } }, "sides": { "left": { "count": 1, "players": ["X"] }, "right": { "count": 3, "players": ["Z", "F", "Y"] } } }
        },
        "Divide": {
            "Lt": { "positions": { "X": { x: -250, y: 0 }, "Y": { x: -170, y: 0 }, "C": { x: 0, y: -10 }, "F": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: -50 }, "H": { x: 70, y: -50 } }, "sides": { "left": { "count": 2, "players": ["X", "Y"] }, "right": { "count": 2, "players": ["Z", "F"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "F": { x: -170, y: 0 }, "C": { x: 0, y: -10 }, "Y": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: -50 }, "H": { x: -70, y: -50 } }, "sides": { "left": { "count": 2, "players": ["X", "F"] }, "right": { "count": 2, "players": ["Z", "Y"] } } }
        },
        "Bunch": {
            "Lt": { "positions": { "X": { x: -230, y: 0 }, "Y": { x: -160, y: 0 }, "F": { x: -195, y: 20 }, "C": { x: 0, y: -10 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: -50 }, "H": { x: 70, y: -50 } }, "sides": { "left": { "count": 3, "players": ["X", "Y", "F"] }, "right": { "count": 1, "players": ["Z"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "C": { x: 0, y: -10 }, "Y": { x: 160, y: 0 }, "F": { x: 195, y: 20 }, "Z": { x: 230, y: 0 }, "Q": { x: 0, y: -50 }, "H": { x: -70, y: -50 } }, "sides": { "left": { "count": 1, "players": ["X"] }, "right": { "count": 3, "players": ["Z", "Y", "F"] } } }
        },
        "Empty": {
            "Lt": { "positions": { "X": { x: -250, y: 0 }, "F": { x: -170, y: 0 }, "Y": { x: -90, y: 0 }, "C": { x: 0, y: -10 }, "H": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: -50 } }, "sides": { "left": { "count": 3, "players": ["X", "F", "Y"] }, "right": { "count": 2, "players": ["Z", "H"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "H": { x: -170, y: 0 }, "C": { x: 0, y: -10 }, "Y": { x: 90, y: 0 }, "F": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: -50 } }, "sides": { "left": { "count": 2, "players": ["X", "H"] }, "right": { "count": 3, "players": ["Z", "F", "Y"] } } }
        }
    },
    concepts: {
        "1Man": {
            "Go": { assignments: { "0": "go" } },
            "Houston": { assignments: { "0": "hitch_6yd" } },
        },
        "2Man": {
            "Houston": { assignments: { "0": "hitch_6yd", "1": "hitch_6yd" } },
            "Dallas": { assignments: { "0": "dallas_slant", "1": "now_seam" } },
            "Scissors": { assignments: { "0": "scissors_post", "1": "scissors_corner" } }
        },
        "3Man": {
            "Houston": { assignments: { "0": "hitch_6yd", "1": "hitch_6yd", "2": "hitch_6yd" } },
            "Fresno": { usesCenter: true, assignments: { "0": "fresno_go", "1": "fresno_sit", "2": "fresno_drag" } },
            "Spacing": { formation: "Bunch", assignments: { "0": "hitch_6yd", "1": "flat", "2": "slant" } }
        },
        "fullField": {
            "Yale": { name: "Yale Screen", formation: "Empty Lt", assignments: { "X": "screen_rcv", "F": "screen_block", "Y": "screen_block", "Z": "go", "H": "go" } },
            "Harvard": { name: "Harvard Screen", formation: "Empty Rt", assignments: { "Z": "screen_rcv", "F": "screen_block", "Y": "screen_block", "X": "go", "H": "go" } },
            "Stupid Lt": { name: "Stupid", formation: "Divide Lt", assignments: { "X": "stupid_out_5yd", "Y": "stupid_corner_6yd", "Z": "stupid_out_5yd", "F": "stupid_corner_6yd" } },
            "Stupid Rt": { name: "Stupid", formation: "Divide Rt", assignments: { "X": "stupid_out_5yd", "F": "stupid_corner_6yd", "Z": "stupid_out_5yd", "Y": "stupid_corner_6yd" } }
        }
    },
    modifiers: {
        "Max": { type: "positional", player: "F", assignment: "block", position: "mirrorH" },
        "Tight": { type: "formationCompression", spacing: 60 }
    }
};

