import * as THREE from "@nativescript/canvas-three";
// @ts-ignore
const { WebGPURenderer: ThreeWebGPURenderer, Scene, Camera } = require("three/webgpu");
import { IRenderer } from "../../renderers/IRenderer";
import { Screen } from "@nativescript/core";
import { Canvas } from "@nativescript/canvas";

export class WebGPURenderer implements IRenderer {
  private renderer!: any;
  private canvas!: Canvas; // NativeScript Canvas element
  private context: any; // WebGPU context
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  initialize(canvas: Canvas) {
    this.canvas = canvas;
    
    const height = canvas.clientHeight + 60;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    
    try {
      // Try WebGPU renderer first
      console.log('Attempting to create WebGPURenderer');
      this.renderer = new ThreeWebGPURenderer({ canvas: this.canvas as never, antialias: true });
      console.log('WebGPURenderer created successfully:', this.renderer);
      
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(canvas.clientWidth, height, false);
      
      // Start async initialization but don't wait for it
      this.initPromise = this.initializeAsync();
    } catch (error) {
      console.warn('Failed to create WebGPU renderer:', error);
    }

    return {
      context: this.context,
      width: canvas.width,
      height: canvas.height,
    };
  }

  private async initializeAsync(): Promise<void> {
    try {
      console.log('Initializing WebGPU backend...');
      await this.renderer.init();
      console.log('WebGPU backend initialized successfully');
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize WebGPU backend:', error);
      this.isInitialized = false;
    }
  }

  render(scene: any, camera: any): void {
    if (this.renderer) {
      if (this.isInitialized) {
        this.renderer.render(scene, camera);
      } else {
        // If not initialized yet, try to wait for initialization
        if (this.initPromise) {
          this.initPromise.then(() => {
            if (this.isInitialized) {
              this.renderer.renderAsync(scene, camera).catch((error: any) => {
                console.warn('WebGPU render error:', error);
              });
            }
          }).catch((error) => {
            console.warn('Failed to initialize WebGPU before render:', error);
          });
        }
      }
    }
  }

  setSize(width: number, height: number): void {
    if (this.renderer && this.renderer.setSize) {
      this.renderer.setSize(width, height, false);
    }
  }

  dispose(): void {
    if (this.renderer && this.renderer.dispose) {
      this.renderer.dispose();
    }
  }

  getDevice(): any {
    return this.renderer?.device || null;
  }

  getContext(): any {
    return this.context;
  }

  getFormat(): any {
    // return this.renderer?.format || 'bgra8unorm';
  }

  getThreeRenderer(): any {
    return this.renderer;
  }
}
