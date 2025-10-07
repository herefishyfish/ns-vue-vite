<template>
  <ScrollView class="p-5">
    <StackLayout verticalAlignment="center">
      <Label ref="mainTitle" class="text-3xl font-bold text-white text-center mb-4">Game-Changing Features</Label>
      <Label ref="description" class="text-base text-gray-300 text-center mb-8 leading-relaxed" textWrap="true">
        NativeScript's Vite integration brings web development speeds to native mobile app creation.
      </Label>
      
      <GridLayout class="mt-5" columns="*, *" rows="*, *">
        <SquircleContentView ref="featureCard1" class="info-card p-5 m-2.5 text-center" row="0" col="0" squircleBorderWidth="2" squircleBorderColor="#41d1ff">
          <StackLayout class="text-center">
            <Label class="text-3xl text-center mb-2.5">🔥</Label>
            <Label class="text-base font-bold text-white text-center mb-2" textWrap="true">Instant HMR</Label>
            <Label class="text-xs text-gray-400 text-center leading-snug" textWrap="true">See native app changes instantly without rebuilds</Label>
          </StackLayout>
        </SquircleContentView>
        
        <SquircleContentView ref="featureCard2" class="info-card p-5 m-2.5 text-center" row="0" col="1" squircleBorderWidth="2" squircleBorderColor="#bd34fe">
          <StackLayout class="text-center">
            <Label class="text-3xl text-center mb-2.5">📱</Label>
            <Label class="text-base font-bold text-white text-center mb-2" textWrap="true">Native Performance</Label>
            <Label class="text-xs text-gray-400 text-center leading-snug" textWrap="true">True native apps with web tooling speed</Label>
          </StackLayout>
        </SquircleContentView>

        <SquircleContentView ref="featureCard3" class="info-card p-5 m-2.5 text-center" row="1" col="0" squircleBorderWidth="2" squircleBorderColor="#10b981">
          <StackLayout class="text-center">
            <Label class="text-3xl text-center mb-2.5">🚀</Label>
            <Label class="text-base font-bold text-white text-center mb-2" textWrap="true">Dev Experience</Label>
            <Label class="text-xs text-gray-400 text-center leading-snug" textWrap="true">Web dev workflow for mobile development</Label>
          </StackLayout>
        </SquircleContentView>

        <SquircleContentView ref="featureCard4" class="info-card p-5 m-2.5 text-center" row="1" col="1" squircleBorderWidth="2" squircleBorderColor="#f59e0b">
          <StackLayout class="text-center">
            <Label class="text-3xl text-center mb-2.5">⚡</Label>
            <Label class="text-base font-bold text-white text-center mb-2" textWrap="true">Lightning Start</Label>
            <Label class="text-xs text-gray-400 text-center leading-snug" textWrap="true">Project boots in seconds, not minutes</Label>
          </StackLayout>
        </SquircleContentView>
      </GridLayout>
    </StackLayout>
  </ScrollView>
</template>

<script lang="ts" setup>
import { BlurView } from '@nativescript-community/ui-blurview';
import { ref, watch, nextTick } from 'nativescript-vue';
import { Animation } from '@nativescript/core';
import { SquircleContentView } from '../squircle';

// Slide 3: NativeScript + Vite Features
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

// Template refs for elements we want to animate
const mainTitle = ref<any>(null);
const description = ref<any>(null);
const featureCard1 = ref<any>(null);
const featureCard2 = ref<any>(null);
const featureCard3 = ref<any>(null);
const featureCard4 = ref<any>(null);

// Set initial state when component mounts
const setInitialState = () => {
  nextTick(() => {
    const allRefs = [mainTitle, description, featureCard1, featureCard2, featureCard3, featureCard4];
    
    allRefs.forEach((elementRef) => {
      if (elementRef.value) {
        const element = elementRef.value.nativeView;
        element.opacity = 0;
        element.translateY = 50;
        element.scaleX = 0.8;
        element.scaleY = 0.8;
      }
    });
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
watch([mainTitle, description, featureCard1, featureCard2, featureCard3, featureCard4], () => {
  if (!animationsTriggered.value) {
    setInitialState();
  }
}, { immediate: true });

const triggerAnimations = async () => {
  console.log('Triggering Slide 3 animations');
  
  await nextTick();
  
  // Animate title first
  if (mainTitle.value) {
    const titleElement = mainTitle.value.nativeView;
    
    const titleAnimation = new Animation([{
      target: titleElement,
      opacity: 1,
      translate: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
      duration: 600,
      curve: "easeOut"
    }]);
    
    titleAnimation.play();
  }
  
  // Animate description
  if (description.value) {
    const descElement = description.value.nativeView;
    
    setTimeout(() => {
      const descAnimation = new Animation([{
        target: descElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        duration: 600,
        curve: "easeOut"
      }]);
      
      descAnimation.play();
    }, 200);
  }
  
  // Animate feature cards with stagger effect
  const cards = [featureCard1, featureCard2, featureCard3, featureCard4];
  cards.forEach((cardRef, index) => {
    if (cardRef.value) {
      const card = cardRef.value.nativeView;
      
      setTimeout(() => {
        const cardAnimation = new Animation([{
          target: card,
          opacity: 1,
          translate: { x: 0, y: 0 },
          scale: { x: 1, y: 1 },
          duration: 800,
          curve: "easeInOut"
        }]);
        
        cardAnimation.play();
      }, 400 + (index * 150)); // Stagger each card by 150ms
    }
  });
};
</script>

<style scoped>
</style>
