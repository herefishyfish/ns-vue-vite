import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { IMaterialManager } from "../materials/IMaterialManager";

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private materialManager: IMaterialManager;
  
  private gradientPlane: THREE.Mesh | null = null;
  private viteLogo: THREE.Mesh | null = null;
  private logoGlow: THREE.Mesh | null = null;
  private dirLight: THREE.DirectionalLight | null = null;
  private ambLight: THREE.AmbientLight | null = null;

  constructor(materialManager: IMaterialManager) {
    this.scene = new THREE.Scene();
    this.materialManager = materialManager;
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.camera.position.z = 5;
  }

  async initialize(canvasWidth: number, canvasHeight: number): Promise<void> {
    this.camera.aspect = canvasWidth / canvasHeight;
    this.camera.updateProjectionMatrix();

    this.setupBackgroundGradient();

    this.setupLighting();

    // this.setupGlowEffect();

    await this.loadViteLogo();
  }

  private setupBackgroundGradient(): void {
    const gradientMaterial = this.materialManager.createGradientMaterial();
    
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    this.gradientPlane = new THREE.Mesh(planeGeometry, gradientMaterial);
    this.gradientPlane.position.z = -10;
    this.scene.add(this.gradientPlane);
  }

  private setupLighting(): void {
    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.dirLight.position.set(30, 60, 30);
    this.scene.add(this.dirLight);

    this.ambLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambLight);
  }

  private setupGlowEffect(): void {
    const glowMaterial = this.materialManager.createGlowMaterial();
    const glowGeometry = new THREE.PlaneGeometry(4, 4);
    this.logoGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(this.logoGlow);
  }

  private async loadViteLogo(): Promise<void> {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      
      loader.load(
        "~/assets/vite.glb",
        (gltf: any) => {
          this.viteLogo = gltf.scene;

          const logoGradientMaterial1 = this.materialManager.createLogoGradientMaterial(
            0xbd34fe, 
            0x41d1ff, 
            'logoGradient1'
          );
          const logoGradientMaterial2 = this.materialManager.createLogoGradientMaterial(
            0xffdd35, 
            0xffa800, 
            'logoGradient2'
          );

          let meshIndex = 0;
          this.viteLogo!.traverse((child: any) => {
            if (child.isMesh) {
              console.log(
                "Mesh found:",
                child.name,
                "Material:",
                child.material?.name,
                "Index:",
                meshIndex
              );

              if (meshIndex % 2 === 0) {
                child.material = logoGradientMaterial1.clone();
                console.log("Applied blue-purple gradient to mesh", meshIndex);
              } else {
                child.material = logoGradientMaterial2.clone();
                console.log("Applied yellow-orange gradient to mesh", meshIndex);
              }

              meshIndex++;
            }
          });

          this.scene.add(this.viteLogo!);
          resolve();
        },
        (progress) => {
          console.log("Loading progress:", progress);
        },
        (error) => {
          console.error("Error loading GLTF:", error);
          reject(error);
        }
      );
    });
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getViteLogo(): THREE.Mesh | null {
    return this.viteLogo;
  }

  getLogoGlow(): THREE.Mesh | null {
    return this.logoGlow;
  }

  updateCameraAspect(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });

    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }
}
