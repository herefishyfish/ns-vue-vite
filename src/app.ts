import { createApp, registerElement } from 'nativescript-vue';
import '@nativescript/canvas-polyfill';
import Home from './components/Home.vue';
import { BlurView } from "@nativescript-community/ui-blurview";
import { SquircleContentView } from './components/squircle';

registerElement("BlurView", () => BlurView);
registerElement("SquircleContentView", () => SquircleContentView);

createApp(Home).start();
