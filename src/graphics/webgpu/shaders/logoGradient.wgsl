struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) uv: vec2<f32>,
}

struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
  @location(0) uv: vec2<f32>,
  @location(1) position: vec3<f32>,
}

struct Uniforms {
  color1: vec3<f32>,
  color2: vec3<f32>,
  time: f32,
  gradientDirection: f32,
  modelViewProjection: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.clip_position = uniforms.modelViewProjection * vec4<f32>(input.position, 1.0);
  output.uv = input.uv;
  output.position = input.position;
  return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let uv = input.uv;
  
  let gradient = mix(uv.y, uv.x, uniforms.gradientDirection);
  let gradientSmooth = smoothstep(0.4, 0.8, gradient);
  let wave = sin(uniforms.time * 0.002 + gradientSmooth * 6.28318) * 0.1 + 0.9;
  let finalColor = mix(uniforms.color1, uniforms.color2, gradientSmooth * wave);
  
  return vec4<f32>(finalColor, 1.0);
}
