import * as THREE from "three";
import { AnimationState, animationStates } from "./AnimationStates";
import { lerp, lerpColor, lerpRgbaColor, parseRgbaColor, rgbaToHex } from "./AnimationUtils";
import { IMaterialManager } from "../materials/IMaterialManager";

export class AnimationController {
  private currentTime = 0;
  private animationId: number | null = null;
  private currentState: AnimationState;
  private materialManager: IMaterialManager;

  private viteLogo: THREE.Mesh | null = null;
  private logoGlow: THREE.Mesh | null = null;
  private camera: THREE.Camera | null = null;

  constructor(materialManager: IMaterialManager) {
    this.materialManager = materialManager;
    this.currentState = animationStates[0];
  }

  setSceneObjects(viteLogo: THREE.Mesh, logoGlow: THREE.Mesh | null, camera: THREE.Camera): void {
    this.viteLogo = viteLogo;
    this.logoGlow = logoGlow;
    this.camera = camera;
    console.log('AnimationController: Scene objects set', {
      viteLogo: !!viteLogo,
      logoGlow: !!logoGlow,
      camera: !!camera,
      viteLogoType: viteLogo?.type,
      viteLogoPosition: viteLogo?.position
    });
  }

  interpolateStates(progress: number): void {
    const adjustedProgress = progress + 1;
    const clampedProgress = Math.max(
      0,
      Math.min(animationStates.length - 1, adjustedProgress)
    );

    const stateIndex = Math.floor(clampedProgress);
    const nextStateIndex =
      stateIndex + 1 < animationStates.length ? stateIndex + 1 : stateIndex;
    const lerpFactor = clampedProgress - stateIndex;

    const state1 = animationStates[stateIndex];
    const state2 = animationStates[nextStateIndex];

    if (this.viteLogo) {
      this.viteLogo.rotation.x = THREE.MathUtils.lerp(
        state1.rotation.x,
        state2.rotation.x,
        lerpFactor
      );
      this.viteLogo.rotation.y = THREE.MathUtils.lerp(
        state1.rotation.y,
        state2.rotation.y,
        lerpFactor
      );
      this.viteLogo.rotation.z = THREE.MathUtils.lerp(
        state1.rotation.z,
        state2.rotation.z,
        lerpFactor
      );

      this.viteLogo.scale.x = THREE.MathUtils.lerp(
        state1.scale,
        state2.scale,
        lerpFactor
      );
      this.viteLogo.scale.y = THREE.MathUtils.lerp(
        state1.scale,
        state2.scale,
        lerpFactor
      );
      this.viteLogo.scale.z = THREE.MathUtils.lerp(
        state1.scale,
        state2.scale,
        lerpFactor
      );

      const baseY = THREE.MathUtils.lerp(
        state1.position.y,
        state2.position.y,
        lerpFactor
      );

      this.viteLogo.position.x = THREE.MathUtils.lerp(
        state1.position.x,
        state2.position.x,
        lerpFactor
      );
      this.viteLogo.position.y = baseY;  // Base Y position, vertical offset will be applied in updateMaterialUniforms
      this.viteLogo.position.z = THREE.MathUtils.lerp(
        state1.position.z,
        state2.position.z,
        lerpFactor
      );
      
      // Store the base Y position for the animation loop
      this.viteLogo.userData = this.viteLogo.userData || {};
      this.viteLogo.userData.baseY = baseY;
    }

    if (this.logoGlow && this.viteLogo && this.camera) {
      this.logoGlow.position.copy(this.viteLogo.position);
      this.logoGlow.position.z -= 0.2;

      const glowScale = this.viteLogo.scale.x * 0.95;
      this.logoGlow.scale.set(glowScale, glowScale, 1);

      this.logoGlow.lookAt(this.camera.position);
    }

    this.currentState = {
      rotation: state1.rotation,
      scale: state1.scale,
      position: state1.position,
      baseColor1: lerpColor(state1.baseColor1, state2.baseColor1, lerpFactor),
      baseColor2: lerpColor(state1.baseColor2, state2.baseColor2, lerpFactor),
      accentColor1: lerpRgbaColor(
        state1.accentColor1,
        state2.accentColor1,
        lerpFactor
      ),
      accentColor2: lerpRgbaColor(
        state1.accentColor2,
        state2.accentColor2,
        lerpFactor
      ),
      pulseIntensity: lerp(
        state1.pulseIntensity,
        state2.pulseIntensity,
        lerpFactor
      ),
      radialPositions: {
        r1: {
          x: lerp(
            state1.radialPositions.r1.x,
            state2.radialPositions.r1.x,
            lerpFactor
          ),
          y: lerp(
            state1.radialPositions.r1.y,
            state2.radialPositions.r1.y,
            lerpFactor
          ),
        },
        r2: {
          x: lerp(
            state1.radialPositions.r2.x,
            state2.radialPositions.r2.x,
            lerpFactor
          ),
          y: lerp(
            state1.radialPositions.r2.y,
            state2.radialPositions.r2.y,
            lerpFactor
          ),
        },
      },
    };
  }

