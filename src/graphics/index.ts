export { GraphicsController } from './GraphicsController';

export { IRenderer, RendererCapabilities } from './renderers/IRenderer';
export { IMaterialManager } from './materials/IMaterialManager';

// WebGL exports
export { WebGLFactory } from './webgl';
export { WebGLRenderer } from './webgl/renderers/WebGLRenderer';
export { MaterialManager } from './webgl/materials/MaterialManager';
export { ShaderSources, ShaderType } from './webgl/materials/ShaderLoader';

// WebGPU exports  
export { WebGPUFactory } from './webgpu';
export { WebGPURenderer } from './webgpu/renderers/WebGPURenderer';

export { AnimationController } from './animation/AnimationController';
export { AnimationState, animationStates } from './animation/AnimationStates';
export * from './animation/AnimationUtils';
export { SceneManager } from './scene/SceneManager';
