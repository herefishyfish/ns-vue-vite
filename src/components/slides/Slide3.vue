<template>
  <ScrollView class="slide-container">
    <StackLayout verticalAlignment="center">
      <Label ref="mainTitle" class="main-title">Game-Changing Features</Label>
      <Label ref="description" class="description" textWrap="true">
        NativeScript's Vite integration brings web development speeds to native mobile app creation.
      </Label>
      
      <GridLayout class="feature-grid" columns="*, *" rows="*, *">
        <StackLayout ref="featureCard1" class="feature-card" row="0" col="0">
          <Label class="icon">🔥</Label>
          <Label class="feature-title" textWrap="true">Instant HMR</Label>
          <Label class="feature-description" textWrap="true">See native app changes instantly without rebuilds</Label>
        </StackLayout>
        
        <StackLayout ref="featureCard2" class="feature-card" row="0" col="1">
          <Label class="icon">📱</Label>
          <Label class="feature-title" textWrap="true">Native Performance</Label>
          <Label class="feature-description" textWrap="true">True native apps with web tooling speed</Label>
        </StackLayout>
        
        <StackLayout ref="featureCard3" class="feature-card" row="1" col="0">
          <BlurView blurAmount="10" />
          <Label class="icon">🚀</Label>
          <Label class="feature-title" textWrap="true">Dev Experience</Label>
          <Label class="feature-description" textWrap="true">Web dev workflow for mobile development</Label>
        </StackLayout>
        
        <StackLayout ref="featureCard4" class="feature-card" row="1" col="1">
          <Label class="icon">⚡</Label>
          <Label class="feature-title" textWrap="true">Lightning Start</Label>
          <Label class="feature-description" textWrap="true">Project boots in seconds, not minutes</Label>
        </StackLayout>
      </GridLayout>
    </StackLayout>
  </ScrollView>
</template>

<script lang="ts" setup>
import { BlurView } from '@nativescript-community/ui-blurview';
import { ref, watch, nextTick } from 'nativescript-vue';
import { Animation } from '@nativescript/core';

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
.slide-container {
  padding: 20;
}

.main-title {
  font-size: 32;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 15;
}

.description {
  font-size: 16;
  color: #d0d0d0;
  text-align: center;
  margin-bottom: 30;
  line-height: 1.5;
}

.feature-grid {
  margin-top: 20;
}

.feature-card {
  background-color: #2a2a3e56;
  border-radius: 12;
  padding: 20;
  margin: 10;
  text-align: center;
}

.icon {
  font-size: 32;
  text-align: center;
  margin-bottom: 10;
}

.feature-title {
  font-size: 16;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 8;
}

.feature-description {
  font-size: 12;
  color: #a0a0a0;
  text-align: center;
  line-height: 1.4;
}
</style>
