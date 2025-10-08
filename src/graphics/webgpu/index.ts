import { IMaterialManager } from "../materials/IMaterialManager";
import { IRenderer } from "../renderers/IRenderer";
import { WebGPUMaterialManager } from "./materials/WebGPUMaterialManager";
import { WebGPURenderer } from "./renderers/WebGPURenderer";

export class WebGPUFactory {
  static createRenderer(): IRenderer {
    console.log('Creating WebGPU renderer');
    return new WebGPURenderer();
  }

  static createMaterialManager(): IMaterialManager {
    console.log('Creating WebGPU material manager');
    return new WebGPUMaterialManager();
  }
}

export { WebGPURenderer } from './renderers/WebGPURenderer';
export { WebGPUMaterialManager } from './materials/WebGPUMaterialManager';

