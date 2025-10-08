struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) uv: vec2<f32>,
}

struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

struct Uniforms {
  color1: vec3<f32>,
  color2: vec3<f32>,
  accentColor1: vec3<f32>,
  accentColor2: vec3<f32>,
  radialPos1: vec2<f32>,
  radialPos2: vec2<f32>,
  time: f32,
  pulseIntensity: f32,
  modelViewProjection: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.clip_position = uniforms.modelViewProjection * vec4<f32>(input.position, 1.0);
  output.uv = input.uv;
  return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let uv = input.uv;
  
  // Base linear gradient
  let baseColor = mix(uniforms.color1, uniforms.color2, length(uv - vec2<f32>(0.0, 0.0)));
  
  // Animated pulse effect - more subtle and slower
  let pulse = sin(uniforms.time * 0.001) * 0.15 + 0.85;
  
  // First radial gradient - improved visibility
  let dist1 = distance(uv, uniforms.radialPos1);
  var radial1 = 1.0 - smoothstep(0.0, 0.6 * pulse, dist1);
  radial1 = pow(radial1, 2.0);
  
  // Second radial gradient - improved visibility
  let dist2 = distance(uv, uniforms.radialPos2);
  var radial2 = 1.0 - smoothstep(0.0, 0.6 * pulse, dist2);
  radial2 = pow(radial2, 2.0);
  
  // Combine gradients with better blending
  var finalColor = baseColor;
  
  finalColor = mix(finalColor, uniforms.accentColor1, radial1 * uniforms.pulseIntensity);
  finalColor = mix(finalColor, uniforms.accentColor2, radial2 * uniforms.pulseIntensity);
  
  finalColor += uniforms.accentColor1 * radial1 * uniforms.pulseIntensity * 0.3;
  finalColor += uniforms.accentColor2 * radial2 * uniforms.pulseIntensity * 0.3;
  
  return vec4<f32>(finalColor, 1.0);
}
