const defaultPlaybook = {
  "routeLibrary": {
    "go": { "name": "Go", "path": "M 0 0 V -220" },
    "post": { "name": "Post", "path": "M 0 0 V -60 L 80 -180" },
    "corner": { "name": "Corner", "path": "M 0 0 V -60 L -80 -180" },
    "scissors_post": { "name": "Scissors Post", "path": "M 0 0 v -120 L 80 -180" },
    "scissors_corner": { "name": "Scissors Corner", "path": "M 0 0 v -120 L -80 -180" },
    "out": { "name": "Out", "path": "M 0 0 V -100 H 100" },
    "in": { "name": "In/Dig", "path": "M 0 0 V -120 H -120" },
    "slant": { "name": "Slant", "path": "M 0 0 L -60 -60" },
    "hitch_6yd": { "name": "6yd Hitch (Houston)", "path": "M 0 0 v -72 l -10 10" },
    "dallas_slant": { "name": "Dallas Slant", "path": "M 0 0 v -36 L 80 -180" },
    "now_go": { "name": "Now Go (15yd)", "path": "M 0 0 V -180" },
    "fresno_go": { "name": "Fresno Go", "path": "M 0 0 l 20 -36 v -180" },
    "fresno_sit": { "name": "Fresno Sit", "path": "M 0 0 l 60 -96 l -20 30" },
    "fresno_drag": { "name": "Fresno Drag", "path": "M 0 0 v -24 H 250" },
    "screen_rcv": { "name": "Screen Receiver", "path": "M 0 0 v -12 l -40 -10" },
    "screen_block": { "name": "Screen Blocker", "path": "M 0 0 v -24 l -60 20" },
    "stupid_out_5yd": { "name": "5yd Out", "path": "M 0 0 v -60 H 100" },
    "stupid_corner_6yd": { "name": "6yd Corner", "path": "M 0 0 v -72 L -80 -180" },
    "flat": { "name": "Flat", "path": "M 0 0 C 20 -5, 40 -5, 60 0 H 100" },
    "shallow": { "name": "Shallow Cross", "path": "M 0 0 C 100 -20, 250 -20, 400 0" },
    "deepCross": { "name": "Deep Cross", "path": "M 0 0 C 150 -150, 300 -180, 400 -180" },
    "comeback": { "name": "Comeback", "path": "M 0 0 V -120 L -20 -100" },
    "block": { "name": "Block", "path": "" },
    "swingR": { "name": "Swing Right", "path": "M 0 0 C 50 30, 150 30, 200 10" },
    "swingL": { "name": "Swing Left", "path": "M 0 0 C -50 30, -150 30, -200 10" }
  },
  "formations": {
    "Trips": {
      "Lt": { "positions": { "X": { "x": 100, "y": 380 }, "F": { "x": 180, "y": 380 }, "Y": { "x": 260, "y": 380 }, "C": { "x": 450, "y": 390 }, "Z": { "x": 600, "y": 380 }, "Q": { "x": 450, "y": 480 }, "H": { "x": 520, "y": 480 } }, "sides": { "left": { "count": 3, "players": { "outer": "X", "middle": "F", "inner": "Y" } }, "right": { "count": 1, "players": { "outer": "Z" } } } },
      "Rt": { "positions": { "X": { "x": 100, "y": 380 }, "C": { "x": 350, "y": 390 }, "Y": { "x": 420, "y": 380 }, "F": { "x": 500, "y": 380 }, "Z": { "x": 580, "y": 380 }, "Q": { "x": 350, "y": 480 }, "H": { "x": 280, "y": 480 } }, "sides": { "left": { "count": 1, "players": { "outer": "X" } }, "right": { "count": 3, "players": { "outer": "Z", "middle": "F", "inner": "Y" } } } }
    },
    "Divide": {
      "Lt": { "positions": { "X": { "x": 100, "y": 380 }, "Y": { "x": 180, "y": 380 }, "C": { "x": 350, "y": 390 }, "F": { "x": 520, "y": 380 }, "Z": { "x": 600, "y": 380 }, "Q": { "x": 350, "y": 480 }, "H": { "x": 420, "y": 480 } }, "sides": { "left": { "count": 2, "players": { "outer": "X", "inner": "Y" } }, "right": { "count": 2, "players": { "outer": "Z", "inner": "F" } } } },
      "Rt": { "positions": { "X": { "x": 100, "y": 380 }, "F": { "x": 180, "y": 380 }, "C": { "x": 350, "y": 390 }, "Y": { "x": 520, "y": 380 }, "Z": { "x": 600, "y": 380 }, "Q": { "x": 350, "y": 480 }, "H": { "x": 280, "y": 480 } }, "sides": { "left": { "count": 2, "players": { "outer": "X", "inner": "F" } }, "right": { "count": 2, "players": { "outer": "Z", "inner": "Y" } } } }
    },
    "Empty": {
      "Lt": { "positions": { "X": { "x": 80, "y": 380 }, "F": { "x": 160, "y": 380 }, "Y": { "x": 240, "y": 380 }, "C": { "x": 350, "y": 390 }, "H": { "x": 460, "y": 380 }, "Z": { "x": 540, "y": 380 }, "Q": { "x": 350, "y": 480 } }, "sides": { "left": { "count": 3, "players": { "outer": "X", "middle": "F", "inner": "Y" } }, "right": { "count": 2, "players": { "outer": "Z", "inner": "H" } } } },
      "Rt": { "positions": { "X": { "x": 160, "y": 380 }, "H": { "x": 240, "y": 380 }, "C": { "x": 350, "y": 390 }, "Y": { "x": 460, "y": 380 }, "F": { "x": 540, "y": 380 }, "Z": { "x": 620, "y": 380 }, "Q": { "x": 350, "y": 480 } }, "sides": { "left": { "count": 2, "players": { "outer": "X", "inner": "H" } }, "right": { "count": 3, "players": { "outer": "Z", "middle": "F", "inner": "Y" } } } }
    }
  },
  "concepts": {
      "oneMan": { "Go": { "assignments": { "outer": "go" } }, "Slant": { "assignments": { "outer": "slant" } }, "In": { "assignments": { "outer": "in" } }, "Houston": { "assignments": { "outer": "hitch_6yd" } } },
      "twoMan": { "Houston": { "assignments": { "outer": "hitch_6yd", "inner": "hitch_6yd" } }, "Dallas": { "assignments": { "outer": "dallas_slant", "inner": "now_go" } }, "Scissors": { "assignments": { "outer": "scissors_post", "inner": "scissors_corner" } } },
      "threeMan": { "Houston": { "assignments": { "outer": "hitch_6yd", "middle": "hitch_6yd", "inner": "hitch_6yd" } }, "Fresno": { "usesCenter": true, "assignments": { "outer": "fresno_go", "middle": "fresno_sit", "inner": "fresno_drag" } }, "Spacing": { "assignments": { "outer": "hitch_6yd", "middle": "flat", "inner": "slant" } } },
      "fullField": {
          "Yale": { "name": "Yale Screen", "formation": "Empty Lt", "assignments": { "X": "screen_rcv", "F": "screen_block", "Y": "screen_block", "Z": "go", "H": "slant", "C": "block", "Q": "block" } },
          "Harvard": { "name": "Harvard Screen", "formation": "Empty Rt", "assignments": { "Z": "screen_rcv", "F": "screen_block", "Y": "screen_block", "X": "go", "H": "slant", "C": "block", "Q": "block" } },
          "Stupid Lt": { "name": "Stupid", "formation": "Divide Lt", "assignments": { "X": "stupid_out_5yd", "Y": "stupid_corner_6yd", "Z": "stupid_out_5yd", "F": "stupid_corner_6yd", "C": "block", "H": "block", "Q": "block" } },
          "Stupid Rt": { "name": "Stupid", "formation": "Divide Rt", "assignments": { "X": "stupid_out_5yd", "F": "stupid_corner_6yd", "Z": "stupid_out_5yd", "Y": "stupid_corner_6yd", "C": "block", "H": "block", "Q": "block" } }
      }
  },
  "modifiers": {
    "Max": { "player": "F", "assignment": "block", "position": "mirrorH" },
    "Tight": { "type": "formationCompression", "spacing": 50 }
  }
};