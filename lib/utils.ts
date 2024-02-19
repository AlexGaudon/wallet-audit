import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const displayAmount = (amount: number) => (amount / 100).toFixed(2);

export function getFirstDayOfMonth(date: Date): string {
  const firstDayOfMonth = new Date(date);
  firstDayOfMonth.setDate(1);
  const formattedDate = firstDayOfMonth.toISOString().split("T")[0];
  return formattedDate;
}

export function getLastDayOfMonth(date: Date): string {
  const lastDayOfMonth = new Date(date);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1, 0);
  const formattedDate = lastDayOfMonth.toISOString().split("T")[0];
  return formattedDate;
}

type RGBColor = {
  r: number;
  g: number;
  b: number;
};

export function getTextColorBasedOnBackground(
  backgroundColor: string
): "black" | "white" {
  // Convert the hex color to RGB
  const hexToRgb = (hex: string): RGBColor => {
    hex = hex.replace(/^#/, "");

    const bigint = parseInt(hex, 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  };

  // Calculate the relative luminance
  const calculateRelativeLuminance = (rgb: RGBColor): number => {
    const sRGB = (value: number): number => {
      value /= 255;
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const r = sRGB(rgb.r);
    const g = sRGB(rgb.g);
    const b = sRGB(rgb.b);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Get RGB values from the background color
  const rgb: RGBColor = hexToRgb(backgroundColor);

  // Calculate the relative luminance
  const luminance: number = calculateRelativeLuminance(rgb);

  // Determine text color based on luminance
  return luminance > 0.35 ? "black" : "white";
}
