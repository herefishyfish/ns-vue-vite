import { Label, Color } from '@nativescript/core';

export function applyGradient(label: Label, colorsArray: string[]): void {
  const text = label.text;
  const textWidth = label.android.getPaint().measureText(text);
  const colors = colorsArray.map((c) => {
    return new Color(c).android;
  });
  const textShader = new android.graphics.LinearGradient(
    0.0,
    0.0,
    textWidth,
    0,
    colors[0],
    colors[1],
    android.graphics.Shader.TileMode.CLAMP
  );
  label.android.getPaint().setShader(textShader);
}
