<script lang="ts" setup>
import { ref, watch, nextTick } from 'nativescript-vue';
import { Animation } from '@nativescript/core';

// Slide 2: NativeScript + Vite Development Revolution
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  justActivated: {
    type: Boolean,
    default: false
  },
  shouldAnimate: {
    type: Boolean,
    default: false
  }
});

// Animation state - only animate once
const animationsTriggered = ref(false);

// Template refs
const title = ref<any>(null);
const subtitle = ref<any>(null);
const comparison = ref<any>(null);
const description = ref<any>(null);

// Set initial state when component mounts
const setInitialState = () => {
  nextTick(() => {
    if (title.value) {
      const element = title.value.nativeView;
      element.opacity = 0;
      element.translateY = -30;
    }
    
    if (subtitle.value) {
      const element = subtitle.value.nativeView;
      element.opacity = 0;
      element.translateY = -20;
    }
    
    if (comparison.value) {
      const element = comparison.value.nativeView;
      element.opacity = 0;
      element.translateY = 50;
      element.scaleX = 0.8;
      element.scaleY = 0.8;
    }
    
    if (description.value) {
      const element = description.value.nativeView;
      element.opacity = 0;
      element.translateY = 30;
    }
  });
};

// Watch for when slide should animate (at 0.8 threshold)
watch(() => props.shouldAnimate, (newValue) => {
  if (newValue && !animationsTriggered.value) {
    triggerAnimations();
    animationsTriggered.value = true;
  }
});

// Also watch for traditional activation (fallback)
watch(() => props.justActivated, (newValue) => {
  if (newValue && !animationsTriggered.value) {
    triggerAnimations();
    animationsTriggered.value = true;
  }
});

// Set initial state when mounted
watch([title, subtitle, comparison, description], () => {
  if (!animationsTriggered.value) {
    setInitialState();
  }
}, { immediate: true });

const triggerAnimations = async () => {
  console.log('Triggering Slide 2 animations');
  
  await nextTick();
  
  // Animate title
  if (title.value) {
    const titleElement = title.value.nativeView;
    
    setTimeout(() => {
      const titleAnimation = new Animation([{
        target: titleElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        duration: 600,
        curve: "easeOut"
      }]);
      
      titleAnimation.play();
    }, 200);
  }
  
  // Animate subtitle
  if (subtitle.value) {
    const subtitleElement = subtitle.value.nativeView;
    
    setTimeout(() => {
      const subtitleAnimation = new Animation([{
        target: subtitleElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        duration: 600,
        curve: "easeOut"
      }]);
      
      subtitleAnimation.play();
    }, 400);
  }
  
  // Animate comparison bars
  if (comparison.value) {
    const comparisonElement = comparison.value.nativeView;
    
    setTimeout(() => {
      const comparisonAnimation = new Animation([{
        target: comparisonElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        duration: 800,
        curve: "easeInOut"
      }]);
      
      comparisonAnimation.play();
    }, 600);
  }
  
  // Animate description
  if (description.value) {
    const descElement = description.value.nativeView;
    
    setTimeout(() => {
      const descAnimation = new Animation([{
        target: descElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        duration: 600,
        curve: "easeOut"
      }]);
      
      descAnimation.play();
    }, 1000);
  }
};
</script>

<template>
  <StackLayout class="p-5 items-center align-middle justify-center">
    <Label ref="title" class="text-3xl font-bold text-white text-center mb-2" textWrap="true">Development Revolution</Label>
    <Label ref="subtitle" class="text-xl text-gray-400 text-center mb-8">Native Mobile Meets Web Speed</Label>
    
    <StackLayout ref="comparison" class="my-8 w-full items-center">
      <StackLayout class="mb-4">
        <GridLayout class="h-20 text-center rounded-lg my-1 min-w-70 border-2 border-white border-opacity-20" columns="*, auto" rows="*">
          <ContentView class="rounded-md bg-red-400 bg-opacity-70" colSpan="2" rowSpan="1"></ContentView>
          <Label col="0" class="text-white font-bold">Traditional Mobile Build</Label>
          <Label col="1" class="text-white font-bold text-right">2-5min</Label>
        </GridLayout>
      </StackLayout>
      
      <StackLayout class="mb-4">
        <GridLayout class="h-20 text-center rounded-lg my-1 min-w-70 border-2 border-white border-opacity-20" columns="*, auto" rows="*">
          <ContentView class="rounded-md bg-green-400 bg-opacity-70" colSpan="2" rowSpan="1"></ContentView>
          <Label col="0" class="text-white font-bold">NativeScript + Vite</Label>
          <Label col="1" class="text-white font-bold text-right">~3s</Label>
        </GridLayout>
      </StackLayout>
    </StackLayout>
    
    <Label ref="description" class="text-sm text-gray-300 text-center leading-6 mt-5" textWrap="true">
      NativeScript now harnesses Vite's lightning-fast Hot Module Replacement for native mobile development. 
      See your changes instantly without rebuilding the entire app.
    </Label>
  </StackLayout>
</template>

<style scoped>
</style>
