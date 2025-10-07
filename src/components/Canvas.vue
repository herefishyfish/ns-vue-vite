<script lang="ts" setup>
import { Canvas } from "@nativescript/canvas";
import { LoadEventData, Screen } from "@nativescript/core";
import { registerElement, watch } from "nativescript-vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

registerElement("Canvas", () => Canvas);

let canvas: Canvas;
let animationId: number;
let currentTime = 0;

let gradientPlane: THREE.Mesh;
let gradientMaterial: THREE.ShaderMaterial;

const createGradientShader = () => {
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 accentColor1;
    uniform vec3 accentColor2;
    uniform vec2 radialPos1;
    uniform vec2 radialPos2;
    uniform float time;
    uniform float pulseIntensity;
    
    varying vec2 vUv;
    
    void main() {
      // Base linear gradient
      vec3 baseColor = mix(color1, color2, length(vUv - vec2(0.0, 0.0)));
      
      // Animated pulse effect - more subtle and slower
      float pulse = sin(time * 0.001) * 0.15 + 0.85;
      
      // First radial gradient - improved visibility
      float dist1 = distance(vUv, radialPos1);
      // Make radial gradient larger and more visible
      float radial1 = 1.0 - smoothstep(0.0, 0.6 * pulse, dist1);
      radial1 = pow(radial1, 2.0); // Add falloff for better blending
      
      // Second radial gradient - improved visibility
      float dist2 = distance(vUv, radialPos2);
      float radial2 = 1.0 - smoothstep(0.0, 0.6 * pulse, dist2);
      radial2 = pow(radial2, 2.0); // Add falloff for better blending
      
      // Combine gradients with better blending
      vec3 finalColor = baseColor;
      
      // Use mix instead of additive for better control
      finalColor = mix(finalColor, accentColor1, radial1 * pulseIntensity);
      finalColor = mix(finalColor, accentColor2, radial2 * pulseIntensity);
      
      // Add subtle additive layer for extra glow
      finalColor += accentColor1 * radial1 * pulseIntensity * 0.3;
      finalColor += accentColor2 * radial2 * pulseIntensity * 0.3;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      color1: { value: new THREE.Color(0x1a1a2e) },
      color2: { value: new THREE.Color(0x16213e) },
      accentColor1: { value: new THREE.Color(0x41d1ff) },
      accentColor2: { value: new THREE.Color(0xbd34fe) },
      radialPos1: { value: new THREE.Vector2(0.2, 0.5) },
      radialPos2: { value: new THREE.Vector2(0.8, 0.5) },
      time: { value: 0 },
      pulseIntensity: { value: 0.6 },
    },
  });
};

const createGlowShader = () => {
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 glowColor;
    uniform float glowIntensity;
    
    varying vec2 vUv;
    
    void main() {
      // Create radial gradient from center
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      // Create very tight glow effect - approximately 8 pixels
      // Using much tighter range for the glow falloff
      float glow = 1.0 - smoothstep(0.48, 0.52, dist); // Very tight 4% range
      glow = pow(glow, 8.0); // Much more dramatic falloff for very tight edge
      
      // Add inner core for better object adherence
      float core = 1.0 - smoothstep(0.0, 0.47, dist);
      core = pow(core, 4.0);
      
      // Combine core and glow for tight object-hugging effect
      float finalGlow = max(glow * 0.6, core * 0.3);
      
      gl_FragColor = vec4(glowColor, finalGlow * glowIntensity);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      glowColor: { value: new THREE.Color(0x4dd0e1) },
      glowIntensity: { value: 0.4 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
};

const createLogoGradientShader = (color1: number, color2: number) => {
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    uniform float gradientDirection;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Create gradient based on UV coordinates (more reliable than position)
      float gradient = mix(vUv.y, vUv.x, gradientDirection);
      
      // Make the gradient more pronounced and create sharper transitions
      gradient = smoothstep(0.4, 0.8, gradient); // Creates more contrast between colors
      
      // Add time-based animation for more dynamic effect
      float wave = sin(time * 0.002 + gradient * 6.28318) * 0.1 + 0.9;
      
      // Mix colors with animated wave - make gradient more prominent
      vec3 finalColor = mix(color1, color2, gradient * wave);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) },
      time: { value: 1 },
      gradientDirection: { value: 0.7 },
    },
  });
};

const scene = new THREE.Scene();
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let viteLogo: THREE.Mesh;
let logoGlow: THREE.Mesh; 
let logoGradientMaterial: THREE.ShaderMaterial;
let logoGradientMaterial2: THREE.ShaderMaterial;

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
});

