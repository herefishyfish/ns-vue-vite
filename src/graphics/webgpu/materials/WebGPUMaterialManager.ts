import * as THREE from "@nativescript/canvas-three";
// @ts-ignore
const { NodeMaterial, Material, Color, Vector2, AdditiveBlending, NormalBlending } = require("three/webgpu");
import { IMaterialManager } from "~/graphics/materials/IMaterialManager";
// @ts-ignore
const { 
  mix, 
  distance, 
  smoothstep, 
  pow, 
  sin, 
  max,
  length,
  vec2,
  vec3,
  vec4,
  uniform,
  uv,
  sign,
  abs,
  Fn,
  float,
  color
} = require('three/tsl');

export class WebGPUMaterialManager implements IMaterialManager {
  private materials: Map<string, any> = new Map();

  createGradientMaterial(): any {
    try {
      // Uniforms matching WGSL gradient shader - use simpler approach first
      const color1Uniform = uniform(vec3(0.102, 0.102, 0.180)); // 0x1a1a2e as vec3
      const color2Uniform = uniform(vec3(0.086, 0.129, 0.243)); // 0x16213e as vec3
      const accentColor1Uniform = uniform(vec3(0.255, 0.820, 1.0)); // 0x41d1ff as vec3
      const accentColor2Uniform = uniform(vec3(0.741, 0.204, 0.996)); // 0xbd34fe as vec3
      const radialPos1Uniform = uniform(vec2(0.3, 0.7));
      const radialPos2Uniform = uniform(vec2(0.8, 0.2));
      const timeUniform = uniform(float(0));
      const pulseIntensityUniform = uniform(float(0.4));

      // Simplified TSL equivalent of WGSL gradient shader - focus on making radials visible
      const gradientShader = Fn(() => {
        const uvCoord = uv();
        
        // Base linear gradient - simplified to just length(uv) since subtracting zero is redundant
        const baseColor = mix(color1Uniform, color2Uniform, length(uvCoord));
        
        // Animated pulse effect - WGSL: sin(uniforms.time * 0.001) * 0.15 + 0.85
        const pulse = sin(timeUniform.mul(0.001)).mul(0.15).add(0.85);
        
        // First radial gradient - make more visible for debugging
        const dist1 = distance(uvCoord, radialPos1Uniform);
        const radial1 = float(1.0).sub(smoothstep(0.0, float(0.6).mul(pulse), dist1));
        const radialPowered1 = pow(radial1, 2.0);
        
        // Second radial gradient - make more visible for debugging  
        const dist2 = distance(uvCoord, radialPos2Uniform);
        const radial2 = float(1.0).sub(smoothstep(0.0, float(0.6).mul(pulse), dist2));
        const radialPowered2 = pow(radial2, 2.0);
        
        // Start with base color
        let finalColor = baseColor;
        
        // Mix in accent colors based on radial gradients
        finalColor = mix(finalColor, accentColor1Uniform, radialPowered1.mul(pulseIntensityUniform));
        finalColor = mix(finalColor, accentColor2Uniform, radialPowered2.mul(pulseIntensityUniform));
        
        // Add additional glow effect
        finalColor = finalColor.add(accentColor1Uniform.mul(radialPowered1).mul(pulseIntensityUniform).mul(0.3));
        finalColor = finalColor.add(accentColor2Uniform.mul(radialPowered2).mul(pulseIntensityUniform).mul(0.3));
        
        return vec4(finalColor, 1.0);
      })();

      const material = new NodeMaterial();
      material.colorNode = gradientShader;
      
      // Store uniforms for later updates - matching WGSL uniform names
      (material as any).uniforms = {
        color1: color1Uniform,
        color2: color2Uniform,
        accentColor1: accentColor1Uniform,
        accentColor2: accentColor2Uniform,
        radialPos1: radialPos1Uniform,
        radialPos2: radialPos2Uniform,
        time: timeUniform,
        pulseIntensity: pulseIntensityUniform
      };
      
      console.log('TSL material created with stored uniforms:', Object.keys((material as any).uniforms));
      
      this.materials.set('gradient', material);
      console.log('Successfully created WebGPU gradient material with WGSL-equivalent TSL');
      return material;
    } catch (error) {
      console.warn('Failed to create WebGPU TSL material, falling back to basic material:', error);
      
      // Fallback to basic material
      console.log('Using basic material fallback for gradient');
      const fallbackMaterial = new NodeMaterial();
      fallbackMaterial.colorNode = color(0x7c3aed);
      this.materials.set('gradient', fallbackMaterial);
      return fallbackMaterial;
    }
  }

