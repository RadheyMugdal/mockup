import { EditorState, MockupPreset, AppleFrame, ColorPreset } from "./types";

export const initialState: EditorState = {
  background: "/images/backgrounds/desktop/desktop-01.jpg",
  backgroundType: "image",
  frameStyle: "none",
  deviceType: "desktop",
};

export const defaultScreenshotSettings = {
  radius: 16,
  padding: 0,
  x: 0,
  y: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  perspective: 1200,
  zoom: 1,
} as const;

export const mockupPresets: MockupPreset[] = [
  {
    id: "center-plain",
    name: "Clean Center",
    detail: "Classic app presentation",
    frameStyle: "none",
    settings: {
      ...defaultScreenshotSettings,
      radius: 16,
      padding: 0,
      zoom: 0.9,
    },
  },
  {
    id: "browser-dark",
    name: "Floating Browser",
    detail: "Modern dark chrome window",
    frameStyle: "browser-dark",
    settings: {
      ...defaultScreenshotSettings,
      radius: 16,
      padding: 0,
      zoom: 0.9,
    },
  },
  {
    id: "tilt-left",
    name: "SaaS Showcase Left",
    detail: "Elegant left-facing angle",
    frameStyle: "browser-dark",
    settings: {
      ...defaultScreenshotSettings,
      radius: 16,
      padding: 0,
      rotateX: 6,
      rotateY: 12,
      rotateZ: -2,
      x: 20,
      zoom: 0.85,
    },
  },
  {
    id: "tilt-right",
    name: "SaaS Showcase Right",
    detail: "Elegant right-facing angle",
    frameStyle: "browser-dark",
    settings: {
      ...defaultScreenshotSettings,
      radius: 16,
      padding: 0,
      rotateX: 6,
      rotateY: -12,
      rotateZ: 2,
      x: -20,
      zoom: 0.85,
    },
  },
  {
    id: "isometric-left",
    name: "Isometric Left",
    detail: "High-angle steep left tilt",
    frameStyle: "none",
    settings: {
      ...defaultScreenshotSettings,
      radius: 12,
      padding: 0,
      rotateX: 60,
      rotateY: 0,
      rotateZ: -45,
      perspective: 3000,
      zoom: 0.75,
    },
  },
  {
    id: "isometric-right",
    name: "Isometric Right",
    detail: "High-angle steep right tilt",
    frameStyle: "none",
    settings: {
      ...defaultScreenshotSettings,
      radius: 12,
      padding: 0,
      rotateX: 60,
      rotateY: 0,
      rotateZ: 45,
      perspective: 3000,
      zoom: 0.75,
    },
  },
  {
    id: "bottom-bleed",
    name: "Bottom Bleed",
    detail: "Anchored to the canvas bottom",
    frameStyle: "browser-light",
    settings: {
      ...defaultScreenshotSettings,
      radius: 12,
      padding: 0,
      y: 35,
      zoom: 0.95,
    },
  },
  {
    id: "top-bleed",
    name: "Top Bleed",
    detail: "Anchored to the canvas top",
    frameStyle: "browser-light",
    settings: {
      ...defaultScreenshotSettings,
      radius: 12,
      padding: 0,
      y: -35,
      zoom: 0.95,
    },
  },
  {
    id: "macro-zoom",
    name: "Macro Zoom",
    detail: "Focused on top-left UI detail",
    frameStyle: "browser-dark",
    settings: {
      ...defaultScreenshotSettings,
      radius: 16,
      padding: 0,
      rotateX: 6,
      rotateY: -8,
      rotateZ: 2,
      x: 80,
      y: 40,
      zoom: 1.35,
    },
  },
];

