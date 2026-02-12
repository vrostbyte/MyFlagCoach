/**
 * MyFlagCoach Playbook - Project Phoenix
 * This file defines the global 'playbook' variable.
 * It contains all formations, routes, concepts, and modifiers for the app.
 * The coordinate system is vertical: X is horizontal, Y is vertical depth.
 * Line of Scrimmage is at Y = 0. Negative Y is downfield (toward the defense).
 * Positive Y is behind the line (toward the offense's own end zone).
 */

const playbook = {
    // Master library of all possible routes, defined by their steps.
    routeLibrary: {
        // Universal Routes
        go: { name: "Go", steps: [{ type: 'stem', yards: 22 }] },
        block: { name: "Block", steps: [] },
        swingR: { name: "Swing Right", steps: [{ type: 'swing', direction: 'right' }] },
        swingL: { name: "Swing Left", steps: [{ type: 'swing', direction: 'left' }] },

        // Basic Routes (used by 1-Man concepts and Spacing)
        slant_L: { name: "Slant", steps: [{ type: 'stem', yards: 3 }, { type: 'break', angle: 45, yards: 12 }] },
        slant_R: { name: "Slant", steps: [{ type: 'stem', yards: 3 }, { type: 'break', angle: -45, yards: 12 }] },
        in_L: { name: "In/Dig", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: 90, yards: 10 }] },
        in_R: { name: "In/Dig", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: -90, yards: 10 }] },
        out_L: { name: "Out", steps: [{ type: 'stem', yards: 8 }, { type: 'break', angle: -90, yards: 8 }] },
        out_R: { name: "Out", steps: [{ type: 'stem', yards: 8 }, { type: 'break', angle: 90, yards: 8 }] },
        flat_L: { name: "Flat", steps: [{ type: 'break', angle: -60, yards: 6 }] },
        flat_R: { name: "Flat", steps: [{ type: 'break', angle: 60, yards: 6 }] },
        comeback_L: { name: "Comeback", steps: [{ type: 'stem', yards: 12 }, { type: 'break', angle: -160, yards: 3 }] },
        comeback_R: { name: "Comeback", steps: [{ type: 'stem', yards: 12 }, { type: 'break', angle: 160, yards: 3 }] },
        post_L: { name: "Post", steps: [{ type: 'stem', yards: 8 }, { type: 'break', angle: 45, yards: 12 }] },
        post_R: { name: "Post", steps: [{ type: 'stem', yards: 8 }, { type: 'break', angle: -45, yards: 12 }] },
        corner_L: { name: "Corner", steps: [{ type: 'stem', yards: 8 }, { type: 'break', angle: -45, yards: 12 }] },
        corner_R: { name: "Corner", steps: [{ type: 'stem', yards: 8 }, { type: 'break', angle: 45, yards: 12 }] },
        drag_L: { name: "Drag", steps: [{ type: 'stem', yards: 2 }, { type: 'drag', direction: 'left', yards: 18 }] },
        drag_R: { name: "Drag", steps: [{ type: 'stem', yards: 2 }, { type: 'drag', direction: 'right', yards: 18 }] },
        curl_L: { name: "Curl", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: 160, yards: 2 }] },
        curl_R: { name: "Curl", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: -160, yards: 2 }] },
        wheel_L: { name: "Wheel", steps: [{ type: 'break', angle: -60, yards: 4 }, { type: 'break', angle: 0, yards: 18 }] },
        wheel_R: { name: "Wheel", steps: [{ type: 'break', angle: 60, yards: 4 }, { type: 'break', angle: 0, yards: 18 }] },

        // Hitch Routes (Houston concept)
        hitch_6yd_L: { name: "6yd Hitch", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: 135, yards: 2 }] },
        hitch_6yd_R: { name: "6yd Hitch", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: -135, yards: 2 }] },

        // Dallas Routes
        dallas_slant_L: { name: "Dallas Slant", steps: [{ type: 'stem', yards: 3 }, { type: 'break', angle: 45, yards: 15 }] },
        dallas_slant_R: { name: "Dallas Slant", steps: [{ type: 'stem', yards: 3 }, { type: 'break', angle: -45, yards: 15 }] },
        dallas_now_L: { name: "Dallas Now", steps: [{ type: 'break', angle: 25, yards: 18 }] },
        dallas_now_R: { name: "Dallas Now", steps: [{ type: 'break', angle: -25, yards: 18 }] },

        // Scissors Routes
        scissors_post_L: { name: "Scissors Post", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: 45, yards: 8 }] },
        scissors_corner_L: { name: "Scissors Corner", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: -45, yards: 8 }] },
        scissors_post_R: { name: "Scissors Post", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: -45, yards: 8 }] },
        scissors_corner_R: { name: "Scissors Corner", steps: [{ type: 'stem', yards: 10 }, { type: 'break', angle: 45, yards: 8 }] },

        // Fresno Routes
        fresno_go_L: { name: "Fresno Go", steps: [{ type: 'release', angle: -20, yards: 3 }, { type: 'stem', yards: 18 }] },
        fresno_sit_L: { name: "Fresno Sit", steps: [{ type: 'break', angle: 55, yards: 17 }, { type: 'break', angle: 135, yards: 3 }] },
        fresno_drag_L: { name: "Fresno Drag", steps: [{ type: 'stem', yards: 2 }, { type: 'drag', direction: 'left', yards: 15 }] },
        fresno_go_R: { name: "Fresno Go", steps: [{ type: 'release', angle: 20, yards: 3 }, { type: 'stem', yards: 18 }] },
        fresno_sit_R: { name: "Fresno Sit", steps: [{ type: 'break', angle: -55, yards: 17 }, { type: 'break', angle: -135, yards: 3 }] },
        fresno_drag_R: { name: "Fresno Drag", steps: [{ type: 'stem', yards: 2 }, { type: 'drag', direction: 'right', yards: 15 }] },

        // Yale (Screen Left) Routes
        yale_bubble: { name: "Yale Bubble", steps: [{ type: 'break', angle: -135, yards: 4 }] },
        yale_blocker: { name: "Yale Blocker", steps: [{ type: 'release', angle: -45, yards: 4 }, { type: 'break', angle: -135, yards: 8 }] },
        yale_clearout: { name: "Yale Clearout", steps: [{ type: 'break', angle: 20, yards: 20 }] },

        // Harvard (Screen Right) Routes
        harvard_bubble: { name: "Harvard Bubble", steps: [{ type: 'break', angle: 135, yards: 4 }] },
        harvard_blocker: { name: "Harvard Blocker", steps: [{ type: 'release', angle: 45, yards: 4 }, { type: 'break', angle: 135, yards: 8 }] },
        harvard_clearout: { name: "Harvard Clearout", steps: [{ type: 'break', angle: -20, yards: 20 }] },

        // Stupid Routes
        stupid_out_5yd_L: { name: "5yd Out", steps: [{ type: 'stem', yards: 5 }, { type: 'break', angle: -90, yards: 8 }] },
        stupid_corner_6yd_L: { name: "6yd Corner", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: -45, yards: 12 }] },
        stupid_out_5yd_R: { name: "5yd Out", steps: [{ type: 'stem', yards: 5 }, { type: 'break', angle: 90, yards: 8 }] },
        stupid_corner_6yd_R: { name: "6yd Corner", steps: [{ type: 'stem', yards: 6 }, { type: 'break', angle: 45, yards: 12 }] },
    },
    formations: {
        "Trips": {
            "Lt": { "positions": { "X": { x: -250, y: 0 }, "F": { x: -170, y: 0 }, "Y": { x: -90, y: 0 }, "C": { x: 0, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: -70, y: 40 } }, "sides": { "left": { "count": 3, "players": ["X", "F", "Y"] }, "right": { "count": 1, "players": ["Z"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "C": { x: 0, y: 0 }, "Y": { x: 90, y: 0 }, "F": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: 70, y: 40 } }, "sides": { "left": { "count": 1, "players": ["X"] }, "right": { "count": 3, "players": ["Z", "F", "Y"] } } }
        },
        "Divide": {
            "Lt": { "positions": { "X": { x: -250, y: 0 }, "Y": { x: -170, y: 0 }, "C": { x: 0, y: 0 }, "F": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: -70, y: 40 } }, "sides": { "left": { "count": 2, "players": ["X", "Y"] }, "right": { "count": 2, "players": ["Z", "F"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "F": { x: -170, y: 0 }, "C": { x: 0, y: 0 }, "Y": { x: 170, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: 70, y: 40 } }, "sides": { "left": { "count": 2, "players": ["X", "F"] }, "right": { "count": 2, "players": ["Z", "Y"] } } }
        },
        "Bunch": {
            "Lt": { "positions": { "X": { x: -230, y: 0 }, "Y": { x: -160, y: 0 }, "F": { x: -195, y: -20 }, "C": { x: 0, y: 0 }, "Z": { x: 250, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: -70, y: 40 } }, "sides": { "left": { "count": 3, "players": ["X", "Y", "F"] }, "right": { "count": 1, "players": ["Z"] } } },
            "Rt": { "positions": { "X": { x: -250, y: 0 }, "C": { x: 0, y: 0 }, "Y": { x: 160, y: 0 }, "F": { x: 195, y: -20 }, "Z": { x: 230, y: 0 }, "Q": { x: 0, y: 40 }, "H": { x: 70, y: 40 } }, "sides": { "left": { "count": 1, "players": ["X"] }, "right": { "count": 3, "players": ["Z", "Y", "F"] } } }
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
            "Slant": { assignments: { "0": "slant" } },
            "In": { assignments: { "0": "in" } },
            "Out": { assignments: { "0": "out" } },
            "Comeback": { assignments: { "0": "comeback" } },
        },
        "2Man": {
            "Houston": { assignments: { "0": "hitch_6yd", "1": "hitch_6yd" } },
            "Dallas": { assignments: { "0": "dallas_slant", "1": "dallas_now" } },
            "Scissors": { assignments: { "0": "scissors_post", "1": "scissors_corner" } },
        },
        "3Man": {
            "Houston": { assignments: { "0": "hitch_6yd", "1": "hitch_6yd", "2": "hitch_6yd" } },
            "Fresno": { usesCenter: true, assignments: { "0": "fresno_go", "1": "fresno_sit", "2": "fresno_drag" } },
            "Spacing": { formation: "Bunch", assignments: { "0": "hitch_6yd", "1": "flat", "2": "slant" } },
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
    },
    situations: {
        "1st & 20": {
            description: "Opening play — take a shot or establish the run game",
            icon: "1",
            color: "#3b82f6",
            recommendedPlays: [
                { label: "Trips Lt Houston / Go", formation: "Trips", strength: "Lt", left: "Houston", right: "Go" },
                { label: "Divide Lt Dallas / Scissors", formation: "Divide", strength: "Lt", left: "Dallas", right: "Scissors" },
                { label: "Trips Rt Fresno", formation: "Trips", strength: "Rt", left: null, right: "Fresno" },
                { label: "Bunch Lt Spacing / Go", formation: "Bunch", strength: "Lt", left: "Spacing", right: "Go" },
            ]
        },
        "2nd & Long": {
            description: "10+ yards to go — need chunk yardage",
            icon: "2L",
            color: "#8b5cf6",
            recommendedPlays: [
                { label: "Trips Lt Fresno", formation: "Trips", strength: "Lt", left: "Fresno", right: null },
                { label: "Divide Lt Dallas / Dallas", formation: "Divide", strength: "Lt", left: "Dallas", right: "Dallas" },
                { label: "Trips Rt Houston / Slant", formation: "Trips", strength: "Rt", left: "Slant", right: "Houston" },
                { label: "Empty Lt Yale Screen", formation: "Empty", strength: "Lt", fullField: "Yale" },
            ]
        },
        "2nd & Short": {
            description: "Under 5 yards — safe high-percentage plays",
            icon: "2S",
            color: "#10b981",
            recommendedPlays: [
                { label: "Trips Lt Houston / Houston", formation: "Trips", strength: "Lt", left: "Houston", right: "Houston" },
                { label: "Divide Rt Houston / Houston", formation: "Divide", strength: "Rt", left: "Houston", right: "Houston" },
                { label: "Bunch Rt Spacing / Slant", formation: "Bunch", strength: "Rt", left: "Slant", right: "Spacing" },
                { label: "Trips Lt Fresno", formation: "Trips", strength: "Lt", left: "Fresno", right: null },
            ]
        },
        "3rd & Long": {
            description: "Must-convert — need 10+ yards",
            icon: "3L",
            color: "#ef4444",
            recommendedPlays: [
                { label: "Trips Lt Fresno", formation: "Trips", strength: "Lt", left: "Fresno", right: null },
                { label: "Divide Lt Scissors / Dallas", formation: "Divide", strength: "Lt", left: "Scissors", right: "Dallas" },
                { label: "Empty Rt Harvard Screen", formation: "Empty", strength: "Rt", fullField: "Harvard" },
                { label: "Trips Rt Houston / In", formation: "Trips", strength: "Rt", left: "In", right: "Houston" },
            ]
        },
        "3rd & Short": {
            description: "Manageable conversion — under 5 yards",
            icon: "3S",
            color: "#f59e0b",
            recommendedPlays: [
                { label: "Trips Lt Houston / Slant", formation: "Trips", strength: "Lt", left: "Houston", right: "Slant" },
                { label: "Divide Lt Houston / Houston", formation: "Divide", strength: "Lt", left: "Houston", right: "Houston" },
                { label: "Bunch Lt Spacing / Houston", formation: "Bunch", strength: "Lt", left: "Spacing", right: "Houston" },
                { label: "Divide Rt Stupid", formation: "Divide", strength: "Rt", fullField: "Stupid Rt" },
            ]
        },
        "4th Down": {
            description: "Do or die — go for it or get creative",
            icon: "4",
            color: "#dc2626",
            recommendedPlays: [
                { label: "Empty Lt Yale Screen", formation: "Empty", strength: "Lt", fullField: "Yale" },
                { label: "Divide Lt Stupid", formation: "Divide", strength: "Lt", fullField: "Stupid Lt" },
                { label: "Trips Lt Fresno", formation: "Trips", strength: "Lt", left: "Fresno", right: null },
                { label: "Bunch Rt Spacing / Go", formation: "Bunch", strength: "Rt", left: "Go", right: "Spacing" },
            ]
        },
        "Red Zone": {
            description: "Inside the 10 — compressed field, score now",
            icon: "RZ",
            color: "#e11d48",
            recommendedPlays: [
                { label: "Bunch Lt Spacing / Slant", formation: "Bunch", strength: "Lt", left: "Spacing", right: "Slant" },
                { label: "Trips Rt Houston / Out", formation: "Trips", strength: "Rt", left: "Out", right: "Houston" },
                { label: "Divide Lt Dallas / Scissors", formation: "Divide", strength: "Lt", left: "Dallas", right: "Scissors" },
                { label: "Empty Rt Harvard Screen", formation: "Empty", strength: "Rt", fullField: "Harvard" },
            ]
        },
        "2-Minute Drill": {
            description: "Clock is running — quick plays, get out of bounds",
            icon: "2M",
            color: "#f97316",
            recommendedPlays: [
                { label: "Trips Lt Houston / Out", formation: "Trips", strength: "Lt", left: "Houston", right: "Out" },
                { label: "Divide Lt Out / Out", formation: "Divide", strength: "Lt", left: "Out", right: "Out" },
                { label: "Empty Lt Yale Screen", formation: "Empty", strength: "Lt", fullField: "Yale" },
                { label: "Trips Rt Fresno", formation: "Trips", strength: "Rt", left: null, right: "Fresno" },
            ]
        }
    }
};
