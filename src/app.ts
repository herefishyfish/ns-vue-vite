import '@nativescript/canvas-three';
import { createApp, registerElement } from 'nativescript-vue';
import Home from './components/Home.vue';
import { BlurView } from "@nativescript-community/ui-blurview";
import { SquircleContentView } from './components/squircle';
import { Canvas } from '@nativescript/canvas';
import { SVGView } from '@nativescript-community/ui-svg';

registerElement("SVGView", () => SVGView);
registerElement("BlurView", () => BlurView);
registerElement("Canvas", () => Canvas);
registerElement("SquircleContentView", () => SquircleContentView);

createApp(Home).start();
