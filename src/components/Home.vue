<script lang="ts" setup>
import {
ref
} from 'nativescript-vue';
import { isAndroid, Application } from '@nativescript/core';
import Canvas from './Canvas.vue';
import Content from './Content.vue';
import { LoadEventData, Page } from '@nativescript/core';

const progress = ref(0);
const updateProgress = (newProgress: number) => {
  progress.value = newProgress;
};

const onPageLoaded = (args: LoadEventData) => {
  const page: Page = args.object as Page;
  console.log("Page loaded:", page);

  // Transparent status bar for Android
  if (isAndroid) {
    const activity = Application.android.foregroundActivity || Application.android.startActivity;
    if (activity) {
      const window = activity.getWindow();
      
      window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
      
      window.getDecorView().setSystemUiVisibility(
        android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
        android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
      );
      
      window.addFlags(android.view.WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
      window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    }
  }
};
</script>

<template>
  <Frame>
    <Page @loaded="onPageLoaded" actionBarHidden="true">
      <GridLayout rows="*">
        <Canvas :progress="progress" />
        <Content @updateIndex="updateProgress" />
      </GridLayout>
    </Page>
  </Frame>
</template>
