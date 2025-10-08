<script lang="ts" setup>
import { Application, isAndroid, LoadEventData, Page } from "@nativescript/core";
import { ref } from "nativescript-vue";
import Canvas from "./Canvas.vue";
import Content from "./Content.vue";

const progress = ref(0);
const hideStatusBar = ref(false); // Control status bar visibility
let currentPage: Page | null = null; // Store page reference

const updateProgress = (newProgress: number) => {
  progress.value = newProgress;
};


// Function to hide status bar completely
const setStatusBarVisibility = (page?: Page) => {

  if (isAndroid) {
    const activity =
      Application.android.foregroundActivity ||
      Application.android.startActivity;
    if (activity) {
      const window = activity.getWindow();

      window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
      window
        .getDecorView()
        .setSystemUiVisibility(
          android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
            android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        );
      window.addFlags(
        android.view.WindowManager.LayoutParams
          .FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS
      );
      window.clearFlags(
        android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS
      );
      1;
    }
  } 
};

const onPageLoaded = (args: LoadEventData) => {
  const page: Page = args.object as Page;
  currentPage = page;
  setStatusBarVisibility(page);
};
</script>

<template>
  <Frame>
    <Page @loaded="onPageLoaded" actionBarHidden="true">
      <GridLayout rows="*">
        <Canvas :progress="progress" :useWebGPU="true" />
        <Content @updateIndex="updateProgress" />
      </GridLayout>
    </Page>
  </Frame>
</template>
