// Color utility functions
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const parseRgbaColor = (
  rgba: string
): { r: number; g: number; b: number; a: number } => {
  const match = rgba.match(/rgba?\(([^)]+)\)/);
  if (match) {
    const values = match[1].split(",").map((v) => parseFloat(v.trim()));
    return {
      r: values[0] || 0,
      g: values[1] || 0,
      b: values[2] || 0,
      a: values[3] !== undefined ? values[3] : 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const rgbaToHex = (r: number, g: number, b: number): number => {
  return (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b);
};

// Math utilities
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const lerpColor = (color1: string, color2: string, factor: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(lerp(rgb1.r, rgb2.r, factor));
  const g = Math.round(lerp(rgb1.g, rgb2.g, factor));
  const b = Math.round(lerp(rgb1.b, rgb2.b, factor));

  return rgbToHex(r, g, b);
};

export const lerpRgbaColor = (
  color1: string,
  color2: string,
  factor: number
): string => {
  const rgba1 = parseRgbaColor(color1);
  const rgba2 = parseRgbaColor(color2);

  const r = lerp(rgba1.r, rgba2.r, factor);
  const g = lerp(rgba1.g, rgba2.g, factor);
  const b = lerp(rgba1.b, rgba2.b, factor);
  const a = lerp(rgba1.a, rgba2.a, factor);

  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
};
