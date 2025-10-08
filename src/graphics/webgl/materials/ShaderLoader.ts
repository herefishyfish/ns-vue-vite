// Shader sources - in the future these could be loaded from files
// For now, we'll define them inline to maintain compatibility

const gradientVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gradientFragmentShader = `
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

const glowVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
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

const logoGradientVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const logoGradientFragmentShader = `
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

export const ShaderSources = {
  gradient: {
    vertex: gradientVertexShader,
    fragment: gradientFragmentShader
  },
  glow: {
    vertex: glowVertexShader,
    fragment: glowFragmentShader
  },
  logoGradient: {
    vertex: logoGradientVertexShader,
    fragment: logoGradientFragmentShader
  }
} as const;

export type ShaderType = keyof typeof ShaderSources;