  private parseRgbaColor(rgbaString: string): {r: number, g: number, b: number, a: number} {
    const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      return {
        r: parseInt(match[1]) / 255,
        g: parseInt(match[2]) / 255,
        b: parseInt(match[3]) / 255,
        a: match[4] ? parseFloat(match[4]) : 1
      };
    }
    return { r: 1, g: 1, b: 1, a: 1 };
  }

  updateMaterialUniforms(): void {
    if (this.viteLogo) {
      const verticalOffset = Math.sin(this.currentTime * 0.001) * 0.1;
      const baseY = this.viteLogo.userData?.baseY ?? this.viteLogo.position.y;
      this.viteLogo.position.y = baseY + verticalOffset;
    }

    const currentState = this.getCurrentState();

    const gradientTimeUniform = this.materialManager.getMaterial('gradient_timeUniform');
    if (gradientTimeUniform) {
      gradientTimeUniform.value = this.currentTime;
    }

    const baseColor1Uniform = this.materialManager.getMaterial('gradient_baseColor1Uniform');
    if (baseColor1Uniform && currentState.baseColor1) {
      baseColor1Uniform.value.set(currentState.baseColor1);
    }

    const baseColor2Uniform = this.materialManager.getMaterial('gradient_baseColor2Uniform');
    if (baseColor2Uniform && currentState.baseColor2) {
      baseColor2Uniform.value.set(currentState.baseColor2);
    }

    const accentColor1Uniform = this.materialManager.getMaterial('gradient_accentColor1Uniform');
    if (accentColor1Uniform && currentState.accentColor1) {
      const rgba1 = this.parseRgbaColor(currentState.accentColor1);
      accentColor1Uniform.value.setRGB(rgba1.r, rgba1.g, rgba1.b);
    }

    const accentColor2Uniform = this.materialManager.getMaterial('gradient_accentColor2Uniform');
    if (accentColor2Uniform && currentState.accentColor2) {
      const rgba2 = this.parseRgbaColor(currentState.accentColor2);
      accentColor2Uniform.value.setRGB(rgba2.r, rgba2.g, rgba2.b);
    }

    const pulseIntensityUniform = this.materialManager.getMaterial('gradient_pulseIntensityUniform');
    if (pulseIntensityUniform && currentState.pulseIntensity !== undefined) {
      pulseIntensityUniform.value = currentState.pulseIntensity;
    }

    const radial1PosUniform = this.materialManager.getMaterial('gradient_radial1PosUniform');
    if (radial1PosUniform && currentState.radialPositions?.r1) {
      radial1PosUniform.value.set(currentState.radialPositions.r1.x, currentState.radialPositions.r1.y);
    }

    const radial2PosUniform = this.materialManager.getMaterial('gradient_radial2PosUniform');
    if (radial2PosUniform && currentState.radialPositions?.r2) {
      radial2PosUniform.value.set(currentState.radialPositions.r2.x, currentState.radialPositions.r2.y);
    }

    const logoGradientMaterial1 = this.materialManager.getMaterial('logoGradient1');
    if (logoGradientMaterial1) {
      this.materialManager.updateMaterialUniforms('logoGradient1', {
        time: { value: this.currentTime }
      });
    }

    const logoGradientMaterial2 = this.materialManager.getMaterial('logoGradient2');
    if (logoGradientMaterial2) {
      this.materialManager.updateMaterialUniforms('logoGradient2', {
        time: { value: this.currentTime }
      });
    }
  }

  start(renderCallback: () => void): void {
    const animate = () => {
      this.currentTime = performance.now();
      this.updateMaterialUniforms();
      renderCallback();
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  getCurrentState(): AnimationState {
    return { ...this.currentState };
  }
}