export const appleFrames: AppleFrame[] = [
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    category: "phone",
    aspectRatio: "9:19.5",
    displayRatioClass: "aspect-[9/19.5]",
    resolution: "440 x 956",
    status: "New",
    colors: [
      { name: "Silver", value: "Silver", hex: "#e3e4e5" },
      { name: "Cosmic Orange", value: "Cosmic Orange", hex: "#e26c48" },
      { name: "Deep Blue", value: "Deep Blue", hex: "#2b4c6e" },
    ],
    insets: { top: "2.3%", left: "4.5%", right: "4.5%", bottom: "2.3%", borderRadius: "34px" },
    assetPattern: "/Exports/iOS/17 Pro Max/17 Pro Max - ${color}.png"
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    category: "phone",
    aspectRatio: "9:19.5",
    displayRatioClass: "aspect-[9/19.5]",
    resolution: "430 x 932",
    status: "New",
    colors: [
      { name: "Silver", value: "Silver", hex: "#e3e4e5" },
      { name: "Cosmic Orange", value: "Cosmic Orange", hex: "#e26c48" },
      { name: "Deep Blue", value: "Deep Blue", hex: "#2b4c6e" },
    ],
    insets: { top: "2.3%", left: "4.5%", right: "4.5%", bottom: "2.3%", borderRadius: "34px" },
    assetPattern: "/Exports/iOS/17 Pro/17 Pro - ${color}.png"
  },
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "phone",
    aspectRatio: "9:19.5",
    displayRatioClass: "aspect-[9/19.5]",
    resolution: "440 x 956",
    colors: [
      { name: "Natural Titanium", value: "Natural Titanium", hex: "#a09d98" },
      { name: "Black Titanium", value: "Black Titanium", hex: "#222224" },
      { name: "Desert Titanium", value: "Desert Titanium", hex: "#c4b5a2" },
      { name: "White Titanium", value: "White Titanium", hex: "#e3e4e5" },
    ],
    insets: { top: "2.3%", left: "4.5%", right: "4.5%", bottom: "2.3%", borderRadius: "34px" },
    assetPattern: "/Exports/iOS/16 Pro Max/16 Pro Max - ${color}.png"
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "Apple",
    category: "phone",
    aspectRatio: "9:19.5",
    displayRatioClass: "aspect-[9/19.5]",
    resolution: "430 x 932",
    colors: [
      { name: "Natural Titanium", value: "Natural Titanium", hex: "#a09d98" },
      { name: "Black Titanium", value: "Black Titanium", hex: "#222224" },
      { name: "Desert Titanium", value: "Desert Titanium", hex: "#c4b5a2" },
      { name: "White Titanium", value: "White Titanium", hex: "#e3e4e5" },
    ],
    insets: { top: "2.3%", left: "4.5%", right: "4.5%", bottom: "2.3%", borderRadius: "34px" },
    assetPattern: "/Exports/iOS/16 Pro/16 Pro - ${color}.png"
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    brand: "Apple",
    category: "phone",
    aspectRatio: "9:19.5",
    displayRatioClass: "aspect-[9/19.5]",
    resolution: "393 x 852",
    colors: [
      { name: "Black", value: "Black", hex: "#1c1c1e" },
      { name: "Pink", value: "Pink", hex: "#f0b6c3" },
      { name: "Teal", value: "Teal", hex: "#5d9996" },
      { name: "Ultramarine", value: "Ultramarine", hex: "#465f8a" },
      { name: "White", value: "White", hex: "#f1f0ec" },
    ],
    insets: { top: "2.3%", left: "4.5%", right: "4.5%", bottom: "2.3%", borderRadius: "34px" },
    assetPattern: "/Exports/iOS/16/16 - ${color}.png"
  },
  {
    id: "pixel-9-pro",
    name: "Pixel 9 Pro",
    brand: "Google",
    category: "phone",
    aspectRatio: "9:19.5",
    displayRatioClass: "aspect-[9/19.5]",
    resolution: "420 x 912",
    colors: [
      { name: "Obsidian", value: "Obsidian", hex: "#1c1c1e" },
      { name: "Hazel", value: "Hazel", hex: "#7a7772" },
      { name: "Rose Quartz", value: "Rose Quartz", hex: "#f2d3d9" },
    ],
    insets: { top: "2.4%", left: "4.8%", right: "4.8%", bottom: "2.4%", borderRadius: "30px" },
    assetPattern: "/Exports/Android Phone/Pixel 9 Pro/Pixel 9 Pro - ${color}.png"
  },
  {
    id: "ipad-pro-13",
    name: "iPad Pro 13",
    brand: "Apple",
    category: "tablet",
    aspectRatio: "3:4",
    displayRatioClass: "aspect-[3/4]",
    resolution: "2064 x 2752",
    colors: [
      { name: "Silver", value: "Silver", hex: "#e3e4e5" },
      { name: "Space Black", value: "Space Black", hex: "#1c1d21" },
    ],
    insets: { top: "3.4%", left: "4.4%", right: "4.5%", bottom: "3.4%", borderRadius: "12px" },
    assetPattern: "/Exports/iPadOS/iPad Pro/M4 & M5/13/iPad Pro 13 M4 & M5 - Portrait - ${color}.png"
  },
  {
    id: "macbook-pro-16",
    name: "MacBook Pro 16",
    brand: "Apple",
    category: "laptop",
    aspectRatio: "16:10",
    displayRatioClass: "aspect-[16/10]",
    resolution: "3456 x 2234",
    colors: [
      { name: "Space Black", value: "Space Black", hex: "#1c1d21" },
      { name: "Silver", value: "Silver", hex: "#e3e4e5" },
    ],
    insets: { top: "14.0%", left: "10.2%", right: "10.2%", bottom: "11.6%", borderRadius: "8px 8px 0 0" },
    assetPattern: "/Exports/MacBook/MacBook Pro 16.png"
  },
  {
    id: "macbook-air-15",
    name: "MacBook Air 15",
    brand: "Apple",
    category: "laptop",
    aspectRatio: "16:10",
    displayRatioClass: "aspect-[16/10]",
    resolution: "2880 x 1864",
    colors: [
      { name: "Space Gray", value: "Space Gray", hex: "#5d5f62" },
    ],
    insets: { top: "14.0%", left: "9.8%", right: "9.8%", bottom: "11.4%", borderRadius: "8px 8px 0 0" },
    assetPattern: "/Exports/MacBook/MacBook Air 15.png"
  },
  {
    id: "dell-xps-16",
    name: "Dell XPS 16",
    brand: "Dell",
    category: "laptop",
    aspectRatio: "16:10",
    displayRatioClass: "aspect-[16/10]",
    resolution: "3840 x 2400",
    colors: [
      { name: "Graphite", value: "Graphite", hex: "#3a3c3e" },
      { name: "Platinum", value: "Platinum", hex: "#e3e4e5" },
    ],
    insets: { top: "8.1%", left: "11%", right: "11%", bottom: "8.3%", borderRadius: "0" },
    assetPattern: "/Exports/Windows Laptop/Dell/2024 XPS 16 Graphite.png"
  },
  {
    id: "imac-24",
    name: "iMac 24",
    brand: "Apple",
    category: "desktop",
    aspectRatio: "16:9",
    displayRatioClass: "aspect-[16/9]",
    resolution: "4480 x 2520",
    colors: [
      { name: "Silver", value: "Silver", hex: "#e3e4e5" },
      { name: "Blue", value: "Blue", hex: "#3f7fa6" },
      { name: "Green", value: "Green", hex: "#599878" },
      { name: "Orange", value: "Orange", hex: "#d87453" },
      { name: "Purple", value: "Purple", hex: "#8b74a3" },
      { name: "Red", value: "Red", hex: "#b84f59" },
      { name: "Yellow", value: "Yellow", hex: "#d4aa55" },
    ],
    insets: { top: "28.0%", left: "4.1%", right: "4.1%", bottom: "28.0%", borderRadius: "0" },
    assetPattern: "/Exports/Mac Desktop/iMac 24/iMac 24 - ${color}.png"
  },
  {
    id: "pro-display-xdr",
    name: "Pro Display XDR",
    brand: "Apple",
    category: "desktop",
    aspectRatio: "16:9",
    displayRatioClass: "aspect-[16/9]",
    resolution: "6016 x 3384",
    colors: [
      { name: "Silver", value: "Silver", hex: "#e3e4e5" },
    ],
    insets: { top: "4.1%", left: "3.1%", right: "3.1%", bottom: "26.4%", borderRadius: "0" },
    assetPattern: "/Exports/Mac Desktop/Pro Display XDR/Pro Display XDR.png"
  },
];

