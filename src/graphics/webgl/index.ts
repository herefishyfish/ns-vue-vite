import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { MaterialManager } from "./materials/MaterialManager";
import { IRenderer } from "../renderers/IRenderer";

export class WebGLFactory {
  static createRenderer(): IRenderer {
    console.log('Creating WebGL renderer');
    return new WebGLRenderer();
  }

  static createMaterialManager(): MaterialManager {
    console.log('Creating WebGL material manager');
    return new MaterialManager(); // WebGL compatible
  }
}

// WebGL specific exports
export { WebGLRenderer } from './renderers/WebGLRenderer';
export { MaterialManager } from './materials/MaterialManager';
export { ShaderSources, ShaderType } from './materials/ShaderLoader';
