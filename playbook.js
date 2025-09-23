const playbook = {
  "routeLibrary": {
    "go": { "name": "Go", "steps": [{ "type": "stem", "yards": 22 }] },
    "now_seam": { "name": "Now Seam", "steps": [{ "type": "stem", "yards": 18 }] },
    "block": { "name": "Block", "steps": [] },
    
    // Side-specific routes for accuracy
    "hitch_6yd_L": { "name": "Hitch (L)", "steps": [{ "type": "stem", "yards": 6 }, { "type": "break", "angle": 135, "yards": 1 }] },
    "hitch_6yd_R": { "name": "Hitch (R)", "steps": [{ "type": "stem", "yards": 6 }, { "type": "break", "angle": -135, "yards": 1 }] },
    
    "dallas_slant_L": { "name": "Dallas Slant (L)", "steps": [{ "type": "stem", "yards": 3 }, { "type": "break", "angle": 45, "yards": 18 }] },
    "dallas_slant_R": { "name": "Dallas Slant (R)", "steps": [{ "type": "stem", "yards": 3 }, { "type": "break", "angle": -45, "yards": 18 }] },

    "scissors_post_L": { "name": "Scissors Post (L)", "steps": [{ "type": "stem", "yards": 10 }, { "type": "break", "angle": 45, "yards": 10 }] },
    "scissors_corner_L": { "name": "Scissors Corner (L)", "steps": [{ "type": "stem", "yards": 10 }, { "type": "break", "angle": -45, "yards": 10 }] },
    "scissors_post_R": { "name": "Scissors Post (R)", "steps": [{ "type": "stem", "yards": 10 }, { "type": "break", "angle": -45, "yards": 10 }] },
    "scissors_corner_R": { "name": "Scissors Corner (R)", "steps": [{ "type": "stem", "yards": 10 }, { "type": "break", "angle": 45, "yards": 10 }] },
    
    "fresno_go_L": { "name": "Fresno Go (L)", "steps": [{ "type": "release", "angle": -135, "yards": 3 }, { "type": "stem", "yards": 18 }] },
    "fresno_sit_L": { "name": "Fresno Sit (L)", "steps": [{ "type": "break", "angle": 45, "yards": 8 }, { "type": "break", "angle": 180, "yards": 5 }] },
    "fresno_drag_L": { "name": "Fresno Drag (L)", "steps": [{ "type": "stem", "yards": 2 }, { "type": "break", "angle": -90, "yards": 25 }] },
    "fresno_go_R": { "name": "Fresno Go (R)", "steps": [{ "type": "release", "angle": -45, "yards": 3 }, { "type": "stem", "yards": 18 }] },
    "fresno_sit_R": { "name": "Fresno Sit (R)", "steps": [{ "type": "break", "angle": -45, "yards": 8 }, { "type": "break", "angle": 0, "yards": 5 }] },
    "fresno_drag_R": { "name": "Fresno Drag (R)", "steps": [{ "type": "stem", "yards": 2 }, { "type": "break", "angle": 90, "yards": 25 }] },
    
    "screen_rcv_L": { "name": "Screen Receiver", "steps": [{ "type": "stem", "yards": 1 }, { "type": "break", "angle": -150, "yards": 4 }] },
    "screen_block_L": { "name": "Screen Blocker", "steps": [{ "type": "stem", "yards": 2 }, { "type": "break", "angle": -110, "yards": 6 }] },
    "screen_rcv_R": { "name": "Screen Receiver", "steps": [{ "type": "stem", "yards": 1 }, { "type": "break", "angle": 150, "yards": 4 }] },
    "screen_block_R": { "name": "Screen Blocker", "steps": [{ "type": "stem", "yards": 2 }, { "type": "break", "angle": 110, "yards": 6 }] },

    "stupid_out_L": { "name": "Stupid Out (L)", "steps": [{ "type": "stem", "yards": 5 }, { "type": "break", "angle": -90, "yards": 10 }] },
    "stupid_corner_L": { "name": "Stupid Corner (L)", "steps": [{ "type": "stem", "yards": 6 }, { "type": "break", "angle": -45, "yards": 15 }] },
    "stupid_out_R": { "name": "Stupid Out (R)", "steps": [{ "type": "stem", "yards": 5 }, { "type": "break", "angle": 90, "yards": 10 }] },
    "stupid_corner_R": { "name": "Stupid Corner (R)", "steps": [{ "type": "stem", "yards": 6 }, { "type": "break", "angle": 45, "yards": 15 }] },
    
    "slant_L": { "name": "Slant (L)", "steps": [{ "type": "break", "angle": 45, "yards": 8 }] },
    "slant_R": { "name": "Slant (R)", "steps": [{ "type": "break", "angle": -45, "yards": 8 }] },
  },
  "formations": {
    // ... Same detailed formations as before, just ensure they are here
  },
  "concepts": {
      "oneMan": { "Houston": { "assignments": { "outer": "hitch_6yd" } } },
      "twoMan": { 
          "Houston": { "assignments": { "outer": "hitch_6yd", "inner": "hitch_6yd" } }, 
          "Dallas": { "assignments": { "outer": "dallas_slant", "inner": "now_seam" } }, 
          "Scissors": { "assignments": { "outer": "scissors_post", "inner": "scissors_corner" } } 
      },
      "threeMan": { 
          "Houston": { "assignments": { "outer": "hitch_6yd", "middle": "hitch_6yd", "inner": "hitch_6yd" } }, 
          "Fresno": { "usesCenter": true, "assignments": { "outer": "fresno_go", "middle": "fresno_sit", "inner": "fresno_drag" } },
          "Spacing": { "formation": "Bunch", "assignments": { "outer": "hitch_6yd", "middle": "flat", "inner": "slant" } } 
      },
      "fullField": {
          "Yale": { "name": "Yale Screen", "formation": "Empty Lt", "assignments": { "X": "screen_rcv", "F": "screen_block", "Y": "screen_block", "Z": "go", "H": "slant", "C": "block", "Q": "block" } },
          "Harvard": { "name": "Harvard Screen", "formation": "Empty Rt", "assignments": { "Z": "screen_rcv", "F": "screen_block", "Y": "screen_block", "X": "go", "H": "slant", "C": "block", "Q": "block" } },
          "Stupid Lt": { "name": "Stupid", "formation": "Divide Lt", "assignments": { "X": "stupid_out", "Y": "stupid_corner", "Z": "stupid_out", "F": "stupid_corner", "C": "block", "H": "block", "Q": "block" } },
          "Stupid Rt": { "name": "Stupid", "formation": "Divide Rt", "assignments": { "X": "stupid_out", "F": "stupid_corner", "Z": "stupid_out", "Y": "stupid_corner", "C": "block", "H": "block", "Q": "block" } }
      }
  },
  "modifiers": {
    "Max": { "player": "F", "assignment": "block", "position": "mirrorH" },
    "Tight": { "type": "formationCompression", "spacing": 50 }
  }
};

