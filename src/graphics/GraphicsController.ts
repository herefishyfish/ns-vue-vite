import { IRenderer } from "./renderers/IRenderer";
import { WebGLFactory } from "./webgl";
import { WebGPUFactory } from "./webgpu";
import { IMaterialManager } from "./materials/IMaterialManager";
import { AnimationController } from "./animation/AnimationController";
import { SceneManager } from "./scene/SceneManager";
import { Canvas } from "@nativescript/canvas";

export class GraphicsController {
  private renderer!: IRenderer;
  private materialManager!: IMaterialManager;
  private animationController!: AnimationController;
  private sceneManager!: SceneManager;
  private isInitialized = false;
  private useWebGPU = false;

  async initialize(canvas: Canvas, useWebGPU: boolean = true): Promise<void> {
    try {
      this.useWebGPU = useWebGPU;
      
      // Create renderer and material manager based on preference
      if (useWebGPU) {
        this.renderer = WebGPUFactory.createRenderer();
        this.materialManager = WebGPUFactory.createMaterialManager();
      } else {
        this.renderer = WebGLFactory.createRenderer();
        this.materialManager = WebGLFactory.createMaterialManager();
      }
      
      // Initialize renderer first to get dimensions
      const { width, height } = await this.renderer.initialize(canvas);
      
      // Initialize animation controller and scene manager
      this.animationController = new AnimationController(this.materialManager);
      this.sceneManager = new SceneManager(this.materialManager);

      // Initialize scene
      await this.sceneManager.initialize(width, height);

      const viteLogo = this.sceneManager.getViteLogo();
      const logoGlow = this.sceneManager.getLogoGlow();
      const camera = this.sceneManager.getCamera();

      if (viteLogo && camera) {
        this.animationController.setSceneObjects(viteLogo, logoGlow, camera);
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize graphics controller:", error);
      throw error;
    }
  }

  startAnimation(progress: number): void {
    if (!this.isInitialized) {
      console.warn("Graphics controller not initialized");
      return;
    }

    this.animationController.start(() => {
      this.render();
    });

    this.updateProgress(progress);
  }

  updateProgress(progress: number): void {
    if (!this.isInitialized) return;
    
    this.animationController.interpolateStates(progress);
  }

  private render(): void {
    if (!this.isInitialized) return;

    const scene = this.sceneManager.getScene();
    const camera = this.sceneManager.getCamera();
    
    this.renderer.render(scene, camera);
  }

  setSize(width: number, height: number): void {
    if (!this.isInitialized) return;

    this.renderer.setSize(width, height);
    this.sceneManager.updateCameraAspect(width, height);
  }

  dispose(): void {
    this.animationController.stop();
    this.sceneManager.dispose();
    this.materialManager.dispose();
    this.renderer.dispose();
    this.isInitialized = false;
  }

  getRenderer(): IRenderer {
    return this.renderer;
  }

  getMaterialManager(): IMaterialManager {
    return this.materialManager;
  }

  getAnimationController(): AnimationController {
    return this.animationController;
  }

  getSceneManager(): SceneManager {
    return this.sceneManager;
  }
}
