import { SquircleContentViewBase, superellipsePoints } from './squircle-common';
import { Color } from '@nativescript/core';

@NativeClass()
class SquircleLayout extends android.widget.FrameLayout {
  n = 4;
  path = new android.graphics.Path();
  borderPath = new android.graphics.Path();
  lastW = 0;
  lastH = 0;
  lastN = 0;
  borderPaint = new android.graphics.Paint();
  borderWidth = 0;
  borderColor = '#000000';

  constructor(ctx: android.content.Context) {
    super(ctx);
    this.setWillNotDraw(false);
    this.borderPaint.setStyle(android.graphics.Paint.Style.STROKE);
    this.borderPaint.setAntiAlias(true);
  }

  setExponent(n: number) {
    if (n === this.n) return;
    this.n = n;
    this.rebuildPath(this.getWidth(), this.getHeight(), true);
    this.invalidateOutline();
    this.invalidate();
  }

  setBorderWidth(width: number) {
    this.borderWidth = width;
    this.borderPaint.setStrokeWidth(width);
    this.rebuildPath(this.getWidth(), this.getHeight(), true);
    this.invalidate();
  }

  setBorderColor(color: string) {
    this.borderColor = color;
    try {
      const nsColor = new Color(color);
      this.borderPaint.setColor(nsColor.android);
    } catch (e) {
      this.borderPaint.setColor(android.graphics.Color.BLACK);
    }
    this.invalidate();
  }

  rebuildPath(w: number, h: number, force = false) {
    if (w <= 0 || h <= 0) return;

    if (
      !force &&
      w === this.lastW &&
      h === this.lastH &&
      this.n === this.lastN
    ) {
      return;
    }
    this.lastW = w;
    this.lastH = h;
    this.lastN = this.n;

    const points = superellipsePoints(w, h, this.n, 50);

    const p = new android.graphics.Path();
    points.forEach((point, i) => {
      if (i === 0) p.moveTo(point.x, point.y);
      else p.lineTo(point.x, point.y);
    });
    p.close();
    this.path = p;

    if (this.borderWidth > 0) {
      const inset = this.borderWidth / 2;
      const borderPoints = superellipsePoints(w - inset * 2, h - inset * 2, this.n, 50);
      const borderP = new android.graphics.Path();
      borderPoints.forEach((point, i) => {
        if (i === 0) borderP.moveTo(point.x + inset, point.y + inset);
        else borderP.lineTo(point.x + inset, point.y + inset);
      });
      borderP.close();
      this.borderPath = borderP;
    }
  }

  onSizeChanged(w: number, h: number, oldw: number, oldh: number): void {
    super.onSizeChanged(w, h, oldw, oldh);
    this.rebuildPath(w, h);
    this.invalidate();
  }

  draw(canvas: android.graphics.Canvas): void {
    const save = canvas.save();
    try {
      if (this.lastW > 0 && this.lastH > 0) {
        canvas.clipPath(this.path);
      }
      super.draw(canvas);
      
      if (this.borderWidth > 0 && this.lastW > 0 && this.lastH > 0) {
        canvas.drawPath(this.borderPath, this.borderPaint);
      }
    } finally {
      canvas.restoreToCount(save);
    }
  }

  dispatchDraw(canvas: android.graphics.Canvas): void {
    const save = canvas.save();
    try {
      if (this.lastW > 0 && this.lastH > 0) {
        canvas.clipPath(this.path);
      }
      super.dispatchDraw(canvas);
      
      if (this.borderWidth > 0 && this.lastW > 0 && this.lastH > 0) {
        canvas.drawPath(this.borderPath, this.borderPaint);
      }
    } finally {
      canvas.restoreToCount(save);
    }
  }
}

export class SquircleContentView extends SquircleContentViewBase {
  declare nativeViewProtected: SquircleLayout;

  createNativeView() {
    return new SquircleLayout(this._context);
  }

  initNativeView() {
    super.initNativeView();
    this.nativeViewProtected.setExponent(this.cornerSmoothing);
    this.nativeViewProtected.setBorderWidth(this.squircleBorderWidth);
    this.nativeViewProtected.setBorderColor(this.squircleBorderColor);
  }

  protected updateExponent(n: number) {
    if (this.nativeViewProtected) {
      this.nativeViewProtected.setExponent(n);
    }
  }

  protected updateBorder() {
    if (this.nativeViewProtected) {
      this.nativeViewProtected.setBorderWidth(this.squircleBorderWidth);
      this.nativeViewProtected.setBorderColor(this.squircleBorderColor);
    }
  }

  onLoaded() {
    super.onLoaded();
    if (this.nativeViewProtected) {
      this.nativeViewProtected.setExponent(this.cornerSmoothing);
      this.nativeViewProtected.setBorderWidth(this.squircleBorderWidth);
      this.nativeViewProtected.setBorderColor(this.squircleBorderColor);
    }
  }
}
