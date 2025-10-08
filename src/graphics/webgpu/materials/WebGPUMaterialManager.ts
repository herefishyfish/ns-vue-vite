import { IMaterialManager } from "~/graphics/materials/IMaterialManager";
// @ts-ignore
const {
  NodeMaterial,
  AdditiveBlending,
} = require("three/webgpu");
// @ts-ignore
const {
  mix,
  distance,
  smoothstep,
  pow,
  sin,
  max,
  vec2,
  vec3,
  vec4,
  uniform,
  uv,
  Fn,
  float,
  color,
} = require("three/tsl");

export class WebGPUMaterialManager implements IMaterialManager {
  private materials: Map<string, any> = new Map();

  createGradientMaterial(): any {
    try {
      console.log("Creating radial gradient material with view states");

      const timeUniform = uniform(float(0.0));
      const baseColor1Uniform = uniform(color(0x1f2937));
      const baseColor2Uniform = uniform(color(0x111827));
      const accentColor1Uniform = uniform(color(0x2980b9));
      const accentColor2Uniform = uniform(color(0x8e44ad));
      const pulseIntensityUniform = uniform(float(0.6));

      const radial1PosUniform = uniform(vec2(0.25, 0.25));
      const radial2PosUniform = uniform(vec2(0.75, 0.75));

      const radialGradient = Fn(() => {
        const time = timeUniform;
        const uvCoord = uv();
        const baseColor1 = baseColor1Uniform;
        const baseColor2 = baseColor2Uniform;
        const accentColor1 = accentColor1Uniform;
        const accentColor2 = accentColor2Uniform;
        const pulseIntensity = pulseIntensityUniform;
        const r1Pos = radial1PosUniform;
        const r2Pos = radial2PosUniform;

        const baseOscillation = sin(time.mul(0.001)).mul(0.5).add(0.5);
        const baseGradient = mix(baseColor1, baseColor2, baseOscillation);

        const dist1 = distance(uvCoord, r1Pos);
        const dist2 = distance(uvCoord, r2Pos);

        const pulse = sin(time.mul(0.001)).mul(0.15).add(0.85);
        const radialSize1 = float(0.6).mul(pulse);
        const radialSize2 = float(0.6).mul(pulse);

        let radial1Strength = float(1.0).sub(
          smoothstep(float(0.0), radialSize1, dist1)
        );
        radial1Strength = pow(radial1Strength, 2.0);

        let radial2Strength = float(1.0).sub(
          smoothstep(float(0.0), radialSize2, dist2)
        );
        radial2Strength = pow(radial2Strength, 2.0);

        let finalColor = baseGradient;
        finalColor = mix(
          finalColor,
          accentColor1,
          radial1Strength.mul(pulseIntensity)
        );
        finalColor = mix(
          finalColor,
          accentColor2,
          radial2Strength.mul(pulseIntensity)
        );

        finalColor = finalColor.add(
          accentColor1.mul(radial1Strength).mul(pulseIntensity).mul(0.3)
        );
        finalColor = finalColor.add(
          accentColor2.mul(radial2Strength).mul(pulseIntensity).mul(0.3)
        );

        return vec4(finalColor, 1.0);
      })();

      const material = new NodeMaterial();
      material.colorNode = radialGradient;

      this.materials.set("gradient", material);
      this.materials.set("gradient_timeUniform", timeUniform);
      this.materials.set("gradient_baseColor1Uniform", baseColor1Uniform);
      this.materials.set("gradient_baseColor2Uniform", baseColor2Uniform);
      this.materials.set("gradient_accentColor1Uniform", accentColor1Uniform);
      this.materials.set("gradient_accentColor2Uniform", accentColor2Uniform);
      this.materials.set(
        "gradient_pulseIntensityUniform",
        pulseIntensityUniform
      );
      this.materials.set("gradient_radial1PosUniform", radial1PosUniform);
      this.materials.set("gradient_radial2PosUniform", radial2PosUniform);

      return material;
    } catch (error) {
      console.warn(
        "Failed to create static TSL material, falling back to basic material:",
        error
      );
    }
  }

  createGlowMaterial(): any {
    console.log("Creating WebGPU glow material with TSL");

    try {
      const glowColorUniform = uniform(color(0x4dd0e1));
      const glowIntensityUniform = uniform(float(0.2));

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

      (material as any).uniforms = {
        glowColor: glowColorUniform,
        glowIntensity: glowIntensityUniform,
      };

      this.materials.set("glow", material);
      console.log("Successfully created WebGPU glow material with TSL");
      return material;
    } catch (error) {
      console.warn(
        "Failed to create WebGPU TSL glow material, falling back to basic material:",
        error
      );
    }
  }

