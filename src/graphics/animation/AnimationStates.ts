export interface AnimationState {
  rotation: { x: number; y: number; z: number };
  scale: number;
  position: { x: number; y: number; z: number };
  baseColor1: string;
  baseColor2: string;
  accentColor1: string;
  accentColor2: string;
  pulseIntensity: number;
  radialPositions: { 
    r1: { x: number; y: number }; 
    r2: { x: number; y: number }; 
  };
}

export const animationStates: AnimationState[] = [
  {
    rotation: { x: 0.8, y: -(Math.PI * 2) - 1, z: -0.2 },
    scale: 4,
    position: { x: -0.5, y: 2, z: 0.5 },
    baseColor1: "#0f0f23",
    baseColor2: "#1a1a2e",
    accentColor1: "rgba(41, 128, 185, 0.8)",
    accentColor2: "rgba(142, 68, 173, 0.6)",
    pulseIntensity: 0.05,
    radialPositions: { r1: { x: 0.1, y: 0.1 }, r2: { x: 0.9, y: 0.9 } },
  },
  {
    rotation: { x: 0.4, y: -(Math.PI * 2), z: 0 },
    scale: 6.5,
    position: { x: 0, y: 1.25, z: 0 },
    baseColor1: "#1a1a2e",
    baseColor2: "#16213e",
    accentColor1: "rgba(65, 209, 255, 1)",
    accentColor2: "rgba(189, 52, 254, 1)",
    pulseIntensity: 0.15,
    radialPositions: { r1: { x: 0.25, y: 0.3 }, r2: { x: 0.75, y: 0.7 } },
  },
  {
    rotation: { x: 0, y: 1, z: 0 },
    scale: 12,
    position: { x: -0.2, y: 0, z: 0 },
    baseColor1: "#1a1a2e",
    baseColor2: "#16213e",
    accentColor1: "rgba(65, 209, 255, 1)",
    accentColor2: "rgba(189, 52, 254, 1)",
    pulseIntensity: 0.1,
    radialPositions: { r1: { x: 0.15, y: 0.2 }, r2: { x: 0.85, y: 0.8 } },
  },
  {
    rotation: { x: 0, y: -1, z: 0.4 },
    scale: 5,
    position: { x: 0.2, y: 0.1, z: 0 },
    baseColor1: "#667eea",
    baseColor2: "#764ba2",
    accentColor1: "rgba(255, 255, 255, 0.1)",
    accentColor2: "rgba(255, 255, 255, 0.1)",
    pulseIntensity: 0.25,
    radialPositions: { r1: { x: 0.3, y: 0.15 }, r2: { x: 0.7, y: 0.85 } },
  },
  {
    rotation: { x: 0, y: -Math.PI * 2, z: 0 },
    scale: 10,
    position: { x: 0, y: 0, z: 0 },
    baseColor1: "#1e3c72",
    baseColor2: "#2a5298",
    accentColor1: "rgba(65, 209, 255, 0.2)",
    accentColor2: "rgba(189, 52, 254, 0.12)",
    pulseIntensity: 0.4,
    radialPositions: { r1: { x: 0.35, y: 0.65 }, r2: { x: 0.65, y: 0.35 } },
  },
  {
    rotation: { x: Math.PI * 2 + 0.4, y: 0, z: 0 },
    scale: 8,
    position: { x: 0, y: 1.2, z: 0 },
    baseColor1: "#434343",
    baseColor2: "#000000",
    accentColor1: "rgba(128, 128, 128, 0.2)",
    accentColor2: "rgba(188, 188, 188, 0.05)",
    pulseIntensity: 0.5,
    radialPositions: { r1: { x: 0.3, y: 0.7 }, r2: { x: 0.7, y: 0.3 } },
  },
  {
    rotation: { x: Math.PI * 2 + 0.8, y: 1, z: 0.3 },
    scale: 12,
    position: { x: 0.5, y: 0.5, z: -0.5 },
    baseColor1: "#2c1810",
    baseColor2: "#1a1a1a",
    accentColor1: "rgba(255, 165, 0, 0.4)",
    accentColor2: "rgba(255, 69, 0, 0.3)",
    pulseIntensity: 0.7,
    radialPositions: { r1: { x: 0.8, y: 0.2 }, r2: { x: 0.2, y: 0.8 } },
  },
];