// Add formations data here to keep the file clean
playbook.formations = {
    "Trips": {
      "Lt": { "positions": { "X": { "x": 100, "y": 380 }, "F": { "x": 180, "y": 380 }, "Y": { "x": 260, "y": 380 }, "C": { "x": 450, "y": 390 }, "Z": { "x": 600, "y": 380 }, "Q": { "x": 450, "y": 480 }, "H": { "x": 520, "y": 480 } }, "sides": { "left": { "count": 3, "players": { "outer": "X", "middle": "F", "inner": "Y" } }, "right": { "count": 1, "players": { "outer": "Z" } } } },
      "Rt": { "positions": { "X": { "x": 100, "y": 380 }, "C": { "x": 350, "y": 390 }, "Y": { "x": 420, "y": 380 }, "F": { "x": 500, "y": 380 }, "Z": { "x": 580, "y": 380 }, "Q": { "x": 350, "y": 480 }, "H": { "x": 280, "y": 480 } }, "sides": { "left": { "count": 1, "players": { "outer": "X" } }, "right": { "count": 3, "players": { "outer": "Z", "middle": "F", "inner": "Y" } } } }
    },
    "Divide": {
      "Lt": { "positions": { "X": { "x": 100, "y": 380 }, "Y": { "x": 180, "y": 380 }, "C": { "x": 350, "y": 390 }, "F": { "x": 520, "y": 380 }, "Z": { "x": 600, "y": 380 }, "Q": { "x": 350, "y": 480 }, "H": { "x": 420, "y": 480 } }, "sides": { "left": { "count": 2, "players": { "outer": "X", "inner": "Y" } }, "right": { "count": 2, "players": { "outer": "Z", "inner": "F" } } } },
      "Rt": { "positions": { "X": { "x": 100, "y": 380 }, "F": { "x": 180, "y": 380 }, "C": { "x": 350, "y": 390 }, "Y": { "x": 520, "y": 380 }, "Z": { "x": 600, "y": 380 }, "Q": { "x": 350, "y": 480 }, "H": { "x": 280, "y": 480 } }, "sides": { "left": { "count": 2, "players": { "outer": "X", "inner": "F" } }, "right": { "count": 2, "players": { "outer": "Z", "inner": "Y" } } } }
    },
    "Bunch": {
      "Lt": { "positions": { "X": { "x": 80, "y": 380 }, "Y": { "x": 150, "y": 380 }, "F": { "x": 115, "y": 400 }, "C": { "x": 350, "y": 390 }, "Z": { "x": 600, "y": 380 }, "Q": { "x": 350, "y": 480 }, "H": { "x": 420, "y": 480 } }, "sides": { "left": { "count": 3, "players": { "outer": "X", "middle": "Y", "inner": "F" } }, "right": { "count": 1, "players": { "outer": "Z" } } } },
      "Rt": { "positions": { "X": { "x": 100, "y": 380 }, "C": { "x": 350, "y": 390 }, "Y": { "x": 530, "y": 380 }, "F": { "x": 565, "y": 400 }, "Z": { "x": 600, "y": 380 }, "Q": { "x": 350, "y": 480 }, "H": { "x": 280, "y": 480 } }, "sides": { "left": { "count": 1, "players": { "outer": "X" } }, "right": { "count": 3, "players": { "outer": "Z", "middle": "Y", "inner": "F" } } } }
    },
    "Empty": {
      "Lt": { "positions": { "X": { "x": 80, "y": 380 }, "F": { "x": 160, "y": 380 }, "Y": { "x": 240, "y": 380 }, "C": { "x": 350, "y": 390 }, "H": { "x": 460, "y": 380 }, "Z": { "x": 540, "y": 380 }, "Q": { "x": 350, "y": 480 } }, "sides": { "left": { "count": 3, "players": { "outer": "X", "middle": "F", "inner": "Y" } }, "right": { "count": 2, "players": { "outer": "Z", "inner": "H" } } } },
      "Rt": { "positions": { "X": { "x": 160, "y": 380 }, "H": { "x": 240, "y": 380 }, "C": { "x": 350, "y": 390 }, "Y": { "x": 460, "y": 380 }, "F": { "x": 540, "y": 380 }, "Z": { "x": 620, "y": 380 }, "Q": { "x": 350, "y": 480 } }, "sides": { "left": { "count": 2, "players": { "outer": "X", "inner": "H" } }, "right": { "count": 3, "players": { "outer": "Z", "middle": "F", "inner": "Y" } } } }
    }
};

