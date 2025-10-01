import { Label, Color } from '@nativescript/core';

export function applyGradient(label: Label, colorCodes: string[]) {
  const text = label.text;

  const nsString = NSString.stringWithString(text);
  const font = label.ios.font;
  const textWidth = nsString.sizeWithFont(font).width + 5;
  const size = CGSizeMake(textWidth, 1);

  UIGraphicsBeginImageContextWithOptions(size, false, 0.0);
  const context = UIGraphicsGetCurrentContext();
  const colorSpace = CGColorSpaceCreateDeviceRGB();
  const colors = colorCodes.map((color) => {
    return new Color(color).ios.CGColor;
  });
  // @ts-ignore
  const gradient = CGGradientCreateWithColors(colorSpace, colors, null);
  
  CGContextDrawLinearGradient(
    context,
    gradient,
    CGPointMake(0, 0),
    CGPointMake(size.width, size.height),
    // @ts-ignore
    0
  );
  const image = UIGraphicsGetImageFromCurrentImageContext();
  CGColorSpaceRelease(colorSpace);
  UIGraphicsEndImageContext();

  label.ios.textColor = UIColor.colorWithPatternImage(image);
}
