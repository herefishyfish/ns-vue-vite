import * as THREE from "three";
import { IRenderer } from "../../renderers/IRenderer";
import { Canvas } from "@nativescript/canvas";

export class WebGLRenderer implements IRenderer {
  private renderer!: THREE.WebGLRenderer;

  initialize(canvas: Canvas) {
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = (canvas.clientHeight + 60) * window.devicePixelRatio;

    const context = canvas.getContext("webgl2");
    if (!context) {
      console.log("Failed to get WebGL context from canvas");
      return;
    }

    this.renderer = new THREE.WebGLRenderer({
      context: context,
      antialias: true,
    });

    this.setSize(canvas.width, canvas.height);

    return {
      context: context,
      width: canvas.width,
      height: canvas.height,
    }
  }

  render(scene: THREE.Scene, camera: THREE.Camera): void {
    if (this.renderer && scene && camera) {
      this.renderer.render(scene, camera);
    }
  }

  setSize(width: number, height: number): void {
    if (this.renderer) {
      this.renderer.setSize(width, height, false);
    }
  }

  dispose(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  getThreeRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }
}
