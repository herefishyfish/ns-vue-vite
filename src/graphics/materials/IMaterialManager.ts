import * as THREE from 'three';

export interface IMaterialManager {
  createGradientMaterial(): THREE.Material;
  createGlowMaterial(): THREE.Material;
  createLogoGradientMaterial(color1: number, color2: number, name?: string): THREE.Material;
  createGradientBackgroundMaterial?(): THREE.Material;
  getMaterial?(name: string): any;
  updateMaterialUniforms(name: string, uniforms: Record<string, any>): void;
  dispose(): void;
}