  createLogoGradientMaterial(
    color1: number,
    color2: number,
    name?: string
  ): any {
    console.log("Creating WebGPU logo gradient material with TSL");

    try {
      const color1Uniform = uniform(color(color1));
      const color2Uniform = uniform(color(color2));
      const timeUniform = uniform(float(0));
      const gradientDirectionUniform = uniform(float(0.7));

      const logoGradientShader = Fn(() => {
        const uvCoord = uv();

        const gradient = mix(uvCoord.y, uvCoord.x, gradientDirectionUniform);
        const gradientSmooth = smoothstep(0.4, 0.8, gradient);
        const wave = sin(
          timeUniform.mul(0.002).add(gradientSmooth.mul(6.28318))
        )
          .mul(0.1)
          .add(0.9);
        const finalColor = mix(
          color1Uniform,
          color2Uniform,
          gradientSmooth.mul(wave)
        );

        return vec4(finalColor, 1.0);
      })();

      const material = new NodeMaterial();
      material.colorNode = logoGradientShader;

      (material as any).uniforms = {
        color1: color1Uniform,
        color2: color2Uniform,
        time: timeUniform,
        gradientDirection: gradientDirectionUniform,
      };

      if (name) {
        this.materials.set(name, material);
      }
      console.log(
        "Successfully created WebGPU logo gradient material with TSL"
      );
      return material;
    } catch (error) {
      console.warn(
        "Failed to create WebGPU TSL logo gradient material, falling back to basic material:",
        error
      );
    }
  }

  createGradientBackgroundMaterial(): any {
    console.log(
      "Creating WebGPU gradient background material with TSL (WGSL equivalent)"
    );

    try {
      const timeUniform = uniform(float(0));
      const centerUniform = uniform(vec2(0.5, 0.5));
      const radiusUniform = uniform(float(0.6));
      const color1Uniform = uniform(vec3(0.2, 0.4, 1.0));
      const color2Uniform = uniform(vec3(1.0, 0.3, 0.8));
      const color3Uniform = uniform(vec3(0.1, 0.8, 0.4));

      const gradientShader = Fn(() => {
        const uvCoord = uv();

        const dist = distance(uvCoord, centerUniform);
        const pulse = sin(timeUniform.mul(0.001)).mul(0.015).add(1.0);
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
        color3: color3Uniform,
      };

      this.materials.set("gradientBackground", material);
      console.log(
        "Successfully created WGSL-equivalent TSL gradient background material"
      );
      return material;
    } catch (error) {
      console.warn(
        "Failed to create TSL gradient background material, falling back to basic:",
        error
      );
    }
  }

  getMaterial(name: string): any | undefined {
    return this.materials.get(name);
  }

  updateMaterialUniforms(name: string, uniforms: Record<string, any>): void {
    const material = this.materials.get(name);

    if (material && (material as any).uniforms) {
      const materialUniforms = (material as any).uniforms;

      Object.keys(uniforms).forEach((key) => {
        if (materialUniforms[key]) {
          const newValue =
            uniforms[key] && uniforms[key].value !== undefined
              ? uniforms[key].value
              : uniforms[key];
          const oldValue = materialUniforms[key].value;
          materialUniforms[key].value = newValue;

          if (
            name === "gradient" &&
            (key === "radialPos1" ||
              key === "radialPos2" ||
              key === "pulseIntensity")
          ) {
            console.log(
              `  ${key}: ${JSON.stringify(oldValue)} -> ${JSON.stringify(
                newValue
              )}`
            );
          }
        } else if (
          name === "gradient" &&
          (key === "radialPos1" ||
            key === "radialPos2" ||
            key === "pulseIntensity")
        ) {
          console.warn(
            `  Uniform '${key}' not found in gradient material. Available uniforms:`,
            Object.keys(materialUniforms)
          );
        }
      });
    } else if (name === "gradient") {
      console.warn(
        `WebGPUMaterialManager: Gradient material not found or has no uniforms`
      );
    }
  }

  dispose(): void {
    this.materials.forEach((material) => {
      if (material.dispose) {
        material.dispose();
      }
    });
    this.materials.clear();
  }
}
