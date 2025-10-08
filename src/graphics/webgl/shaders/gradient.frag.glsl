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
