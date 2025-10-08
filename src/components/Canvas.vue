<script lang="ts" setup>
import { Canvas } from "@nativescript/canvas";
import { LoadEventData, Screen } from "@nativescript/core";
import { watch } from "nativescript-vue";
import { GraphicsController } from "../graphics/GraphicsController";

let canvas: Canvas;
let graphicsController: GraphicsController;

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  useWebGPU: {
    type: Boolean,
    default: true,
  },
});

watch(
  () => props.progress,
  (newValue) => {
    if (graphicsController) {
      graphicsController.updateProgress(newValue);
    }
  }
);

const onReady = async (args: LoadEventData) => {
  canvas = args.object as Canvas;

  canvas.width = canvas.clientWidth * Screen.mainScreen.scale;
  canvas.height = canvas.clientHeight * Screen.mainScreen.scale;
  canvas.ignoreTouchEvents = true;

  try {
    graphicsController = new GraphicsController();
    
    await graphicsController.initialize(canvas, props.useWebGPU);
    
    graphicsController.startAnimation(props.progress);
    
    console.log(`Graphics controller initialized successfully with ${props.useWebGPU ? 'WebGPU' : 'WebGL'}`);
  } catch (error) {
    console.error("Failed to initialize graphics:", error);
  }
};

const cleanup = () => {
  if (graphicsController) {
    graphicsController.dispose();
  }
};
</script>
<template>
  <Canvas @ready="onReady" />
</template>
