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
      element.translateY = 40;
      element.scaleX = 0.9;
      element.scaleY = 0.9;
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
  <ScrollView class="slide-container">
    <StackLayout verticalAlignment="center">
      <Label ref="title" class="title">Start Building Today</Label>
      <Label ref="subtitle" class="subtitle">Create your first NativeScript app with Vite</Label>
      
      <StackLayout ref="terminal" class="terminal">
        <GridLayout class="terminal-header" columns="auto, *, auto" rows="*">
          <StackLayout class="terminal-buttons" col="0" orientation="horizontal">
            <Label class="btn-close">●</Label>
            <Label class="btn-minimize">●</Label>
            <Label class="btn-maximize">●</Label>
          </StackLayout>
          <Label class="terminal-title" col="1">Terminal</Label>
        </GridLayout>
        
        <StackLayout class="terminal-body">
          <StackLayout class="command-line" orientation="horizontal">
            <Label class="prompt">$</Label>
            <Label class="command">npm create @nativescript/app@latest</Label>
          </StackLayout>
          
          <StackLayout class="command-output">
            <Label class="output-line">✔ App name: my-mobile-app</Label>
            <Label class="output-line">✔ Template: Vue.js + Vite</Label>
            <Label class="output-line">✔ Platform: iOS & Android</Label>
            <Label class="output-line success">🚀 Your NativeScript + Vite app is ready!</Label>
          </StackLayout>
        </StackLayout>
      </StackLayout>
            
      <GridLayout ref="stats" class="stats" columns="*, *, *" rows="*">
        <StackLayout class="stat-card" row="0" col="0">
          <Label class="stat-number">3s</Label>
          <Label class="stat-label" textWrap="true">Dev Server Start</Label>
        </StackLayout>
        
        <StackLayout class="stat-card" row="0" col="1">
          <Label class="stat-number">100%</Label>
          <Label class="stat-label" textWrap="true">Native Performance</Label>
        </StackLayout>
        
        <StackLayout class="stat-card" row="0" col="2">
          <Label class="stat-number">∞</Label>
          <Label class="stat-label" textWrap="true">Possibilities</Label>
        </StackLayout>
      </GridLayout>

    </StackLayout>
  </ScrollView>
</template>

<style scoped>
.slide-container {
  padding: 20;
}

.title {
  font-size: 32;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 10;
}

.subtitle {
  font-size: 16;
  color: #a0a0a0;
  text-align: center;
  margin-bottom: 30;
}

.terminal {
  background-color: #1e1e2e;
  border-radius: 8;
  margin: 20 0;
  border-color: #3a3a4a;
  border-width: 1;
}

.terminal-header {
  background-color: #2a2a3a;
  padding: 10 15;
  border-radius: 8 8 0 0;
}

.terminal-buttons {
  margin-right: 10;
}

.btn-close {
  color: #ff5f56;
  margin-right: 5;
  font-size: 12;
}

.btn-minimize {
  color: #ffbd2e;
  margin-right: 5;
  font-size: 12;
}

.btn-maximize {
  color: #27ca3f;
  font-size: 12;
}

.terminal-title {
  color: #ffffff;
  font-size: 12;
  text-align: center;
  vertical-align: center;
}

.terminal-body {
  padding: 15;
}

.command-line {
  margin-bottom: 10;
}

.prompt {
  color: #51cf66;
  font-family: "Courier New", monospace;
  margin-right: 5;
}

.command {
  color: #ffffff;
  font-family: "Courier New", monospace;
}

.command-output {
  margin-top: 10;
}

.output-line {
  color: #a0a0a0;
  font-family: "Courier New", monospace;
  font-size: 12;
  margin-bottom: 3;
}

.output-line.success {
  color: #51cf66;
}

.stats {
  margin-top: 30;
}

.stat-card {
  text-align: center;
  padding: 15;
  margin: 5;
  background-color: #2a2a3e56;
  border-radius: 8;
}

.stat-number {
  font-size: 24;
  font-weight: bold;
  color: #646cff;
  text-align: center;
  margin-bottom: 5;
}

.stat-label {
  font-size: 12;
  color: #a0a0a0;
  text-align: center;
}
</style>
