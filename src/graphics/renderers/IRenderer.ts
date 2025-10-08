import { Canvas } from "@nativescript/canvas";
import * as THREE from "three";

export interface IRenderer {
  initialize(canvas: Canvas): { context: any; width: number; height: number };
  render(scene: THREE.Scene, camera: THREE.Camera): void;
  setSize(width: number, height: number): void;
  dispose(): void;
}

export interface RendererCapabilities {
  supportsWebGL: boolean;
  supportsWebGPU: boolean;
  preferredAPI: 'webgl' | 'webgpu';
}
