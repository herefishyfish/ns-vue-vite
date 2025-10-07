<script lang="ts" setup>
import { ref, watch, nextTick } from 'nativescript-vue';
import { Animation } from '@nativescript/core';

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
const frameworks = ref<any>(null);
const additionalFrameworks = ref<any>(null);

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
    
    if (frameworks.value) {
      const element = frameworks.value.nativeView;
      element.opacity = 0;
      element.scaleX = 0.7;
      element.scaleY = 0.7;
    }
    
    if (additionalFrameworks.value) {
      const element = additionalFrameworks.value.nativeView;
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
watch([title, subtitle, frameworks, additionalFrameworks], () => {
  if (!animationsTriggered.value) {
    setInitialState();
  }
}, { immediate: true });

const triggerAnimations = async () => {
  console.log('Triggering Slide 4 animations');
  
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
  
  // Animate frameworks grid with scale effect
  if (frameworks.value) {
    const frameworksElement = frameworks.value.nativeView;
    
    setTimeout(() => {
      const frameworksAnimation = new Animation([{
        target: frameworksElement,
        opacity: 1,
        scale: { x: 1, y: 1 },
        duration: 800,
        curve: "easeInOut"
      }]);
      
      frameworksAnimation.play();
    }, 400);
  }
  
  // Animate additional frameworks text
  if (additionalFrameworks.value) {
    const additionalElement = additionalFrameworks.value.nativeView;
    
    setTimeout(() => {
      const additionalAnimation = new Animation([{
        target: additionalElement,
        opacity: 1,
        translate: { x: 0, y: 0 },
        duration: 600,
        curve: "easeOut"
      }]);
      
      additionalAnimation.play();
    }, 800);
  }
};

const frameworkData = [
  {
    name: "Vue.js",
    logo: "https://icon2.cleanpng.com/20180718/aoj/kisspng-vue-js-javascript-library-angularjs-developer-5b4f2afa2ace52.9405904515319150021753.jpg",
    logoClass: "vue-logo",
    class: "vue",
  },
  {
    name: "React",
    logo: "⚛️",
    logoClass: "react-logo",
    class: "react",
  },
  {
    name: "Solid",
    logo: "🟨",
    logoClass: "solid-logo",
    class: "solid",
  },
  {
    name: "Svelte",
    logo: "🟥",
    logoClass: "svelte-logo",
    class: "svelte",
  },
  {
    name: "Angular",
    logo: "https://icon2.cleanpng.com/20180506/hlq/kisspng-angularjs-ionic-5aef7b9232dad3.3268841315256441782083.jpg",
    logoClass: "angular-logo",
    class: "angular",
  }
];
</script>

<template>
  <StackLayout class="p-5" verticalAlignment="center">
    <Label ref="title" class="text-4xl font-bold text-white text-center mb-2.5" textWrap="true">Framework Agnostic</Label>
    <Label ref="subtitle" class="text-lg text-gray-400 text-center mb-10">Works with your favorite framework</Label>

    <FlexboxLayout ref="frameworks" class="my-8 w-full" flexWrap="wrap" justifyContent="center" alignItems="center">
      <StackLayout 
        v-for="framework in frameworkData" 
        :key="framework.name" 
        class="rounded-2xl p-4 m-2 text-center relative w-24 h-28 bg-white/5 border-2"
        :class="framework.class"
      >
        <StackLayout class="relative z-10">
          <Image
            :src="framework.logo"
            :class="['text-3xl font-bold text-center w-12 h-12 rounded-full leading-12 mb-2', framework.logoClass]"
          />
          <Label class="text-sm font-bold text-white text-center" :text="framework.name" />
        </StackLayout>
      </StackLayout>
    </FlexboxLayout>

    <StackLayout ref="additionalFrameworks" class="mt-8">
      <Label
        class="text-sm text-center italic text-gray-300"
        textWrap="true"
      >+ Angular, Svelte, Vanilla JS, and more!</Label>
    </StackLayout>
  </StackLayout>
</template>

<style scoped>
/* Framework-specific border colors using Tailwind custom classes */
.vue {
  border-color: #41b883;
  background-color: rgba(65, 184, 131, 0.1);
}

.react {
  border-color: #61dafb;
  background-color: rgba(97, 218, 251, 0.1);
}

.solid {
  border-color: #2c4f7c;
  background-color: rgba(44, 79, 124, 0.1);
}

.svelte {
  border-color: #ff3e00;
  background-color: rgba(255, 62, 0, 0.1);
}

.angular {
  border-color: #dd0031;
  background-color: rgba(221, 0, 49, 0.1);
}

.vue-logo {
  color: #41b883;
  background-color: rgba(65, 184, 131, 0.2);
}

.react-logo {
  color: #61dafb;
  background-color: rgba(97, 218, 251, 0.2);
}

.solid-logo {
  color: #2c4f7c;
  background-color: rgba(44, 79, 124, 0.2);
}

.svelte-logo {
  color: #ff3e00;
  background-color: rgba(255, 62, 0, 0.2);
}

.angular-logo {
  color: #dd0031;
  background-color: rgba(221, 0, 49, 0.2);
}
</style>
