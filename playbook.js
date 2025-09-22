// playbook.js

// Define the field zones for the filtering feature
// These are based on the SVG viewBox="0 0 650 600"
const ZONES = {
    "flat_left": { x: 0, y: 250, width: 150, height: 100 },
    "flat_right": { x: 500, y: 250, width: 150, height: 100 },
    "intermediate_left": { x: 0, y: 125, width: 220, height: 125 },
    "intermediate_middle": { x: 220, y: 125, width: 210, height: 125 },
    "intermediate_right": { x: 430, y: 125, width: 220, height: 125 },
    "deep_left": { x: 0, y: 0, width: 325, height: 125 },
    "deep_right": { x: 325, y: 0, width: 325, height: 125 },
};

const PLAYBOOK = {
  formations: {
    "Trips Lt": {
      X: { x: 100, y: 350 }, F: { x: 180, y: 350 }, Y: { x: 260, y: 350 },
      C: { x: 450, y: 360 }, Z: { x: 550, y: 350 }, H: { x: 400, y: 420 },
      Q: { x: 400, y: 500 },
    },
    "Trips Rt": {
      X: { x: 100, y: 350 }, C: { x: 200, y: 360 }, Y: { x: 370, y: 350 },
      F: { x: 450, y: 350 }, Z: { x: 530, y: 350 }, H: { x: 250, y: 420 },
      Q: { x: 250, y: 500 },
    },
    "Divide Lt": {
      X: { x: 100, y: 350 }, Y: { x: 180, y: 350 }, C: { x: 325, y: 360 },
      F: { x: 470, y: 350 }, Z: { x: 550, y: 350 }, H: { x: 325, y: 450 },
      Q: { x: 325, y: 500 },
    },
    "Divide Rt": {
      X: { x: 100, y: 350 }, F: { x: 180, y: 350 }, C: { x: 325, y: 360 },
      Y: { x: 470, y: 350 }, Z: { x: 550, y: 350 }, H: { x: 325, y: 450 },
      Q: { x: 325, y: 500 },
    },
    // TODO: Add "Empty Lt/Rt", "Bunch Lt/Rt" here
  },

  plays: {
    "Flood": { // From R. Flood.pdf
      X: { path: "M 0 0 V -180", color: "blue", zoneTargets: ["deep_left"] },
      F: { path: "M 0 0 L 100 -100", color: "black", zoneTargets: ["intermediate_right"] },
      Y: { path: "M 0 0 C 50 -10, 80 -30, 100 -50", color: "deeppink", zoneTargets: ["flat_right"] },
      Z: { path: "M 0 0 C 80 -150, 20 -200, 0 -220", color: "red", zoneTargets: ["deep_right"]},
      C: { path: "M 0 0 q 0 -20, 15 -30", color: "grey" },
      H: { path: "M 0 0 q 0 20, -15 30", color: "grey" },
      Q: { path: "M 0 0 C -50 30, -150 30, -200 10", color: "grey" },
    },
    "Crossers": { // From R. Divide Crossers.pdf
      X: { path: "M 0 0 C 100 -20, 350 -20, 500 0", color: "blue", zoneTargets: ["intermediate_left", "intermediate_middle", "intermediate_right"]},
      Y: { path: "M 0 0 C 150 -150, 300 -180, 400 -180", color: "deeppink", zoneTargets: ["deep_right"]},
      F: { path: "M 0 0 C -50 -80, -150 -90, -250 -80", color: "black", zoneTargets: ["intermediate_left"]},
      Z: { path: "M 0 0 C 50 -200, -150 -250, -350 -220", color: "red", zoneTargets: ["deep_left"]},
      C: { path: "M 0 0 q 0 -20, 15 -30", color: "grey" },
      H: { path: "M 0 0 q 0 20, 15 30", color: "grey" },
      Q: { path: "M 0 0 C 50 30, 150 30, 200 10", color: "grey" },
    },
    // TODO: Add "Shallows", "Stupid", "Screens", etc. here
  },
  
  modifiers: {
      "Max": ["F"],
  },

  handSignals: {
    // NOTE: Replace these with the actual paths to your images in the `signals` folder.
    formations: {
        "Trips": "signals/trips_signal.png",
        "Divide": "signals/divide_signal.png",
        "Empty": "signals/empty_signal.png",
        "Bunch": "signals/bunch_signal.png",
    },
    plays: {
        "Crossers": "signals/crossers_signal.png",
        "Flood": "signals/flood_signal.png",
        "Shallows": "signals/shallows_signal.png",
    }
  }
};
