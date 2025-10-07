import { ContentView } from "@nativescript/core";

export class SquircleContentView extends ContentView {
  cornerSmoothing: number;
  squircleBorderWidth: number;
  squircleBorderColor: string;

  readonly android: any;
  readonly ios: any;
}
