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
