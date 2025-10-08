struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) uv: vec2<f32>,
}

struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

struct Uniforms {
  glowColor: vec3<f32>,
  glowIntensity: f32,
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
  
  let center = vec2<f32>(0.5, 0.5);
  let dist = distance(uv, center);
  
  var glow = 1.0 - smoothstep(0.48, 0.52, dist);
  glow = pow(glow, 8.0);
  
  var core = 1.0 - smoothstep(0.0, 0.47, dist);
  core = pow(core, 4.0);
  
  let finalGlow = max(glow * 0.6, core * 0.3);
  
  return vec4<f32>(uniforms.glowColor, finalGlow * uniforms.glowIntensity);
}