watch(
  () => props.progress,
  (newValue) => {
    interpolateStates(newValue);
  }
);

// Combined states for both 3D model and gradient background
const states = [
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

let currentState = states[0];

// Utility functions for color interpolation
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const parseRgbaColor = (
  rgba: string
): { r: number; g: number; b: number; a: number } => {
  const match = rgba.match(/rgba?\(([^)]+)\)/);
  if (match) {
    const values = match[1].split(",").map((v) => parseFloat(v.trim()));
    return {
      r: values[0] || 0,
      g: values[1] || 0,
      b: values[2] || 0,
      a: values[3] !== undefined ? values[3] : 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const rgbaToHex = (r: number, g: number, b: number): number => {
  return (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b);
};

const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

const lerpColor = (color1: string, color2: string, factor: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(lerp(rgb1.r, rgb2.r, factor));
  const g = Math.round(lerp(rgb1.g, rgb2.g, factor));
  const b = Math.round(lerp(rgb1.b, rgb2.b, factor));

  return rgbToHex(r, g, b);
};

const lerpRgbaColor = (
  color1: string,
  color2: string,
  factor: number
): string => {
  const rgba1 = parseRgbaColor(color1);
  const rgba2 = parseRgbaColor(color2);

  const r = lerp(rgba1.r, rgba2.r, factor);
  const g = lerp(rgba1.g, rgba2.g, factor);
  const b = lerp(rgba1.b, rgba2.b, factor);
  const a = lerp(rgba1.a, rgba2.a, factor);

  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
};

const interpolateStates = (progress: number) => {
  const adjustedProgress = progress + 1;
  const clampedProgress = Math.max(
    0,
    Math.min(states.length - 1, adjustedProgress)
  );

  const stateIndex = Math.floor(clampedProgress);
  const nextStateIndex =
    stateIndex + 1 < states.length ? stateIndex + 1 : stateIndex;
  const lerpFactor = clampedProgress - stateIndex;

  const state1 = states[stateIndex];
  const state2 = states[nextStateIndex];

  const verticalOffset = Math.sin(currentTime * 0.001) * 0.1;

  if (viteLogo) {
    viteLogo.rotation.x = THREE.MathUtils.lerp(
      state1.rotation.x,
      state2.rotation.x,
      lerpFactor
    );
    viteLogo.rotation.y = THREE.MathUtils.lerp(
      state1.rotation.y,
      state2.rotation.y,
      lerpFactor
    );
    viteLogo.rotation.z = THREE.MathUtils.lerp(
      state1.rotation.z,
      state2.rotation.z,
      lerpFactor
    );

    viteLogo.scale.x = THREE.MathUtils.lerp(
      state1.scale,
      state2.scale,
      lerpFactor
    );
    viteLogo.scale.y = THREE.MathUtils.lerp(
      state1.scale,
      state2.scale,
      lerpFactor
    );
    viteLogo.scale.z = THREE.MathUtils.lerp(
      state1.scale,
      state2.scale,
      lerpFactor
    );

    const baseY = THREE.MathUtils.lerp(
      state1.position.y,
      state2.position.y,
      lerpFactor
    );

    viteLogo.position.x = THREE.MathUtils.lerp(
      state1.position.x,
      state2.position.x,
      lerpFactor
    );
    viteLogo.position.y = baseY + verticalOffset;
    viteLogo.position.z = THREE.MathUtils.lerp(
      state1.position.z,
      state2.position.z,
      lerpFactor
    );
  }

  if (logoGlow && viteLogo) {
    logoGlow.position.copy(viteLogo.position);
    logoGlow.position.z -= 0.2;

    const glowScale = viteLogo.scale.x * 0.95;
    logoGlow.scale.set(glowScale, glowScale, 1);

    logoGlow.lookAt(camera.position);
  }

  currentState = {
    rotation: state1.rotation,
    scale: state1.scale,
    position: state1.position,
    baseColor1: lerpColor(state1.baseColor1, state2.baseColor1, lerpFactor),
    baseColor2: lerpColor(state1.baseColor2, state2.baseColor2, lerpFactor),
    accentColor1: lerpRgbaColor(
      state1.accentColor1,
      state2.accentColor1,
      lerpFactor
    ),
    accentColor2: lerpRgbaColor(
      state1.accentColor2,
      state2.accentColor2,
      lerpFactor
    ),
    pulseIntensity: lerp(
      state1.pulseIntensity,
      state2.pulseIntensity,
      lerpFactor
    ),
    radialPositions: {
      r1: {
        x: lerp(
          state1.radialPositions.r1.x,
          state2.radialPositions.r1.x,
          lerpFactor
        ),
        y: lerp(
          state1.radialPositions.r1.y,
          state2.radialPositions.r1.y,
          lerpFactor
        ),
      },
      r2: {
        x: lerp(
          state1.radialPositions.r2.x,
          state2.radialPositions.r2.x,
          lerpFactor
        ),
        y: lerp(
          state1.radialPositions.r2.y,
          state2.radialPositions.r2.y,
          lerpFactor
        ),
      },
    },
  };
};

const updateGradientUniforms = () => {
  if (!gradientMaterial) return;

  gradientMaterial.uniforms.color1.value.setHex(
    parseInt(currentState.baseColor1.replace("#", "0x"))
  );
  gradientMaterial.uniforms.color2.value.setHex(
    parseInt(currentState.baseColor2.replace("#", "0x"))
  );

  const accentColor1 = parseRgbaColor(currentState.accentColor1);
  const accentColor2 = parseRgbaColor(currentState.accentColor2);

  gradientMaterial.uniforms.accentColor1.value.setHex(
    rgbaToHex(accentColor1.r, accentColor1.g, accentColor1.b)
  );
  gradientMaterial.uniforms.accentColor2.value.setHex(
    rgbaToHex(accentColor2.r, accentColor2.g, accentColor2.b)
  );

  gradientMaterial.uniforms.radialPos1.value.set(
    currentState.radialPositions.r1.x,
    currentState.radialPositions.r1.y
  );
  gradientMaterial.uniforms.radialPos2.value.set(
    currentState.radialPositions.r2.x,
    currentState.radialPositions.r2.y
  );
  gradientMaterial.uniforms.time.value = currentTime;
  gradientMaterial.uniforms.pulseIntensity.value = currentState.pulseIntensity;

  if (logoGradientMaterial) {
    logoGradientMaterial.uniforms.time.value = currentTime;
  }
  if (logoGradientMaterial2) {
    logoGradientMaterial2.uniforms.time.value = currentTime;
  }
};

const animate = () => {
  currentTime = performance.now();

  interpolateStates(props.progress);

  updateGradientUniforms();

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }

  animationId = requestAnimationFrame(animate);
};

const onReady = (args: LoadEventData) => {
  canvas = args.object as Canvas;

  canvas.width = canvas.clientWidth * Screen.mainScreen.scale;
  canvas.height = canvas.clientHeight * Screen.mainScreen.scale;

  const webglCtx = canvas.getContext("webgl2");
  canvas.ignoreTouchEvents = true;

  if (!webglCtx) {
    console.error("No WebGL context available");
    return;
  }

  renderer = new THREE.WebGLRenderer({
    context: webglCtx as any, // Type assertion for NativeScript
    antialias: true,
  });

  camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    0.1,
    1000
  );
  camera.position.z = 5;

  gradientMaterial = createGradientShader();
  const planeGeometry = new THREE.PlaneGeometry(20, 20);
  gradientPlane = new THREE.Mesh(planeGeometry, gradientMaterial);
  gradientPlane.position.z = -10;
  scene.add(gradientPlane);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(30, 60, 30);
  scene.add(dirLight);
  const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambLight);

  const glowMaterial = createGlowShader();
  const glowGeometry = new THREE.PlaneGeometry(4, 4);
  logoGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(logoGlow);

  logoGradientMaterial = createLogoGradientShader(0xbd34fe, 0x41d1ff); // Blue to purple (SVG gradient #a)
  logoGradientMaterial2 = createLogoGradientShader(0xffdd35, 0xffa800); // Yellow to orange (SVG gradient #b)

  const loader = new GLTFLoader();
  loader.load("~/assets/vite.glb", (gltf: any) => {
    viteLogo = gltf.scene;

    let meshIndex = 0;
    viteLogo.traverse((child: any) => {
      if (child.isMesh) {
        console.log(
          "Mesh found:",
          child.name,
          "Material:",
          child.material?.name,
          "Index:",
          meshIndex
        );

        if (meshIndex % 2 === 0) {
          child.material = logoGradientMaterial.clone();
          console.log("Applied blue-purple gradient to mesh", meshIndex);
        } else {
          child.material = logoGradientMaterial2.clone();
          console.log("Applied yellow-orange gradient to mesh", meshIndex);
        }

        meshIndex++;
      }
    });

    scene.add(gltf.scene);
    interpolateStates(props.progress);
  });

  interpolateStates(props.progress);

  animate();
};

const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
};
</script>
<template>
  <Canvas @ready="onReady" />
</template>
