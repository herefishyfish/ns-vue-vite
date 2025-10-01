<script lang="ts" setup>
import { Pager, PagerItem } from "@nativescript-community/ui-pager";
import { PagerIndicator } from "@nativescript-community/ui-pager-indicator";
import { registerElement, ref, watch } from "nativescript-vue";
import { LoadEventData } from "@nativescript/core";
import Slide1 from "./slides/Slide1.vue";
import Slide2 from "./slides/Slide2.vue";
import Slide3 from "./slides/Slide3.vue";
import Slide4 from "./slides/Slide4.vue";
import Slide5 from "./slides/Slide5.vue";

registerElement("Pager", () => Pager);
registerElement("PagerItem", () => PagerItem);
registerElement("PagerIndicator", () => PagerIndicator);

let currentIndex = ref(0);
let currentScrollPosition = ref(0);
let previousIndex = ref(-1);
const animationTriggered = ref(new Set<number>());
const emits = defineEmits(["updateIndex"]);

// Watch for slide changes and trigger animations
watch(currentScrollPosition, (newPosition, oldPosition) => {
  
  // Always emit the raw fractional position for canvas interpolation
  emits("updateIndex", newPosition);
  
  // Check if any slide should trigger animations at 0.8 threshold
  checkAnimationTriggers(newPosition);
  
  // Update current index for other logic
  const newIndex = Math.round(newPosition);
  if (newIndex !== currentIndex.value) {
    previousIndex.value = currentIndex.value;
    currentIndex.value = newIndex;
  }
});

// Check if any slide should trigger animations based on scroll position
const checkAnimationTriggers = (position: number) => {
  const slideIndex = Math.floor(position);
  const slideProgress = position - slideIndex;
  
  // Trigger animation when slide is 80% visible (0.8 progress)
  if (slideProgress >= 0.8 && !animationTriggered.value.has(slideIndex)) {
    animationTriggered.value.add(slideIndex);
    animationTriggered.value = new Set(animationTriggered.value);
  }
};

const onPagerLoaded = (args: LoadEventData) => {
  const pager = args.object as Pager;
  console.log("Pager loaded");
  pager.on("scroll", (args: any) => {
    const newPosition = args["currentPosition"];
    if (newPosition !== currentScrollPosition.value) {
      currentScrollPosition.value = newPosition;
    }
  });
};

const isSlideActive = (slideIndex: number) => {
  return currentIndex.value === slideIndex;
};

const isSlideJustActivated = (slideIndex: number) => {
  return currentIndex.value === slideIndex && previousIndex.value !== slideIndex;
};

const shouldTriggerAnimation = (slideIndex: number) => {
  return animationTriggered.value.has(slideIndex);
};
</script>
<template>
  <GridLayout rows="*, auto" class="w-full h-full">
    <Pager row="0" id="pager" @loaded="onPagerLoaded" class="w-full h-full pt-8" peaking="30" android:spacing="10">
      <PagerItem>
        <Slide1 :isActive="isSlideActive(0)" :justActivated="isSlideJustActivated(0)" :shouldAnimate="shouldTriggerAnimation(0)" />
      </PagerItem>
      <PagerItem>
        <Slide2 :isActive="isSlideActive(1)" :justActivated="isSlideJustActivated(1)" :shouldAnimate="shouldTriggerAnimation(1)" />
      </PagerItem>
      <PagerItem>
        <Slide3 :isActive="isSlideActive(2)" :justActivated="isSlideJustActivated(2)" :shouldAnimate="shouldTriggerAnimation(2)" />
      </PagerItem>
      <PagerItem>
        <Slide4 :isActive="isSlideActive(3)" :justActivated="isSlideJustActivated(3)" :shouldAnimate="shouldTriggerAnimation(3)" />
      </PagerItem>
      <PagerItem>
        <Slide5 :isActive="isSlideActive(4)" :justActivated="isSlideJustActivated(4)" :shouldAnimate="shouldTriggerAnimation(4)" />
      </PagerItem>
    </Pager>
    <PagerIndicator row="1" pagerViewId="pager" class="mb-4" type="fill" verticalAlignment="bottom" horizontalAlignment="center" marginBottom="10" />
  </GridLayout>
</template>

<style>
  .card {
    /*   // renderer.setClearColor(0xf0fdf4); */
    /* background-color: rgba(255, 255, 255, 0.8); */
    border-radius: 10;
  }
</style>