  createGlowMaterial(): any {
    console.log('Creating WebGPU glow material with TSL');
    
    try {
      const glowColorUniform = uniform(color(0x4dd0e1));
      const glowIntensityUniform = uniform(float(0.6));

      // Create the glow shader using TSL
      const glowShader = Fn(() => {
        const uvCoord = uv();
        const center = vec2(0.5, 0.5);
        const dist = distance(uvCoord, center);
        
        const glow = float(1.0).sub(smoothstep(0.48, 0.52, dist));
        const glowPow = pow(glow, 8.0);
        
        const core = float(1.0).sub(smoothstep(0.0, 0.47, dist));
        const corePow = pow(core, 4.0);
        
        const finalGlow = max(glowPow.mul(0.6), corePow.mul(0.3));
        
        return vec4(glowColorUniform, finalGlow.mul(glowIntensityUniform));
      })();

      const material = new NodeMaterial();
      material.colorNode = glowShader;
      material.transparent = true;
      material.blending = AdditiveBlending;
      
      // Store uniforms for later updates
      (material as any).uniforms = {
        glowColor: glowColorUniform,
        glowIntensity: glowIntensityUniform
      };
      
      this.materials.set('glow', material);
      console.log('Successfully created WebGPU glow material with TSL');
      return material;
    } catch (error) {
      console.warn('Failed to create WebGPU TSL glow material, falling back to basic material:', error);
      
      // Fallback to basic material
      console.log('Using basic material fallback for glow');
      const fallbackMaterial = new NodeMaterial();
      fallbackMaterial.colorNode = color(0x4dd0e1);
      fallbackMaterial.transparent = true;
      fallbackMaterial.blending = AdditiveBlending;
      this.materials.set('glow', fallbackMaterial);
      return fallbackMaterial;
    }
  }

  createLogoGradientMaterial(color1: number, color2: number, name?: string): any {
    console.log('Creating WebGPU logo gradient material with TSL');
    
    try {
      const color1Uniform = uniform(color(color1));
      const color2Uniform = uniform(color(color2));
      const timeUniform = uniform(float(0));
      const gradientDirectionUniform = uniform(float(0.7));

      // Create the logo gradient shader using TSL
      const logoGradientShader = Fn(() => {
        const uvCoord = uv();
        
        const gradient = mix(uvCoord.y, uvCoord.x, gradientDirectionUniform);
        const gradientSmooth = smoothstep(0.4, 0.8, gradient);
        const wave = sin(timeUniform.mul(0.002).add(gradientSmooth.mul(6.28318))).mul(0.1).add(0.9);
        const finalColor = mix(color1Uniform, color2Uniform, gradientSmooth.mul(wave));
        
        return vec4(finalColor, 1.0);
      })();

      const material = new NodeMaterial();
      material.colorNode = logoGradientShader;
      
      // Store uniforms for later updates
      (material as any).uniforms = {
        color1: color1Uniform,
        color2: color2Uniform,
        time: timeUniform,
        gradientDirection: gradientDirectionUniform
      };
      
      if (name) {
        this.materials.set(name, material);
      }
      console.log('Successfully created WebGPU logo gradient material with TSL');
      return material;
    } catch (error) {
      console.warn('Failed to create WebGPU TSL logo gradient material, falling back to basic material:', error);
      
      // Fallback to basic material
      console.log('Using basic material fallback for logo gradient');
      const fallbackMaterial = new NodeMaterial();
      fallbackMaterial.colorNode = color(color1);
      if (name) {
        this.materials.set(name, fallbackMaterial);
      }
      return fallbackMaterial;
    }
  }

