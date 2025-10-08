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
