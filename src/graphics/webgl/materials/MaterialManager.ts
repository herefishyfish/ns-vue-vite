import * as THREE from "three";
import { ShaderSources, ShaderType } from "./ShaderLoader";
import { IMaterialManager } from "../../materials/IMaterialManager";

export interface MaterialUniforms {
  [key: string]: { value: any };
}

export class MaterialManager implements IMaterialManager {
  private materials: Map<string, THREE.ShaderMaterial | THREE.MeshBasicMaterial> = new Map();
  private useWebGPUCompatible: boolean = false;

  createGradientMaterial(): THREE.ShaderMaterial | THREE.MeshBasicMaterial {
    try {
      const material = new THREE.ShaderMaterial({
        vertexShader: ShaderSources.gradient.vertex,
        fragmentShader: ShaderSources.gradient.fragment,
        uniforms: {
          color1: { value: new THREE.Color(0x1a1a2e) },
          color2: { value: new THREE.Color(0x16213e) },
          accentColor1: { value: new THREE.Color(0x41d1ff) },
          accentColor2: { value: new THREE.Color(0xbd34fe) },
          radialPos1: { value: new THREE.Vector2(0.2, 0.5) },
          radialPos2: { value: new THREE.Vector2(0.8, 0.5) },
          time: { value: 0 },
          pulseIntensity: { value: 0.6 },
        },
      });
  
      this.materials.set('gradient', material);
      return material;
    } catch (error) {
      console.error('Failed to create gradient material:', error);
      console.warn('Using basic material fallback for WebGPU compatibility');
      const material = new THREE.MeshBasicMaterial({
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0.8
      });
      this.materials.set('gradient', material);
      return material;
    }
  }

  createGlowMaterial(): THREE.ShaderMaterial | THREE.MeshBasicMaterial {
    if (this.useWebGPUCompatible) {
      console.warn('Using basic material fallback for WebGPU glow material');
      const material = new THREE.MeshBasicMaterial({
        color: 0x4dd0e1,
        transparent: true,
        opacity: 0.4
      });
      this.materials.set('glow', material);
      return material;
    }

    const material = new THREE.ShaderMaterial({
      vertexShader: ShaderSources.glow.vertex,
      fragmentShader: ShaderSources.glow.fragment,
      uniforms: {
        glowColor: { value: new THREE.Color(0x4dd0e1) },
        glowIntensity: { value: 0.4 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    this.materials.set('glow', material);
    return material;
  }

  createLogoGradientMaterial(color1: number, color2: number, name?: string): THREE.ShaderMaterial | THREE.MeshBasicMaterial {
    if (this.useWebGPUCompatible) {
      console.warn('Using basic material fallback for WebGPU logo gradient material');
      const material = new THREE.MeshBasicMaterial({
        color: color1,
        transparent: false
      });
      if (name) {
        this.materials.set(name, material);
      }
      return material;
    }

    const material = new THREE.ShaderMaterial({
      vertexShader: ShaderSources.logoGradient.vertex,
      fragmentShader: ShaderSources.logoGradient.fragment,
      uniforms: {
        color1: { value: new THREE.Color(color1) },
        color2: { value: new THREE.Color(color2) },
        time: { value: 1 },
        gradientDirection: { value: 0.7 },
      },
    });

    if (name) {
      this.materials.set(name, material);
    }
    
    return material;
  }

  createGradientBackgroundMaterial(): THREE.ShaderMaterial | THREE.MeshBasicMaterial {
    // For WebGL, we can reuse the existing gradient material or create a simpler version
    console.log('Creating WebGL gradient background material');
    
    if (this.useWebGPUCompatible) {
      console.warn('Using basic material fallback for WebGL gradient background');
      const material = new THREE.MeshBasicMaterial({
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0.8
      });
      this.materials.set('gradientBackground', material);
      return material;
    }

    // Use a simpler gradient for background
    try {
      const material = new THREE.ShaderMaterial({
        vertexShader: ShaderSources.gradient.vertex,
        fragmentShader: ShaderSources.gradient.fragment,
        uniforms: {
          color1: { value: new THREE.Color(0x1a1a2e) },
          color2: { value: new THREE.Color(0x16213e) },
          accentColor1: { value: new THREE.Color(0x41d1ff) },
          accentColor2: { value: new THREE.Color(0xbd34fe) },
          radialPos1: { value: new THREE.Vector2(0.5, 0.5) },
          radialPos2: { value: new THREE.Vector2(0.5, 0.5) },
          time: { value: 0 },
          pulseIntensity: { value: 0.3 },
        },
      });

      this.materials.set('gradientBackground', material);
      return material;
    } catch (error) {
      console.error('Failed to create WebGL gradient background material:', error);
      const material = new THREE.MeshBasicMaterial({
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0.8
      });
      this.materials.set('gradientBackground', material);
      return material;
    }
  }

  getMaterial(name: string): THREE.ShaderMaterial | undefined {
    return this.materials.get(name);
  }

  updateMaterialUniforms(name: string, uniforms: MaterialUniforms): void {
    const material = this.materials.get(name);
    if (material) {
      Object.keys(uniforms).forEach(key => {
        if (material.uniforms[key]) {
          material.uniforms[key].value = uniforms[key].value;
        }
      });
    }
  }

  dispose(): void {
    this.materials.forEach(material => {
      material.dispose();
    });
    this.materials.clear();
  }
}
