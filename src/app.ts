import { createApp, registerElement } from 'nativescript-vue';
import '@nativescript/canvas-polyfill';
import Home from './components/Home.vue';
import { BlurView } from "@nativescript-community/ui-blurview";

registerElement("BlurView", () => BlurView);

createApp(Home).start();
