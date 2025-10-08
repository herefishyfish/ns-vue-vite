<script lang="ts" setup>
import {
ref
} from 'nativescript-vue';
import { isAndroid, isIOS, Application } from '@nativescript/core';
import Canvas from './Canvas.vue';
import Content from './Content.vue';
import { LoadEventData, Page } from '@nativescript/core';
import Canvas2 from './Canvas2.vue';

const progress = ref(0);
const hideStatusBar = ref(false); // Control status bar visibility
let currentPage: Page | null = null; // Store page reference

const updateProgress = (newProgress: number) => {
  progress.value = newProgress;
};

// Expose status bar control function
const toggleStatusBar = (visible: boolean) => {
  if (currentPage) {
    setStatusBarVisibility(visible, currentPage);
  }
};

// Function to hide status bar completely
const setStatusBarVisibility = (visible: boolean, page?: Page) => {
  hideStatusBar.value = !visible;
  
  if (isAndroid) {
    const activity = Application.android.foregroundActivity || Application.android.startActivity;
    if (activity) {
      const window = activity.getWindow();
      
      if (!visible) {
        // Completely hide status bar
        window.getDecorView().setSystemUiVisibility(
          android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
          android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
          android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
          android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
          android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
          android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
        );

        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
      } else {
        // Show status bar (transparent)
        window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
        window.getDecorView().setSystemUiVisibility(
          android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
          android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        );
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
      }
    }
  } else if (isIOS && page) {
    page.statusBarStyle = visible ? "light" : "dark";
  }
};

const onPageLoaded = (args: LoadEventData) => {
  const page: Page = args.object as Page;
  currentPage = page; // Store page reference
  setStatusBarVisibility(false, page);
};
</script>

<template>
  <Frame>
    <Page @loaded="onPageLoaded" actionBarHidden="true">
      <GridLayout rows="*">
        <Canvas :progress="progress" :useWebGPU="true" />
        <!-- <GridLayout verticalAlignment="top" height="80" style="background: linear-gradient(to top, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1));"></GridLayout> -->
        <Content @updateIndex="updateProgress" />
      </GridLayout>
    </Page>
  </Frame>
</template>
