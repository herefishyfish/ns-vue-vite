import { ContentView, Property } from '@nativescript/core';

export type Point = { x: number; y: number };

export function clampExponent(n: number): number {
  const nn = Number.isFinite(n) ? n : 4;
  return Math.max(0.01, nn);
}

export function superellipsePoints(
  w: number,
  h: number,
  n: number,
  steps = 256
): Point[] {
  if (w <= 0 || h <= 0) return [];
  const a = w / 2;
  const c = h / 2;
  const cx = a;
  const cy = c;

  const pts: Point[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * (Math.PI * 2);
    const ct = Math.cos(t);
    const st = Math.sin(t);
    const x = cx + a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
    const y = cy + c * Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
    pts.push({ x, y });
  }
  return pts;
}

export abstract class SquircleContentViewBase extends ContentView {
  protected _n = 8;
  protected _squircleBorderWidth = 0;
  protected _squircleBorderColor = '#000000';

  get cornerSmoothing(): number {
    return this._n;
  }

  set cornerSmoothing(v: number) {
    if (this._n !== v) {
      this._n = v;
      this.updateExponent(v);
    }
  }

  get squircleBorderWidth(): number {
    return this._squircleBorderWidth;
  }

  set squircleBorderWidth(v: number) {
    if (this._squircleBorderWidth !== v) {
      this._squircleBorderWidth = v;
      this.updateBorder();
    }
  }

  get squircleBorderColor(): string {
    return this._squircleBorderColor;
  }

  set squircleBorderColor(v: string) {
    if (this._squircleBorderColor !== v) {
      this._squircleBorderColor = v;
      this.updateBorder();
    }
  }

  public setCornerSmoothing(v: number) {
    this._n = v;
    this.updateExponent(v);
  }

  public setSquircleBorderWidth(v: number) {
    this._squircleBorderWidth = v;
    this.updateBorder();
  }

  public setSquircleBorderColor(v: string) {
    this._squircleBorderColor = v;
    this.updateBorder();
  }

  protected abstract updateExponent(n: number): void;
  protected abstract updateBorder(): void;
}

export const cornerSmoothingProperty = new Property<
  SquircleContentViewBase,
  number
>({
  name: 'cornerSmoothing',
  defaultValue: 4,
  valueConverter: Number,
  valueChanged: (target, oldValue, newValue) => {
    target.setCornerSmoothing(newValue);
  },
});
cornerSmoothingProperty.register(SquircleContentViewBase);

export const squircleBorderWidthProperty = new Property<
  SquircleContentViewBase,
  number
>({
  name: 'squircleBorderWidth',
  defaultValue: 0,
  valueConverter: Number,
  valueChanged: (target, oldValue, newValue) => {
    target.setSquircleBorderWidth(newValue);
  },
});
squircleBorderWidthProperty.register(SquircleContentViewBase);

export const squircleBorderColorProperty = new Property<
  SquircleContentViewBase,
  string
>({
  name: 'squircleBorderColor',
  defaultValue: '#000000',
  valueConverter: String,
  valueChanged: (target, oldValue, newValue) => {
    target.setSquircleBorderColor(newValue);
  },
});
squircleBorderColorProperty.register(SquircleContentViewBase);
