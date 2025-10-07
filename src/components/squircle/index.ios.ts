import { SquircleContentViewBase, superellipsePoints } from './squircle-common';
import { Color } from '@nativescript/core';

@NativeClass()
class MaskedSquircleView extends UIView {
  exponent = 4;
  borderWidth = 0;
  borderColor = '#000000';
  private _maskLayer?: CAShapeLayer;
  private _borderLayer?: CAShapeLayer;

  static newWithDefaults(): MaskedSquircleView {
    const v = <MaskedSquircleView>MaskedSquircleView.new();
    v.layer.masksToBounds = true;

    const mask = CAShapeLayer.layer();
    v._maskLayer = mask;
    v.layer.mask = mask;

    const border = CAShapeLayer.layer();
    v._borderLayer = border;
    border.fillColor = UIColor.clearColor.CGColor;
    border.strokeColor = UIColor.blackColor.CGColor;
    border.lineWidth = 0;
    v.layer.addSublayer(border);

    return v;
  }

  didMoveToWindow() {
    super.didMoveToWindow();
  }

  layoutSubviews() {
    super.layoutSubviews();
    this.updateMaskPath('layoutSubviews');
  }

  setExponent(n: number) {
    if (n === this.exponent) return;
    this.exponent = n;
    this.setNeedsLayout();
  }

  setBorderWidth(width: number) {
    this.borderWidth = width;
    if (this._borderLayer) {
      this._borderLayer.lineWidth = width;
    }
    this.setNeedsLayout();
  }

  setBorderColor(color: string) {
    this.borderColor = color;
    if (this._borderLayer) {
      try {
        const nsColor = new Color(color);
        this._borderLayer.strokeColor = nsColor.ios.CGColor;
      } catch (e) {
        this._borderLayer.strokeColor = UIColor.blackColor.CGColor;
      }
    }
  }

  private makeExponentPath(w: number, h: number, n: number): UIBezierPath {
    const path = UIBezierPath.bezierPath();

    const points = superellipsePoints(w, h, n, 50);

    points.forEach((point, i) => {
      if (i === 0) path.moveToPoint(CGPointMake(point.x, point.y));
      else path.addLineToPoint(CGPointMake(point.x, point.y));
    });

    path.closePath();
    return path;
  }

  updateMaskPath(reason: string) {
    try {
      const w = this.bounds.size.width;
      const h = this.bounds.size.height;
      if (w <= 0 || h <= 0) {
        return;
      }

      if (!this._maskLayer || !this.layer.mask) {
        const mask = CAShapeLayer.layer();
        this._maskLayer = mask;
        this.layer.masksToBounds = true;
        this.layer.mask = mask;
      }

      if (!this._borderLayer) {
        const border = CAShapeLayer.layer();
        this._borderLayer = border;
        border.fillColor = UIColor.clearColor.CGColor;
        border.strokeColor = UIColor.blackColor.CGColor;
        border.lineWidth = this.borderWidth;
        this.layer.addSublayer(border);
      }

      const n = Math.max(0.01, this.exponent);

      const expansion = 3;
      const maskPath = this.makeExponentPath(w + expansion, h + expansion, n);
      maskPath.applyTransform(CGAffineTransformMakeTranslation(-expansion/2, -expansion/2));

      let borderPath: UIBezierPath;
      if (this.borderWidth > 0) {
        const inset = this.borderWidth / 2;
        borderPath = this.makeExponentPath(w - inset * 2, h - inset * 2, n);
        borderPath.applyTransform(CGAffineTransformMakeTranslation(inset, inset));
      } else {
        borderPath = this.makeExponentPath(w, h, n);
      }

      CATransaction.begin();
      CATransaction.setDisableActions(true);
      this._maskLayer!.path = maskPath.CGPath;
      this._borderLayer!.path = borderPath.CGPath;
      this._borderLayer!.lineWidth = this.borderWidth;
      CATransaction.commit();
    } catch (e) {}
  }
}

export class SquircleContentView extends SquircleContentViewBase {
  declare nativeViewProtected: MaskedSquircleView;

  createNativeView() {
    const v = MaskedSquircleView.newWithDefaults();
    return v;
  }

  initNativeView() {
    super.initNativeView();
  }

  onLoaded() {
    super.onLoaded();
    this.nativeViewProtected.setExponent(this.cornerSmoothing);
    this.nativeViewProtected.setBorderWidth(this.squircleBorderWidth);
    this.nativeViewProtected.setBorderColor(this.squircleBorderColor);
    this.requestLayout();
    this.nativeViewProtected.updateMaskPath('onLoaded:timeout');
  }

  onLayout(l: number, t: number, r: number, b: number) {
    super.onLayout(l, t, r, b);
    this.nativeViewProtected.updateMaskPath('onLayout');
  }

  protected updateExponent(n: number) {
    this.nativeViewProtected?.setExponent(n);
  }

  protected updateBorder() {
    if (this.nativeViewProtected) {
      this.nativeViewProtected.setBorderWidth(this.squircleBorderWidth);
      this.nativeViewProtected.setBorderColor(this.squircleBorderColor);
      this.nativeViewProtected.updateMaskPath('updateBorder');
    }
  }
}