  createGradientBackgroundMaterial(): any {
    console.log('Creating WebGPU gradient background material with TSL (WGSL equivalent)');
    
    try {
      // Create uniforms that match the WGSL gradient shader
      const timeUniform = uniform(float(0));
      const centerUniform = uniform(vec2(0.5, 0.5));
      const radiusUniform = uniform(float(0.6));
      const color1Uniform = uniform(vec3(0.2, 0.4, 1.0)); // Blue
      const color2Uniform = uniform(vec3(1.0, 0.3, 0.8)); // Pink
      const color3Uniform = uniform(vec3(0.1, 0.8, 0.4)); // Green

      const gradientShader = Fn(() => {
        const uvCoord = uv();
        
        const dist = distance(uvCoord, centerUniform);
        const pulse = sin(timeUniform.mul(0.001)).mul(0.1).add(1.0);
        const normalizedDist = dist.div(radiusUniform.mul(pulse));
        const gradient1 = smoothstep(0.0, 0.5, normalizedDist);
        const gradient2 = smoothstep(0.3, 1.0, normalizedDist);
        const innerColor = mix(color1Uniform, color2Uniform, gradient1);
        const finalColor = mix(innerColor, color3Uniform, gradient2);

        return vec4(finalColor, 1.0);
      })();

      const material = new NodeMaterial();
      material.colorNode = gradientShader;

      (material as any).uniforms = {
        time: timeUniform,
        center: centerUniform,
        radius: radiusUniform,
        color1: color1Uniform,
        color2: color2Uniform,
        color3: color3Uniform
      };
      
      this.materials.set('gradientBackground', material);
      console.log('Successfully created WGSL-equivalent TSL gradient background material');
      return material;
    } catch (error) {
      console.warn('Failed to create TSL gradient background material, falling back to basic:', error);
      
      // Fallback to basic radial gradient
      const fallbackShader = Fn(() => {
        const uvCoord = uv();
        const center = vec2(0.5, 0.5);
        const dist = distance(uvCoord, center);
        const gradient = smoothstep(0.0, 0.7, dist);
        const finalColor = mix(
          vec3(0.0, 0.5, 1.0), // Blue center
          vec3(0.2, 0.0, 0.4), // Dark purple edge
          gradient
        );
        return vec4(finalColor, 1.0);
      })();
      
      const fallbackMaterial = new NodeMaterial();
      fallbackMaterial.colorNode = fallbackShader;
      this.materials.set('gradientBackground', fallbackMaterial);
      return fallbackMaterial;
    }
  }

  getMaterial(name: string): any | undefined {
    return this.materials.get(name);
  }

  updateMaterialUniforms(name: string, uniforms: Record<string, any>): void {
    const material = this.materials.get(name);
    
    if (material && (material as any).uniforms) {
      const materialUniforms = (material as any).uniforms;
      
      Object.keys(uniforms).forEach(key => {
        if (materialUniforms[key]) {
          if (uniforms[key] && uniforms[key].value !== undefined) {
            materialUniforms[key].value = uniforms[key].value;
          } else {
            materialUniforms[key].value = uniforms[key];
          }
        } else if (name === 'gradient' && (key === 'radialPos1' || key === 'radialPos2' || key === 'pulseIntensity')) {
          console.warn(`  Uniform '${key}' not found in gradient material`);
        }
      });
    } else if (name === 'gradient') {
      console.warn(`WebGPUMaterialManager: Gradient material not found or has no uniforms`);
    }
  }

  dispose(): void {
    this.materials.forEach(material => {
      if (material.dispose) {
        material.dispose();
      }
    });
    this.materials.clear();
  }
}