export const catalogCategories = [
  { id: "all", label: "All" },
  { id: "phone", label: "Phone" },
  { id: "tablet", label: "Tablet" },
  { id: "laptop", label: "Laptop" },
  { id: "desktop", label: "Desktop" },
  { id: "watch", label: "Watch" },
] as const;

export const solidPresets: ColorPreset[] = [
  { name: "Apple Gray", value: "#f5f5f7" },
  { name: "GitHub Dark", value: "#0d1117" },
  { name: "Notion White", value: "#fbfaf8" },
  { name: "X Blue", value: "#1d9bf0" },
  { name: "Product Hunt", value: "#da552f" },
  { name: "Stripe Purple", value: "#635bff" },
  { name: "Pure Black", value: "#000000" },
  { name: "Pure White", value: "#ffffff" },
  { name: "Soft Lavender", value: "#e0e7ff" },
  { name: "Sage Green", value: "#f1f5f9" },
];

export const gradientPresets: ColorPreset[] = [
  { name: "Sunset Glow", value: "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)" },
  { name: "Ocean Breeze", value: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" },
  { name: "Midnight Purple", value: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)" },
  { name: "Forest Mist", value: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  { name: "Cyberpunk", value: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)" },
  { name: "Sunrise Warmth", value: "linear-gradient(135deg, #ffedd5 0%, #fb7185 100%)" },
  { name: "Northern Lights", value: "linear-gradient(135deg, #0575e6 0%, #00f260 100%)" },
  { name: "Lemon Sherbet", value: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
  { name: "Electric Cyan", value: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)" },
  { name: "Deep Space", value: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
  { name: "Radial Sunrise", value: "radial-gradient(circle at center, #ffedd5 0%, #fb7185 100%)" },
  { name: "Radial Indigo", value: "radial-gradient(circle at center, #6366f1 0%, #312e81 100%)" },
];

export const sliderSettings: {
  label: string;
  key: Exclude<keyof NonNullable<EditorState["screenshot"]>, "image">;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { label: "Radius", key: "radius", min: 0, max: 100, step: 0.1, unit: "px" },
  { label: "Padding", key: "padding", min: 0, max: 80, step: 1, unit: "px" },
  { label: "X", key: "x", min: -300, max: 300, step: 1, unit: "px" },
  { label: "Y", key: "y", min: -200, max: 200, step: 1, unit: "px" },
  { label: "Zoom", key: "zoom", min: 0.5, max: 1.6, step: 0.01, unit: "x" },
  { label: "Rotate X", key: "rotateX", min: -80, max: 80, step: 1, unit: "deg" },
  { label: "Rotate Y", key: "rotateY", min: -80, max: 80, step: 1, unit: "deg" },
  { label: "Rotate Z", key: "rotateZ", min: -180, max: 180, step: 1, unit: "deg" },
  {
    label: "Perspective",
    key: "perspective",
    min: 300,
    max: 5000,
    step: 10,
    unit: "px",
  },
];
