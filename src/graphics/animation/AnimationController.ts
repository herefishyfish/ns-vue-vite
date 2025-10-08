import * as THREE from "three";
import { AnimationState, animationStates } from "./AnimationStates";
import { lerp, lerpColor, lerpRgbaColor, parseRgbaColor, rgbaToHex } from "./AnimationUtils";
import { IMaterialManager } from "../materials/IMaterialManager";

export class AnimationController {
  private currentTime = 0;
  private animationId: number | null = null;
  private currentState: AnimationState;
  private materialManager: IMaterialManager;

  // Scene objects that need animation
  private viteLogo: THREE.Mesh | null = null;
  private logoGlow: THREE.Mesh | null = null;
  private camera: THREE.Camera | null = null;

  constructor(materialManager: IMaterialManager) {
    this.materialManager = materialManager;
    this.currentState = animationStates[0];
  }

  setSceneObjects(viteLogo: THREE.Mesh, logoGlow: THREE.Mesh, camera: THREE.Camera): void {
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

  updateMaterialUniforms(): void {
    if (this.viteLogo) {
      const verticalOffset = Math.sin(this.currentTime * 0.001) * 0.1;
      const baseY = this.viteLogo.userData?.baseY ?? this.viteLogo.position.y;
      this.viteLogo.position.y = baseY + verticalOffset;
    }

    // Update gradient background material if it exists
    // const gradientBackgroundMaterial = this.materialManager.getMaterial('gradientBackground');
    // if (gradientBackgroundMaterial) {
    //   this.materialManager.updateMaterialUniforms('gradientBackground', {
    //     time: { value: this.currentTime }
    //   });
    // }

    const gradientMaterial = this.materialManager.getMaterial('gradient');
    if (!gradientMaterial) return;

    this.materialManager.updateMaterialUniforms('gradient', {
      color1: { value: new THREE.Color(parseInt(this.currentState.baseColor1.replace("#", "0x"))) },
      color2: { value: new THREE.Color(parseInt(this.currentState.baseColor2.replace("#", "0x"))) },
      time: { value: this.currentTime }
    });

    const hasComplexUniforms = true;

    if (hasComplexUniforms) {
      const radialPos1Vector = new THREE.Vector2(this.currentState.radialPositions.r1.x, this.currentState.radialPositions.r1.y);
      const radialPos2Vector = new THREE.Vector2(this.currentState.radialPositions.r2.x, this.currentState.radialPositions.r2.y);
      
      this.materialManager.updateMaterialUniforms('gradient', {
        pulseIntensity: { value: this.currentState.pulseIntensity },
        radialPos1: { value: radialPos1Vector },
        radialPos2: { value: radialPos2Vector },
      });
    }

    const accentColor1 = parseRgbaColor(this.currentState.accentColor1);
    const accentColor2 = parseRgbaColor(this.currentState.accentColor2);

    this.materialManager.updateMaterialUniforms('gradient', {
      accentColor1: { value: new THREE.Color(rgbaToHex(accentColor1.r, accentColor1.g, accentColor1.b)) },
      accentColor2: { value: new THREE.Color(rgbaToHex(accentColor2.r, accentColor2.g, accentColor2.b)) },
    });

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
