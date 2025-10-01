<template>
  <StackLayout class="p-5 items-center align-middle justify-center">
    <Label ref="title" class="text-4xl font-bold text-white text-center mb-2" textWrap="true" @loaded="onLoaded">Vite 💖 NativeScript</Label>
    <Label ref="subtitle" class="text-2xl text-gray-400 text-center mb-5" textWrap="true">Lightning Fast Mobile Development</Label>
    <Label ref="description" class="text-base text-gray-300 text-center mb-10 leading-6" textWrap="true">The power of Vite's instant dev server now supercharges NativeScript development. Build native mobile apps with the speed you've always wanted.</Label>
  </StackLayout>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'nativescript-vue';
import { Animation, Label, LoadEventData } from '@nativescript/core';
import { applyGradient } from '../gradient-text';

// Slide 1: Vite + NativeScript Introduction
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
const description = ref<any>(null);
const featureHighlights = ref<any>(null);

const onLoaded = (args: LoadEventData) => {
  const label = args.object as Label;
  applyGradient(label, ['#41d1ff', '#bd34fe']);
};

// Set initial state when component mounts
const setInitialState = () => {
  nextTick(() => {
    if (title.value) {
      const element = title.value.nativeView;
      element.opacity = 0;
      element.translateY = -20;
    }
    
    if (subtitle.value) {
      const element = subtitle.value.nativeView;
      element.opacity = 0;
      element.translateY = 30;
    }
    
    if (description.value) {
      const element = description.value.nativeView;
      element.opacity = 0;
      element.translateY = 20;
    }
    
    if (featureHighlights.value) {
      const element = featureHighlights.value.nativeView;
      element.opacity = 0;
      element.translateY = 40;
      element.scaleX = 0.8;
      element.scaleY = 0.8;
    }
  });
};

// Auto-trigger animations on mount for Slide 1 (entry point)
const autoTriggerAnimations = () => {
  if (!animationsTriggered.value) {
    setTimeout(() => {
      triggerAnimations();
      animationsTriggered.value = true;
    }, 300); // Small delay to ensure elements are mounted
  }
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

// Set initial state when mounted and auto-trigger animations
watch([title, subtitle, description, featureHighlights], () => {
  if (!animationsTriggered.value) {
    setInitialState();
    autoTriggerAnimations();
  }
}, { immediate: true });

const triggerAnimations = async () => {
  console.log('Triggering Slide 1 animations');
  
  await nextTick();
  
  // Animate title with smooth fade in from above
  if (title.value) {
    const titleElement = title.value.nativeView;
    
    const titleAnimation = new Animation([{
      target: titleElement,
      opacity: 1,
      translate: { x: 0, y: 0 },
      duration: 200,
      curve: "easeInOut"
    }]);
    
    titleAnimation.play();
  }
  
  // Animate subtitle
  if (subtitle.value) {
    const subtitleElement = subtitle.value.nativeView;
    
    setTimeout(() => {
      const subtitleAnimation = new Animation([{
        target: subtitleElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        duration: 700,
        curve: "easeOut"
      }]);
      
      subtitleAnimation.play();
    }, 200);
  }
  
  // Animate description
  if (description.value) {
    const descElement = description.value.nativeView;
    
    setTimeout(() => {
      const descAnimation = new Animation([{
        target: descElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        duration: 700,
        curve: "easeOut"
      }]);
      
      descAnimation.play();
    }, 400);
  }
  
  // Animate feature highlights with staggered entrance
  if (featureHighlights.value) {
    const highlightsElement = featureHighlights.value.nativeView;
    
    setTimeout(() => {
      const highlightsAnimation = new Animation([{
        target: highlightsElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        duration: 1000,
        curve: "easeInOut"
      }]);
      
      highlightsAnimation.play();
    }, 600);
  }
};
</script>

<style scoped>
/* Custom styles only for non-Tailwind elements */
</style>
