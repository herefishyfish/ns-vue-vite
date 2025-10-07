<script lang="ts" setup>
import { ref, watch, nextTick } from 'nativescript-vue';
import { Animation } from '@nativescript/core';

// Slide 5: Get Started with NativeScript + Vite
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
const terminal = ref<any>(null);
const stats = ref<any>(null);

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
    
    if (terminal.value) {
      const element = terminal.value.nativeView;
      element.opacity = 0;
    }
    
    if (stats.value) {
      const element = stats.value.nativeView;
      element.opacity = 0;
      element.translateY = 50;
      element.scaleX = 0.8;
      element.scaleY = 0.8;
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
watch([title, subtitle, terminal, stats], () => {
  if (!animationsTriggered.value) {
    setInitialState();
  }
}, { immediate: true });

const triggerAnimations = async () => {
  console.log('Triggering Slide 5 animations');
  
  await nextTick();
  
  // Animate title
  if (title.value) {
    const titleElement = title.value.nativeView;
    
    const titleAnimation = new Animation([{
      target: titleElement,
      opacity: 1,
      translate: { x: 0, y: 0 },
      duration: 600,
      curve: "easeOut"
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
        duration: 600,
        curve: "easeOut"
      }]);
      
      subtitleAnimation.play();
    }, 200);
  }
  
  // Animate terminal with typewriter effect appearance
  if (terminal.value) {
    const terminalElement = terminal.value.nativeView;
    
    setTimeout(() => {
      const terminalAnimation = new Animation([{
        target: terminalElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        duration: 800,
        curve: "easeInOut"
      }]);
      
      terminalAnimation.play();
    }, 400);
  }
  
  // Animate stats with stagger effect
  if (stats.value) {
    const statsElement = stats.value.nativeView;
    
    setTimeout(() => {
      const statsAnimation = new Animation([{
        target: statsElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        duration: 800,
        curve: "easeInOut"
      }]);

      
      
      statsAnimation.play();
    }, 800);
  }
};
</script>

<template>
  <ScrollView class="p-5">
    <StackLayout verticalAlignment="center">
      <Label ref="title" class="text-3xl font-bold text-white text-center mb-2.5">Start Building Today</Label>
      <Label ref="subtitle" class="text-base text-gray-400 text-center mb-8">Create your first NativeScript app with Vite</Label>
      
      <StackLayout ref="terminal" class="bg-slate-900 rounded-lg border border-slate-600">
        <GridLayout class="bg-slate-800 p-4 w-full rounded-t-lg" columns="auto, auto, auto, *" rows="*">
          <Label colSpan="4" class="text-white text-xs text-center">Terminal</Label>
          <Label col="1" class="text-red-400 mr-1 text-xs">●</Label>
          <Label col="2" class="text-yellow-400 mr-1 text-xs">●</Label>
          <Label col="3" class="text-green-400 text-xs">●</Label>
        </GridLayout>
        
        <StackLayout class="p-4">
          <StackLayout class="mb-2.5" orientation="horizontal">
            <Label class="text-green-400 font-mono mr-1">$</Label>
            <Label class="text-white font-mono">npm create @nativescript/app@latest</Label>
          </StackLayout>
          
          <StackLayout class="mt-2.5">
            <Label class="text-gray-400 font-mono text-xs mb-1">✔ App name: my-mobile-app</Label>
            <Label class="text-gray-400 font-mono text-xs mb-1">✔ Template: Vue.js + Vite</Label>
            <Label class="text-gray-400 font-mono text-xs mb-1">✔ Platform: iOS & Android</Label>
            <Label class="text-green-400 font-mono text-xs">🚀 Your NativeScript + Vite app is ready!</Label>
          </StackLayout>
        </StackLayout>
      </StackLayout>
            
      <GridLayout ref="stats" class="mt-8" columns="*, *, *" rows="*">
        <StackLayout class="text-center p-4 m-1 info-card rounded-lg" row="0" col="0">
          <Label class="text-2xl font-bold text-center mb-1 text-[#41d1ff]">3s</Label>
          <Label class="text-xs text-gray-400 text-center" textWrap="true">Dev Server Start</Label>
        </StackLayout>
        
        <StackLayout class="text-center p-4 m-1 info-card rounded-lg" row="0" col="1">
          <Label class="text-2xl font-bold text-center mb-1 text-[#807ff0]">100%</Label>
          <Label class="text-xs text-gray-400 text-center" textWrap="true">Native Performance</Label>
        </StackLayout>
        
        <StackLayout class="text-center p-4 m-1 info-card rounded-lg" row="0" col="2">
          <Label class="text-2xl font-bold text-center mb-1 text-[#bd34fe]">∞</Label>
          <Label class="text-xs text-gray-400 text-center" textWrap="true">Possibilities</Label>
        </StackLayout>
      </GridLayout>

    </StackLayout>
  </ScrollView>
</template>

<style scoped>
</style>
