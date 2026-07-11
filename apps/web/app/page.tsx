"use client";
 
import SliderDemo from "@/components/shadcn-space/slider/slider-04";
import { EditorState, HistoryState } from "@/lib/types";
import { backgrounds, categories, cn } from "@/lib/utils";
import {
  IconArrowBackUp,
  IconArrowDownToArc,
  IconArrowsMaximize,
  IconCheck,
  IconHeart,
  IconPaintFilled,
  IconPalette,
  IconPlus,
  IconSettings,
  IconStackForward,
  IconTrash,
  IconUpload,
  IconX,
  IconCopy,
  IconLoader2,
  IconChevronDown,
  IconChevronRight,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { AspectRatio } from "@workspace/ui/components/aspect-ratio";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@workspace/ui/components/drawer";
import { useEffect, useReducer, useState } from "react";
import html2canvas from "html2canvas";
import { toast, Toaster } from "sonner";

const initialState: EditorState = {
  background: "/images/backgrounds/desktop/desktop-01.jpg",
  backgroundType: "image",
  frameStyle: "none",
  deviceType: "desktop",
};

type ScreenshotSettings = NonNullable<EditorState["screenshot"]>;
type NumericScreenshotSetting = Exclude<keyof ScreenshotSettings, "image">;

type MockupPreset = {
  id: string;
  name: string;
  detail: string;
  frameStyle: "none" | "browser-light" | "browser-dark";
  settings: Required<Omit<ScreenshotSettings, "image">>;
};

type ColorPreset = {
  name: string;
  value: string;
};

const defaultScreenshotSettings: Required<Omit<ScreenshotSettings, "image">> = {
  radius: 16,
  padding: 0,
  x: 0,
  y: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  perspective: 1200,
  zoom: 1,
};

const mockupPresets: MockupPreset[] = [
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
      rotateX: 45,
      rotateY: 0,
      rotateZ: -45,
      perspective: 1000,
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
      rotateX: 45,
      rotateY: 0,
      rotateZ: 45,
      perspective: 1000,
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

type AppleFrame = {
  id: string;
  name: string;
  brand: "Apple" | "Google" | "Samsung" | "Dell" | "Lenovo" | "Huawei";
  category: "all" | "phone" | "tablet" | "laptop" | "desktop" | "watch";
  aspectRatio: string;
  displayRatioClass: string;
  resolution: string;
  status?: "New" | "Featured";
  colors: { name: string; value: string; hex: string }[];
  insets: { top: string; left: string; right: string; bottom: string; borderRadius: string };
  assetPattern: string;
};

const appleFrames: AppleFrame[] = [
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
    insets: { top: "4.5%", left: "4.5%", right: "4.5%", bottom: "4.5%", borderRadius: "20px" },
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
    insets: { top: "6.8%", left: "12%", right: "12%", bottom: "12.8%", borderRadius: "10px" },
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
    insets: { top: "6.8%", left: "12%", right: "12%", bottom: "12.8%", borderRadius: "10px" },
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
    insets: { top: "5.5%", left: "10.5%", right: "10.5%", bottom: "10.8%", borderRadius: "8px" },
    assetPattern: "/Exports/Windows Laptop/Dell/2024 XPS 16 Graphite.png" // dell uses graphite
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
    insets: { top: "4.5%", left: "4.5%", right: "4.5%", bottom: "22.5%", borderRadius: "8px" },
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
    insets: { top: "4.8%", left: "4.8%", right: "4.8%", bottom: "24.5%", borderRadius: "10px" },
    assetPattern: "/Exports/Mac Desktop/Pro Display XDR/Pro Display XDR.png"
  },
];

const catalogCategories = [
  { id: "all", label: "All", icon: null },
  { 
    id: "phone", 
    label: "Phone", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
        <path d="M12 18h.01"/>
      </svg>
    ) 
  },
  { 
    id: "tablet", 
    label: "Tablet", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" transform="rotate(90 12 12)"/>
        <path d="M12 18h.01"/>
      </svg>
    ) 
  },
  { 
    id: "laptop", 
    label: "Laptop", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/>
        <path d="M2 20h20"/>
        <path d="M12 16v4"/>
      </svg>
    ) 
  },
  { 
    id: "desktop", 
    label: "Desktop", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <rect width="20" height="14" x="2" y="3" rx="2"/>
        <line x1="8" x2="16" y1="21" y2="21"/>
        <line x1="12" x2="12" y1="17" y2="21"/>
      </svg>
    ) 
  },
  { 
    id: "watch", 
    label: "Watch", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <rect width="12" height="18" x="6" y="3" rx="3"/>
        <path d="M12 3V1"/>
        <path d="M12 23v-2"/>
        <path d="M12 7V9"/>
      </svg>
    ) 
  },
];

const solidPresets: ColorPreset[] = [
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

const gradientPresets: ColorPreset[] = [
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

const sliderSettings: {
  label: string;
  key: NumericScreenshotSetting;
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
  { label: "Rotate X", key: "rotateX", min: -45, max: 45, step: 1, unit: "deg" },
  { label: "Rotate Y", key: "rotateY", min: -45, max: 45, step: 1, unit: "deg" },
  { label: "Rotate Z", key: "rotateZ", min: -45, max: 45, step: 1, unit: "deg" },
  {
    label: "Perspective",
    key: "perspective",
    min: 300,
    max: 2000,
    step: 10,
    unit: "px",
  },
];

type Action =
  | { type: "update"; payload: Partial<EditorState> }
  | { type: "redo" }
  | { type: "undo" }
  | { type: "reset" }
  | { type: "preview" };

function reducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case "update": {
      const newPresent: EditorState = {
        ...state.present,
        ...action.payload,
      };

      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    }
    case "undo": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];

      return {
        past: state.past.slice(0, -1),
        present: previous!,
        future: [state.present, ...state.future],
      };
    }
    case "redo": {
      if (state.future.length === 0) return state;
      const next = state.future[0];

      return {
        past: [...state.past, state.present],
        present: next!,
        future: state.future.slice(1),
      };
    }
    case "reset":
      return {
        past: [],
        present: initialState,
        future: [],
      };
    default:
      return state;
  }
}

function getScreenshotSetting(
  screenshot: ScreenshotSettings | undefined,
  key: keyof typeof defaultScreenshotSettings
) {
  return screenshot?.[key] ?? defaultScreenshotSettings[key];
}

function isActivePreset(
  preset: MockupPreset,
  presentState: EditorState
) {
  const settingsMatch = Object.entries(preset.settings).every(([key, value]) => {
    const settingKey = key as keyof typeof defaultScreenshotSettings;
    return getScreenshotSetting(presentState.screenshot, settingKey) === value;
  });

  const currentFrameStyle = presentState.frameStyle ?? "none";
  let targetFrameStyle: EditorState["frameStyle"] = preset.frameStyle;
  if (presentState.deviceType === "mobile") {
    if (preset.frameStyle === "browser-light") targetFrameStyle = "phone-light";
    if (preset.frameStyle === "browser-dark") targetFrameStyle = "phone-dark";
  }
  return settingsMatch && currentFrameStyle === targetFrameStyle;
}

function BrowserHeader({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between border-b px-4 select-none shrink-0 gap-4",
        isDark
          ? "bg-[#1c1c1f] border-zinc-800/80 text-zinc-400"
          : "bg-[#f4f4f5] border-zinc-200/80 text-zinc-500"
      )}
    >
      {/* Windows controls + Back/Forward Navigation */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2.5 rounded-full bg-[#ff5f56] hover:opacity-85 transition cursor-pointer" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e] hover:opacity-85 transition cursor-pointer" />
          <span className="size-2.5 rounded-full bg-[#27c93f] hover:opacity-85 transition cursor-pointer" />
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground/60 shrink-0">
          {/* Back button */}
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hover:text-foreground cursor-pointer transition">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {/* Forward button */}
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          {/* Refresh button */}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hover:text-foreground cursor-pointer transition">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.72 2.78L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
        </div>
      </div>

      {/* Address Bar */}
      <div className="flex items-center justify-center flex-1 max-w-[280px]">
        <div
          className={cn(
            "flex h-6.5 w-full items-center justify-center rounded-md border text-[11px] font-medium tracking-wide shadow-[0_1px_2px_0px_rgba(0,0,0,0.02)] gap-1 px-2.5",
            isDark
              ? "bg-[#09090b] border-zinc-800 text-zinc-400"
              : "bg-white border-zinc-200 text-zinc-500"
          )}
        >
          {/* Lock icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="opacity-50 text-[10px] shrink-0">https://</span>
          <span className="truncate">yourwebsite.com</span>
        </div>
      </div>

      <div className="w-1/4" />
    </div>
  );
}

function resolveOklchColorsForHtml2Canvas(clonedDoc: Document) {
  const originalCanvas = document.getElementById("mockup-canvas");
  const clonedCanvas = clonedDoc.getElementById("mockup-canvas");
  if (!originalCanvas || !clonedCanvas) return;

  const tempCanvas = clonedDoc.createElement("canvas");
  const ctx = tempCanvas.getContext("2d");
  if (!ctx) return;

  const resolveColor = (colorStr: string) => {
    if (!colorStr || colorStr === "transparent" || colorStr.startsWith("rgb") || colorStr.startsWith("#")) {
      return colorStr;
    }
    try {
      ctx.fillStyle = colorStr;
      return ctx.fillStyle;
    } catch (e) {
      return colorStr;
    }
  };

  const colorProps = [
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "stroke",
    "fill",
  ];

  const originalElements = [originalCanvas, ...Array.from(originalCanvas.querySelectorAll("*"))];
  const clonedElements = [clonedCanvas, ...Array.from(clonedCanvas.querySelectorAll("*"))];

  for (let i = 0; i < originalElements.length; i++) {
    const origEl = originalElements[i] as HTMLElement;
    const cloneEl = clonedElements[i] as HTMLElement;
    if (!origEl || !cloneEl || !origEl.style || !cloneEl.style) continue;

    const computed = window.getComputedStyle(origEl);
    colorProps.forEach((prop) => {
      const val = computed[prop as any];
      if (val && (val.includes("oklch") || val.includes("oklab") || val.includes("lab") || val.includes("lch") || val.includes("color("))) {
        const resolved = resolveColor(val);
        cloneEl.style[prop as any] = resolved;
      }
    });
  }
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"background" | "colors">("background");
  const [lastSelectedImage, setLastSelectedImage] = useState<string>("/images/backgrounds/desktop/desktop-01.jpg");
  const [lastSelectedColor, setLastSelectedColor] = useState<string>("linear-gradient(135deg, #f43f5e 0%, #f97316 100%)");
  const [canvasRatio, setCanvasRatio] = useState<"16-9" | "1-1" | "9-16" | "4-3">("16-9");

  const handleResetView = () => {
    updateScreenshot({
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      zoom: 0.9,
      perspective: 1200,
    });
    toast.success("Canvas view reset successfully!");
  };

  const [state, dispatch] = useReducer(reducer, {
    past: [],
    present: initialState,
    future: [],
  });
  const [startOverOpen, setStartOverOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#f8fafc");

  const [colorSubTab, setColorSubTab] = useState<"presets" | "custom" | "saved">("presets");
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [gradientAngle, setGradientAngle] = useState<number>(135);
  const [radialShape, setRadialShape] = useState<"circle" | "ellipse">("circle");
  const [radialPosition, setRadialPosition] = useState<string>("center");
  const [radialX, setRadialX] = useState<number>(50);
  const [radialY, setRadialY] = useState<number>(50);
  const [gradientStops, setGradientStops] = useState<{ id: string; color: string; position: number }[]>([
    { id: "1", color: "#fb7185", position: 0 },
    { id: "2", color: "#f43f5e", position: 100 },
  ]);
  const [customPresetName, setCustomPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState<{ name: string; value: string }[]>([]);
 
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [activeMobileDrawer, setActiveMobileDrawer] = useState<"canvas" | "layouts" | "device" | "adjust" | "export" | null>(null);
  
  const [isDeviceCatalogOpen, setIsDeviceCatalogOpen] = useState(false);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<"all" | "phone" | "tablet" | "laptop" | "desktop" | "watch">("all");
  const [catalogDeviceColors, setCatalogDeviceColors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isDeviceCatalogOpen) {
      const initialColors: Record<string, string> = {};
      appleFrames.forEach((frame) => {
        initialColors[frame.id] = frame.colors[0]?.value ?? "silver";
      });
      if (state.present.selectedFrame) {
        initialColors[state.present.selectedFrame.id] = state.present.selectedFrame.color;
      }
      setCatalogDeviceColors(initialColors);
    }
  }, [isDeviceCatalogOpen, state.present.selectedFrame]);

  const handleCatalogDeviceColorChange = (frameId: string, colorValue: string) => {
    setCatalogDeviceColors(prev => ({
      ...prev,
      [frameId]: colorValue
    }));
    if (state.present.frameStyle === "custom-device" && state.present.selectedFrame?.id === frameId) {
      dispatch({
        type: "update",
        payload: {
          selectedFrame: {
            id: frameId,
            color: colorValue
          }
        }
      });
    }
  };

  const handleSelectAppleFrame = (frame: AppleFrame, color: string) => {
    dispatch({
      type: "update",
      payload: {
        deviceType: frame.category === "phone" ? "mobile" : "desktop",
        frameStyle: "custom-device",
        selectedFrame: {
          id: frame.id,
          color: color
        }
      }
    });
    setIsDeviceCatalogOpen(false);
    toast.success(`Applied ${frame.name} frame!`);
  };
  
  const [sectionsExpanded, setSectionsExpanded] = useState({
    layouts: true,
    frame: true,
    fineTune: true,
  });

  const toggleSection = (section: "layouts" | "frame" | "fineTune") => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleExport = async () => {
    const canvasElement = document.getElementById("mockup-canvas");
    if (!canvasElement) {
      toast.error("Mockup canvas element not found");
      return;
    }

    try {
      setIsExporting(true);
      toast.loading("Rendering mockup...", { id: "export-mockup" });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(canvasElement, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          resolveOklchColorsForHtml2Canvas(clonedDoc);
        },
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `mockup-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Mockup exported successfully!", { id: "export-mockup" });
    } catch (error) {
      console.error("Failed to export mockup", error);
      toast.error("Failed to export mockup. Please try again.", { id: "export-mockup" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const canvasElement = document.getElementById("mockup-canvas");
    if (!canvasElement) {
      toast.error("Mockup canvas element not found");
      return;
    }

    try {
      setIsCopying(true);
      toast.loading("Copying to clipboard...", { id: "copy-mockup" });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(canvasElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          resolveOklchColorsForHtml2Canvas(clonedDoc);
        },
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to generate image blob", { id: "copy-mockup" });
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);
          toast.success("Mockup copied to clipboard!", { id: "copy-mockup" });
        } catch (e) {
          console.error("Failed to copy image to clipboard", e);
          toast.error("Clipboard blocked or size too large. Try downloading instead.", { id: "copy-mockup" });
        }
      }, "image/png");
    } catch (error) {
      console.error("Failed to render mockup for clipboard", error);
      toast.error("Failed to copy image.", { id: "copy-mockup" });
    } finally {
      setIsCopying(false);
    }
  };

  // Sync tab active selection with canvas state
  const handleTabChange = (value: string) => {
    const nextTab = value as "background" | "colors";
    setActiveTab(nextTab);
    if (nextTab === "background") {
      dispatch({
        type: "update",
        payload: {
          background: lastSelectedImage,
          backgroundType: "image",
        },
      });
    } else {
      let colorVal = lastSelectedColor;
      if (colorSubTab === "custom") {
        colorVal = compileGradient(
          gradientType,
          gradientAngle,
          radialShape,
          radialPosition,
          radialX,
          radialY,
          gradientStops
        );
        setLastSelectedColor(colorVal);
      }
      dispatch({
        type: "update",
        payload: {
          background: colorVal,
          backgroundType: "color",
        },
      });
    }
  };

  // Load saved presets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mockup_custom_presets");
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved presets", e);
      }
    }
  }, []);

  const compileGradient = (
    type: "linear" | "radial",
    angle: number,
    shape: "circle" | "ellipse",
    radPos: string,
    rx: number,
    ry: number,
    stops: { color: string; position: number }[]
  ) => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");

    if (type === "linear") {
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    } else {
      const posStr = radPos === "custom" ? `${rx}% ${ry}%` : radPos;
      return `radial-gradient(${shape} at ${posStr}, ${stopsStr})`;
    }
  };

  useEffect(() => {
    if (activeTab === "colors" && colorSubTab === "custom") {
      const compiled = compileGradient(
        gradientType,
        gradientAngle,
        radialShape,
        radialPosition,
        radialX,
        radialY,
        gradientStops
      );
      setLastSelectedColor(compiled);
      dispatch({
        type: "update",
        payload: {
          background: compiled,
          backgroundType: "color"
        }
      });
    }
  }, [activeTab, colorSubTab, gradientType, gradientAngle, radialShape, radialPosition, radialX, radialY, gradientStops]);

  const saveToPresets = () => {
    const compiled = compileGradient(
      gradientType,
      gradientAngle,
      radialShape,
      radialPosition,
      radialX,
      radialY,
      gradientStops
    );
    const name = customPresetName.trim() || `My Gradient ${savedPresets.length + 1}`;
    const newPresets = [...savedPresets, { name, value: compiled }];
    setSavedPresets(newPresets);
    localStorage.setItem("mockup_custom_presets", JSON.stringify(newPresets));
    setCustomPresetName("");
  };

  const canRedo = state.future.length > 0;
  const canUndo = state.past.length > 0;
  const screenshotRadius = getScreenshotSetting(state.present.screenshot, "radius");
  const screenshotPadding = getScreenshotSetting(
    state.present.screenshot,
    "padding"
  );
  const screenshotX = getScreenshotSetting(state.present.screenshot, "x");
  const screenshotY = getScreenshotSetting(state.present.screenshot, "y");
  const screenshotRotateX = getScreenshotSetting(
    state.present.screenshot,
    "rotateX"
  );
  const screenshotRotateY = getScreenshotSetting(
    state.present.screenshot,
    "rotateY"
  );
  const screenshotRotateZ = getScreenshotSetting(
    state.present.screenshot,
    "rotateZ"
  );
  const screenshotPerspective = getScreenshotSetting(
    state.present.screenshot,
    "perspective"
  );
  const screenshotZoom = getScreenshotSetting(state.present.screenshot, "zoom");

  const handleBackgroundImageSelection = (bgUrl: string) => {
    setLastSelectedImage(bgUrl);
    dispatch({
      type: "update",
      payload: {
        background: bgUrl,
        backgroundType: "image",
      },
    });
  };

  const handleColorSelection = (value: string) => {
    setLastSelectedColor(value);
    dispatch({
      type: "update",
      payload: {
        background: value,
        backgroundType: "color",
      },
    });
  };

  const updateScreenshot = (payload: Partial<ScreenshotSettings>) => {
    dispatch({
      type: "update",
      payload: {
        screenshot: {
          ...state.present.screenshot,
          ...payload,
        },
      },
    });
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      dispatch({
        type: "update",
        payload: {
          screenshot: {
            ...state.present.screenshot,
            image: reader.result as string,
            x: screenshotX,
            y: screenshotY,
            radius: screenshotRadius,
            padding: screenshotPadding,
            zoom: screenshotZoom,
            rotateX: screenshotRotateX,
            rotateY: screenshotRotateY,
            rotateZ: screenshotRotateZ,
            perspective: screenshotPerspective,
          },
        },
      });
      toast.success("Screenshot uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const applyMockupPreset = (preset: MockupPreset) => {
    let nextFrameStyle: EditorState["frameStyle"] = preset.frameStyle;
    if (state.present.deviceType === "mobile") {
      if (preset.frameStyle === "browser-light") nextFrameStyle = "phone-light";
      if (preset.frameStyle === "browser-dark") nextFrameStyle = "phone-dark";
    }
    dispatch({
      type: "update",
      payload: {
        screenshot: {
          ...state.present.screenshot,
          ...preset.settings,
        },
        frameStyle: nextFrameStyle,
      },
    });
  };

  const handleScreenshotSliderChange =
    (key: NumericScreenshotSetting, fallback: number) => (value: number[]) => {
      updateScreenshot({ [key]: value[0] ?? fallback });
    };

  const renderCustomAppleFrame = (frameId: string, color: string) => {
    const frame = appleFrames.find(f => f.id === frameId);
    if (!frame) return null;

    const imageUrl = frame.assetPattern.replace("${color}", color);
    const insets = frame.insets;

    const renderFrameScreenshot = () => {
      if (!state.present.screenshot?.image) {
        return (
          <label className="flex w-full h-full cursor-pointer flex-col items-center justify-center gap-2 bg-zinc-900/90 hover:bg-zinc-850 transition-colors select-none p-4">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <IconUpload className="size-4 text-primary" />
            </div>
            <p className="text-[9px] font-medium text-zinc-400 text-center">Upload mockup image</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScreenshotUpload}
            />
          </label>
        );
      }
      return (
        <img
          src={state.present.screenshot.image}
          className="w-full h-full object-cover shrink-0 select-none"
          alt="Mockup Screenshot"
        />
      );
    };

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Screenshot in transparent window */}
        <div 
          className="absolute overflow-hidden bg-black"
          style={{
            top: insets.top,
            left: insets.left,
            right: insets.right,
            bottom: insets.bottom,
            borderRadius: insets.borderRadius
          }}
        >
          {renderFrameScreenshot()}
        </div>

        {/* Bezel Overlay */}
        <img
          src={imageUrl}
          className="relative w-full h-auto pointer-events-none select-none z-10 block"
          alt={frame.name}
        />
      </div>
    );
  };

  const renderFrameCatalogCard = (frame: AppleFrame) => {
    if (!frame) return null;
    const activeColor = catalogDeviceColors[frame.id] ?? frame.colors[0]?.value ?? "silver";
    const previewUrl = frame.assetPattern.replace("${color}", activeColor);

    return (
      <div 
        key={frame.id} 
        className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-750 transition group"
      >
        {/* Thumbnail Preview Area */}
        <div className="aspect-video w-full rounded-lg bg-zinc-950 flex items-center justify-center p-2 relative overflow-hidden mb-3 border border-zinc-850">
          <img
            src={previewUrl}
            className="max-h-[90%] max-w-[90%] object-contain select-none transition-transform duration-300 group-hover:scale-105"
            alt={frame.name}
          />
          
          {/* Status Badge */}
          {frame.status && (
            <span className="absolute top-1.5 right-1.5 bg-zinc-100 text-zinc-950 text-[8px] font-bold px-1.5 py-0.5 rounded-full select-none">
              {frame.status}
            </span>
          )}
        </div>

        {/* Specs and Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                {frame.brand === "Apple" && (
                  <svg className="size-3 fill-zinc-400 shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z"/>
                  </svg>
                )}
                {frame.brand === "Google" && (
                  <svg className="size-3 fill-zinc-400 shrink-0" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18 8.448 18 5.37 14.922 5.37 11.13s3.078-6.87 6.87-6.87c1.785 0 3.398.643 4.67 1.857l2.42-2.42C17.382 1.83 14.957 1 12.24 1a10.13 10.13 0 0 0-10.13 10.13 10.13 10.13 0 0 0 10.13 10.13c5.385 0 9.77-3.9 9.77-9.77 0-.61-.054-1.2-.162-1.77h-9.608z"/>
                  </svg>
                )}
                {frame.brand === "Dell" && (
                  <span className="text-[8px] font-bold border border-zinc-700 px-1 py-0.2 rounded-xs text-zinc-400 font-mono scale-90 shrink-0">DELL</span>
                )}
                <h4 className="text-xs font-semibold tracking-wide truncate">{frame.name}</h4>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 shrink-0">{frame.resolution}</span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-0.5">Aspect ratio {frame.aspectRatio}</p>
          </div>

          {/* Color Dots */}
          <div className="flex items-center gap-1.5 mt-3 mb-3">
            {frame.colors.map(col => {
              const selected = activeColor === col.value;
              return (
                <button
                  key={col.value}
                  onClick={() => handleCatalogDeviceColorChange(frame.id, col.value)}
                  className={cn(
                    "size-4 rounded-full flex items-center justify-center transition border cursor-pointer",
                    selected ? "border-zinc-100 scale-110" : "border-zinc-800 hover:border-zinc-650"
                  )}
                  title={col.name}
                >
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: col.hex }} />
                </button>
              );
            })}
          </div>

          <Button 
            size="xs" 
            className="w-full h-7 text-[10px] font-medium cursor-pointer"
            onClick={() => handleSelectAppleFrame(frame, activeColor)}
          >
            Select Frame
          </Button>
        </div>
      </div>
    );
  };

  const renderCatalogSections = () => {
    const filteredFrames = appleFrames.filter(
      (frame) => selectedCatalogCategory === "all" || frame.category === selectedCatalogCategory
    );

    const phoneFrames = filteredFrames.filter(f => f.category === "phone");
    const tabletFrames = filteredFrames.filter(f => f.category === "tablet");
    const laptopFrames = filteredFrames.filter(f => f.category === "laptop");
    const desktopFrames = filteredFrames.filter(f => f.category === "desktop");

    // Brand sub-groups
    const applePhones = phoneFrames.filter(f => f.brand === "Apple");
    const googlePhones = phoneFrames.filter(f => f.brand === "Google");
    
    const appleLaptops = laptopFrames.filter(f => f.brand === "Apple");
    const dellLaptops = laptopFrames.filter(f => f.brand === "Dell");

    return (
      <div className="space-y-8">
        {selectedCatalogCategory === "all" && (
          <div>
            <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Standard Window</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Browser Frames</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Browser Frame */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-750 transition group">
                <div className="aspect-video w-full rounded-lg bg-zinc-950 flex flex-col items-center justify-center p-3 relative overflow-hidden mb-3 border border-zinc-850">
                  {/* Miniature Browser */}
                  <div className="w-[90%] border border-zinc-800 bg-zinc-900 rounded shadow-lg overflow-hidden flex flex-col">
                    <div className="flex items-center gap-0.5 px-1 py-0.5 border-b border-zinc-850 bg-zinc-950 shrink-0">
                      <span className="size-0.5 rounded-full bg-red-500" />
                      <span className="size-0.5 rounded-full bg-yellow-500" />
                      <span className="size-0.5 rounded-full bg-green-500" />
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-zinc-700/20 to-zinc-900/20" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold">Standard Browser</h4>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Desktop Browser Window</p>
                  <Button 
                    size="xs" 
                    className="w-full mt-3 h-7 text-[10px] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: "update",
                        payload: {
                          deviceType: "desktop",
                          frameStyle: "browser-dark"
                        }
                      });
                      setIsDeviceCatalogOpen(false);
                      toast.success("Applied Browser frame!");
                    }}
                  >
                    Select Frame
                  </Button>
                </div>
              </div>

              {/* Card 2: Pro Display XDR */}
              {renderFrameCatalogCard(appleFrames.find(f => f.id === "pro-display-xdr")!)}
            </div>
          </div>
        )}

        {/* --- PHONES SECTION --- */}
        {selectedCatalogCategory === "phone" && (
          <div className="space-y-6">
            {applePhones.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <svg className="size-3.5 fill-current text-zinc-400" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z"/>
                    </svg>
                    <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">iPhone Collection</h3>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium text-[9px]">iOS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {applePhones.map(frame => renderFrameCatalogCard(frame))}
                </div>
              </div>
            )}

            {googlePhones.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <svg className="size-3.5 fill-current text-zinc-400" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18 8.448 18 5.37 14.922 5.37 11.13s3.078-6.87 6.87-6.87c1.785 0 3.398.643 4.67 1.857l2.42-2.42C17.382 1.83 14.957 1 12.24 1a10.13 10.13 0 0 0-10.13 10.13 10.13 10.13 0 0 0 10.13 10.13c5.385 0 9.77-3.9 9.77-9.77 0-.61-.054-1.2-.162-1.77h-9.608z"/>
                    </svg>
                    <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Google Pixel Collection</h3>
                  </div>
                  <span className="bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full font-medium text-[9px]">Android</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {googlePhones.map(frame => renderFrameCatalogCard(frame))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedCatalogCategory === "all" && phoneFrames.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
              <div className="flex items-center gap-2">
                <svg className="size-3.5 fill-current text-zinc-400" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z"/>
                </svg>
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">iOS & Android Smartphones</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Smartphones</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phoneFrames.map(frame => renderFrameCatalogCard(frame))}
            </div>
          </div>
        )}

        {/* --- TABLETS SECTION --- */}
        {tabletFrames.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
              <div className="flex items-center gap-2">
                <svg className="size-3.5 fill-current text-zinc-400" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z"/>
                </svg>
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">iPad Series</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Tablets</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tabletFrames.map(frame => renderFrameCatalogCard(frame))}
            </div>
          </div>
        )}

        {/* --- LAPTOPS SECTION --- */}
        {selectedCatalogCategory === "laptop" && (
          <div className="space-y-6">
            {appleLaptops.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <svg className="size-3.5 fill-current text-zinc-400" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z"/>
                    </svg>
                    <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">MacBook Lineup</h3>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-medium">macOS Laptops</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {appleLaptops.map(frame => renderFrameCatalogCard(frame))}
                </div>
              </div>
            )}

            {dellLaptops.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold border border-zinc-700 px-1 py-0.2 rounded-xs text-zinc-400 font-mono">DELL</span>
                    <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Dell XPS Collection</h3>
                  </div>
                  <span className="bg-zinc-750 text-zinc-400 px-2 py-0.5 rounded-full font-medium text-[9px]">Windows</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dellLaptops.map(frame => renderFrameCatalogCard(frame))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedCatalogCategory === "all" && laptopFrames.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 shrink-0">
                  <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/>
                  <path d="M2 20h20"/>
                  <path d="M12 16v4"/>
                </svg>
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Premium Laptops</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Laptops</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {laptopFrames.map(frame => renderFrameCatalogCard(frame))}
            </div>
          </div>
        )}

        {/* --- DESKTOPS SECTION --- */}
        {desktopFrames.length > 0 && (selectedCatalogCategory === "desktop" || selectedCatalogCategory === "all") && (
          <div>
            <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 shrink-0">
                  <rect width="20" height="14" x="2" y="3" rx="2"/>
                  <line x1="8" x2="16" y1="21" y2="21"/>
                  <line x1="12" x2="12" y1="17" y2="21"/>
                </svg>
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Mac & Desktop displays</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Monitors & Desktops</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {desktopFrames.map(frame => renderFrameCatalogCard(frame))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBackgroundAndColorsControls = () => {
    return (
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex h-full flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-2 shrink-0">
          <TabsTrigger
            value="background"
            className="data-active:border-none! data-active:bg-card! data-active:text-card-foreground!"
          >
            <IconStackForward className="size-4 mr-1.5" />
            Background
          </TabsTrigger>
          <TabsTrigger
            value="colors"
            className="data-active:border-none! data-active:bg-card! data-active:text-card-foreground!"
          >
            <IconPaintFilled className="size-4 mr-1.5" />
            Colors
          </TabsTrigger>
        </TabsList>
        <div className="min-h-0 flex-1 pt-2 flex flex-col">
          <TabsContent value="background" className="h-full flex flex-col min-h-0 flex-1">
            <ScrollArea className="flex-1 min-h-0">
              {categories.map((category) => {
                const Icon = category.icon;
                const categoryBackgrounds = backgrounds.filter(
                  (bg) => bg.category === category.id
                );

                return (
                  <div key={category.id} className="mb-4">
                    <div className="flex items-center gap-1 text-sm opacity-80">
                      <Icon className="size-4" />
                      <span>{category.label}</span>
                    </div>

                    <div className="mt-1.5 flex w-full flex-wrap">
                      {categoryBackgrounds.slice(0, 11).map((bg) => (
                        <button
                          key={bg.backgroundUrl}
                          type="button"
                          className="p-1"
                          onClick={() =>
                            handleBackgroundImageSelection(
                              bg.backgroundUrl
                            )
                          }
                          aria-label={`Use ${bg.name}`}
                        >
                          <img
                            src={bg.previewUrl}
                            alt=""
                            className={cn(
                              "size-9 rounded-md transition",
                              state.present.backgroundType === "image" &&
                                state.present.background ===
                                  bg.backgroundUrl
                                ? "ring-2 ring-primary"
                                : "hover:ring-2 hover:ring-primary/50"
                            )}
                          />
                        </button>
                      ))}

                      {categoryBackgrounds.length > 11 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="m-1 size-9 rounded-md text-xs"
                            >
                              +{categoryBackgrounds.length - 11}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            side="bottom"
                            align="start"
                            className="w-72 p-3"
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {category.label}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {categoryBackgrounds.length}
                              </span>
                            </div>

                            <ScrollArea className="h-72">
                              <div className="flex flex-wrap gap-2 pr-2">
                                {categoryBackgrounds.map((bg) => (
                                  <button
                                    key={bg.backgroundUrl}
                                    type="button"
                                    onClick={() =>
                                      handleBackgroundImageSelection(
                                        bg.backgroundUrl
                                      )
                                    }
                                    aria-label={`Use ${bg.name}`}
                                  >
                                    <img
                                      src={bg.previewUrl}
                                      alt=""
                                      className={cn(
                                        "size-9 rounded-md transition",
                                        state.present.backgroundType ===
                                          "image" &&
                                          state.present.background ===
                                            bg.backgroundUrl
                                          ? "ring-2 ring-primary"
                                          : "hover:ring-2 hover:ring-primary/50"
                                      )}
                                    />
                                  </button>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="colors" className="h-full flex flex-col min-h-0 flex-1">
            <div className="flex flex-col h-full min-h-0 pr-1 flex-1">
              {/* Sub-tab selection */}
              <div className="flex border-b border-border/40 pb-2 mb-3 gap-1 shrink-0">
                {(["presets", "custom", "saved"] as const).map((tab) => {
                  let label = "Presets";
                  if (tab === "custom") label = "Custom";
                  if (tab === "saved") label = "Saved";

                  const active = colorSubTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setColorSubTab(tab)}
                      className={cn(
                        "flex-1 pb-1.5 pt-1 text-center text-xs font-medium border-b-2 transition-all",
                        active
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <ScrollArea className="flex-1 min-h-0">
                {colorSubTab === "presets" && (
                  <div className="space-y-6 pr-2">
                    {/* Solids Section */}
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Solid Presets</span>
                        <span className="text-[10px] text-muted-foreground/80 font-normal">{solidPresets.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {solidPresets.map((color) => {
                          const isSelected =
                            state.present.backgroundType === "color" &&
                            state.present.background === color.value;

                          return (
                            <button
                              key={color.name}
                              type="button"
                              className={cn(
                                "group relative overflow-hidden rounded-lg border bg-card p-2 text-left transition",
                                isSelected
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-border hover:border-primary/50"
                              )}
                              onClick={() => handleColorSelection(color.value)}
                            >
                              <span
                                className="mb-1.5 block h-10 rounded-md border border-black/5"
                                style={{ background: color.value }}
                              />
                              <span className="block truncate text-[11px] font-medium">
                                {color.name}
                              </span>
                              {isSelected && (
                                <span className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm">
                                  <IconCheck className="size-3" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Gradients Section */}
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Gradient Presets</span>
                        <span className="text-[10px] text-muted-foreground/80 font-normal">{gradientPresets.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {gradientPresets.map((color) => {
                          const isSelected =
                            state.present.backgroundType === "color" &&
                            state.present.background === color.value;

                          return (
                            <button
                              key={color.name}
                              type="button"
                              className={cn(
                                "group relative overflow-hidden rounded-lg border bg-card p-2 text-left transition",
                                isSelected
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-border hover:border-primary/50"
                              )}
                              onClick={() => handleColorSelection(color.value)}
                            >
                              <span
                                className="mb-1.5 block h-10 rounded-md border border-black/5"
                                style={{ background: color.value }}
                              />
                              <span className="block truncate text-[11px] font-medium">
                                {color.name}
                              </span>
                              {isSelected && (
                                <span className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm">
                                  <IconCheck className="size-3" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Legacy Custom Color - as simple quick picker */}
                    <div className="rounded-lg border bg-card p-3">
                      <Label htmlFor="custom-color" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Quick Custom Color
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="relative size-9 shrink-0 rounded-md overflow-hidden border border-border cursor-pointer">
                          <input
                            id="custom-color"
                            type="color"
                            value={customColor}
                            onChange={(event) => {
                              setCustomColor(event.target.value);
                              handleColorSelection(event.target.value);
                            }}
                            className="absolute inset-0 size-full cursor-pointer opacity-0"
                            aria-label="Choose custom background color"
                          />
                          <div className="size-full" style={{ backgroundColor: customColor }} />
                        </div>
                        <Input
                          value={customColor}
                          onChange={(event) => setCustomColor(event.target.value)}
                          onBlur={() => handleColorSelection(customColor)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              handleColorSelection(customColor);
                            }
                          }}
                          placeholder="#f8fafc"
                          className="font-mono text-xs h-9"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {colorSubTab === "custom" && (
                  <div className="space-y-4 pr-2">
                    {/* Preview box */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Gradient Preview</Label>
                      <div
                        className="h-14 w-full rounded-lg border border-border shadow-inner"
                        style={{
                          background: compileGradient(
                            gradientType,
                            gradientAngle,
                            radialShape,
                            radialPosition,
                            radialX,
                            radialY,
                            gradientStops
                          ),
                        }}
                      />
                    </div>

                    {/* Gradient Type */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Gradient Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["linear", "radial"] as const).map((type) => (
                          <Button
                            key={type}
                            type="button"
                            variant={gradientType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGradientType(type)}
                            className="text-xs h-8 capitalize"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Linear Controls */}
                    {gradientType === "linear" && (
                      <div className="py-2 border-y border-border/30">
                        <SliderDemo
                          label="Angle"
                          value={[gradientAngle]}
                          setValue={(val) => setGradientAngle(val[0] ?? 0)}
                          min={0}
                          max={360}
                          step={1}
                          unit="°"
                        />
                      </div>
                    )}

                    {/* Radial Controls */}
                    {gradientType === "radial" && (
                      <div className="space-y-4 py-2 border-y border-border/30">
                        <div>
                          <Label className="text-[11px] text-muted-foreground mb-1.5 block">Radial Shape</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {(["circle", "ellipse"] as const).map((shape) => (
                              <Button
                                key={shape}
                                type="button"
                                variant={radialShape === shape ? "default" : "outline"}
                                size="xs"
                                onClick={() => setRadialShape(shape)}
                                className="text-[11px] h-7 capitalize"
                              >
                                {shape}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-[11px] text-muted-foreground mb-1.5 block">Position Preset</Label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { id: "top left", label: "Top L" },
                              { id: "top", label: "Top" },
                              { id: "top right", label: "Top R" },
                              { id: "left", label: "Left" },
                              { id: "center", label: "Center" },
                              { id: "right", label: "Right" },
                              { id: "bottom left", label: "Bottom L" },
                              { id: "bottom", label: "Bottom" },
                              { id: "bottom right", label: "Bottom R" },
                            ].map((pos) => (
                              <Button
                                key={pos.id}
                                type="button"
                                variant={radialPosition === pos.id ? "default" : "outline"}
                                size="xs"
                                onClick={() => setRadialPosition(pos.id)}
                                className="text-[10px] h-6 px-1"
                              >
                                {pos.label}
                              </Button>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant={radialPosition === "custom" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRadialPosition("custom")}
                            className="text-[11px] w-full mt-2 h-7"
                          >
                            Custom Origin Offset
                          </Button>
                        </div>

                        {radialPosition === "custom" && (
                          <div className="space-y-4 p-2 rounded-lg border bg-zinc-950/20">
                            <SliderDemo
                              label="Origin X"
                              value={[radialX]}
                              setValue={(val) => setRadialX(val[0] ?? 50)}
                              min={0}
                              max={100}
                              step={1}
                              unit="%"
                            />
                            <SliderDemo
                              label="Origin Y"
                              value={[radialY]}
                              setValue={(val) => setRadialY(val[0] ?? 50)}
                              min={0}
                              max={100}
                              step={1}
                              unit="%"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Color Stops Manager */}
                    <div className="space-y-2.5">
                      <Label className="text-xs text-muted-foreground block">Color Stops</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {gradientStops.map((stop) => (
                          <div key={stop.id} className="flex items-center gap-2.5">
                            {/* Color Indicator */}
                            <div className="relative size-8 shrink-0 rounded-md overflow-hidden border border-border shadow-xs cursor-pointer">
                              <input
                                type="color"
                                value={stop.color}
                                onChange={(e) => {
                                  const newStops = gradientStops.map((s) =>
                                    s.id === stop.id ? { ...s, color: e.target.value } : s
                                  );
                                  setGradientStops(newStops);
                                }}
                                className="absolute inset-0 size-full cursor-pointer opacity-0"
                              />
                              <div className="size-full" style={{ backgroundColor: stop.color }} />
                            </div>

                            {/* Position range slider */}
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={stop.position}
                              onChange={(e) => {
                                  const newStops = gradientStops.map((s) =>
                                    s.id === stop.id ? { ...s, position: parseInt(e.target.value) } : s
                                  );
                                  setGradientStops(newStops);
                              }}
                              className="flex-1 min-w-0 accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                            />

                            {/* Precise percentage input */}
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={stop.position}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                const newStops = gradientStops.map((s) =>
                                  s.id === stop.id ? { ...s, position: val } : s
                                );
                                setGradientStops(newStops);
                              }}
                              className="w-14 text-center h-8 text-[11px] font-mono px-1! shrink-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />

                            {/* Delete Stop */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (gradientStops.length > 2) {
                                  setGradientStops(gradientStops.filter((s) => s.id !== stop.id));
                                }
                              }}
                              disabled={gradientStops.length <= 2}
                              className="size-8 text-muted-foreground hover:text-destructive shrink-0"
                            >
                              <IconTrash className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-xs flex items-center justify-center gap-1 h-8 mt-2"
                        onClick={() => {
                          const id = Math.random().toString(36).substring(2, 9);
                          const sorted = [...gradientStops].sort((a, b) => a.position - b.position);
                          let newPos = 50;
                          if (sorted.length >= 2) {
                            let maxGap = -1;
                            let insertAfter = 0;
                            for (let i = 0; i < sorted.length - 1; i++) {
                              const gap = sorted[i + 1]!.position - sorted[i]!.position;
                              if (gap > maxGap) {
                                maxGap = gap;
                                insertAfter = i;
                              }
                            }
                            newPos = Math.round((sorted[insertAfter]!.position + sorted[insertAfter + 1]!.position) / 2);
                          }

                          setGradientStops([
                            ...gradientStops,
                            { id, color: "#ffffff", position: newPos },
                          ]);
                        }}
                      >
                        <IconPlus className="size-3.5" />
                        Add Color Stop
                      </Button>
                    </div>

                    {/* Save to Presets */}
                    <div className="pt-3 border-t border-border/30 mt-4 flex items-center justify-between gap-2">
                      <Input
                        placeholder="Preset Name"
                        value={customPresetName}
                        onChange={(e) => setCustomPresetName(e.target.value)}
                        className="text-xs h-8 flex-1"
                      />
                      <Button
                        type="button"
                        onClick={saveToPresets}
                        className="text-xs h-8 shrink-0 bg-primary/95 text-primary-foreground hover:bg-primary font-medium"
                      >
                        <IconHeart className="size-3.5 mr-1" />
                        Save Preset
                      </Button>
                    </div>
                  </div>
                )}

                {colorSubTab === "saved" && (
                  <div className="space-y-4 pr-2">
                    {savedPresets.length === 0 ? (
                      <div className="text-center py-10 px-4 border border-dashed rounded-lg bg-card/40">
                        <IconPalette className="size-8 text-muted-foreground/60 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-muted-foreground">No saved presets yet</p>
                        <p className="text-[10px] text-muted-foreground/75 mt-1.5 leading-normal">
                          Design a custom gradient on the "Custom" tab and click "Save Preset" to store it here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {savedPresets.map((color, index) => {
                          const isSelected =
                            state.present.backgroundType === "color" &&
                            state.present.background === color.value;

                          return (
                            <div
                              key={index}
                              className={cn(
                                "group relative overflow-hidden rounded-lg border bg-card p-2 text-left transition",
                                isSelected
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <button
                                type="button"
                                className="w-full text-left cursor-pointer"
                                onClick={() => handleColorSelection(color.value)}
                              >
                                <span
                                  className="mb-1.5 block h-10 rounded-md border border-black/5"
                                  style={{ background: color.value }}
                                />
                                <span className="block truncate text-[11px] font-medium pr-5">
                                  {color.name}
                                </span>
                              </button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newPresets = savedPresets.filter((_, i) => i !== index);
                                  setSavedPresets(newPresets);
                                  localStorage.setItem("mockup_custom_presets", JSON.stringify(newPresets));
                                }}
                                className="absolute right-1 bottom-1 size-5 text-muted-foreground hover:text-destructive rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <IconTrash className="size-3" />
                              </Button>

                              {isSelected && (
                                <span className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm">
                                  <IconCheck className="size-3" />
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    );
  };

  const renderLayoutsControls = () => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {mockupPresets.map((preset) => {
          const active = isActivePreset(preset, state.present);
          
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyMockupPreset(preset)}
              className={cn(
                "group relative rounded-lg border bg-card p-1.5 text-left transition select-none cursor-pointer",
                active
                  ? "border-primary ring-1 ring-primary/20 bg-primary/5"
                  : "border-border/60 hover:border-primary/50"
              )}
            >
              <div className="relative mb-1.5 aspect-video overflow-hidden rounded-md bg-muted">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      state.present.backgroundType === "color"
                        ? state.present.background
                        : `url(${state.present.background}) center/cover no-repeat`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-[72%] overflow-hidden border border-white/40 bg-background shadow-xl flex flex-col"
                    style={{
                      borderRadius: `${Math.max(
                        preset.settings.radius / 3,
                        4
                      )}px`,
                      padding: `${Math.min(
                        preset.settings.padding / 4,
                        8
                      )}px`,
                      transform: `
                        perspective(${preset.settings.perspective / 2}px)
                        translate(${preset.settings.x / 5}px, ${preset.settings.y / 5}px)
                        rotateX(${preset.settings.rotateX}deg)
                        rotateY(${preset.settings.rotateY}deg)
                        rotateZ(${preset.settings.rotateZ}deg)
                        scale(${preset.settings.zoom})
                      `,
                    }}
                  >
                    {preset.frameStyle && preset.frameStyle !== "none" && (
                      <div
                        className={cn(
                          "flex h-2 w-full items-center justify-between border-b px-0.5 select-none shrink-0",
                          preset.frameStyle === "browser-dark"
                            ? "bg-zinc-900 border-zinc-800 text-[2px]"
                            : "bg-zinc-100 border-zinc-200 text-[2px]"
                        )}
                      >
                        <div className="flex items-center gap-0.5 w-1/3">
                          <span className="size-0.5 rounded-full bg-red-400" />
                          <span className="size-0.5 rounded-full bg-yellow-400" />
                          <span className="size-0.5 rounded-full bg-green-400" />
                        </div>
                        <div className="h-0.5 w-5 rounded-xs bg-black/10" />
                        <div className="w-1/3" />
                      </div>
                    )}
                    <div className="aspect-video rounded-[inherit] bg-gradient-to-br from-foreground/60 via-foreground/20 to-background" />
                  </div>
                </div>
                {active && (
                  <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm">
                    <IconCheck className="size-2.5" />
                  </span>
                )}
              </div>
              <div className="min-w-0 px-0.5">
                <div className="truncate text-[11px] font-medium leading-tight">
                  {preset.name}
                </div>
                <div className="truncate text-[9px] text-muted-foreground mt-0.5">
                  {preset.detail}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderDeviceFrameControls = () => {
    return (
      <div className="flex flex-col gap-4 text-xs">
        {/* Device Type Select */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Device Mockup Type</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["desktop", "mobile"] as const).map((device) => {
              const active = (state.present.deviceType ?? "desktop") === device;
              return (
                <Button
                  key={device}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-9 text-[11px] font-medium cursor-pointer transition flex items-center justify-center gap-1.5",
                    active ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/40"
                  )}
                  onClick={() => {
                    let nextFrameStyle: EditorState["frameStyle"] = "none";
                    const currentStyle = state.present.frameStyle ?? "none";
                    if (device === "mobile") {
                      if (currentStyle === "browser-light") nextFrameStyle = "phone-light";
                      if (currentStyle === "browser-dark") nextFrameStyle = "phone-dark";
                      if (currentStyle === "none") nextFrameStyle = "none";
                    } else {
                      if (currentStyle === "phone-light") nextFrameStyle = "browser-light";
                      if (currentStyle === "phone-dark") nextFrameStyle = "browser-dark";
                      if (currentStyle === "none") nextFrameStyle = "none";
                    }
                    dispatch({
                      type: "update",
                      payload: {
                        deviceType: device,
                        frameStyle: nextFrameStyle,
                      },
                    });
                  }}
                >
                  {device === "desktop" ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <rect width="20" height="14" x="2" y="3" rx="2"/>
                        <line x1="8" x2="16" y1="21" y2="21"/>
                        <line x1="12" x2="12" y1="17" y2="21"/>
                      </svg>
                      <span>Desktop</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                        <path d="M12 18h.01"/>
                      </svg>
                      <span>Mobile</span>
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Bezel Style Select */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Frame Bezel Style</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {state.present.deviceType === "mobile" ? (
              (["none", "phone-light", "phone-dark"] as const).map((styleName) => {
                const currentStyle = state.present.frameStyle ?? "none";
                const active = currentStyle === styleName;
                let label = "None";
                let icon = null;
                if (styleName === "phone-light") {
                  label = "Light";
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                    </svg>
                  );
                } else if (styleName === "phone-dark") {
                  label = "Dark";
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                  );
                } else {
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                    </svg>
                  );
                }

                return (
                  <Button
                    key={styleName}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    className="text-[11px] h-8.5 px-1 leading-none cursor-pointer flex items-center justify-center gap-1"
                    onClick={() =>
                      dispatch({
                        type: "update",
                        payload: { frameStyle: styleName },
                      })
                    }
                  >
                    {icon}
                    <span>{label}</span>
                  </Button>
                );
              })
            ) : (
              (["none", "browser-light", "browser-dark"] as const).map((styleName) => {
                const currentStyle = state.present.frameStyle ?? "none";
                const active = currentStyle === styleName;
                let label = "None";
                let icon = null;
                if (styleName === "browser-light") {
                  label = "Light";
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                    </svg>
                  );
                } else if (styleName === "browser-dark") {
                  label = "Dark";
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                  );
                } else {
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                    </svg>
                  );
                }

                return (
                  <Button
                    key={styleName}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    className="text-[11px] h-8.5 px-1 leading-none cursor-pointer flex items-center justify-center gap-1"
                    onClick={() =>
                      dispatch({
                        type: "update",
                        payload: { frameStyle: styleName },
                      })
                    }
                  >
                    {icon}
                    <span>{label}</span>
                  </Button>
                );
              })
            )}
          </div>
        </div>

        {/* Choose Device Frame Catalog Trigger */}
        <div className="pt-2.5 border-t border-border/40 mt-1 flex flex-col gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsDeviceCatalogOpen(true)}
            className="w-full text-[11px] h-9 font-medium flex items-center justify-center gap-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 border-primary/20 text-foreground"
          >
            <IconDeviceLaptop className="size-4 text-primary animate-pulse" />
            Choose Device Frame...
          </Button>

          {state.present.frameStyle === "custom-device" && state.present.selectedFrame && (
            <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Active Device</span>
                <span className="text-[10px] font-medium text-foreground truncate">
                  {appleFrames.find(f => f.id === state.present.selectedFrame?.id)?.name} ({state.present.selectedFrame.color})
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  dispatch({
                    type: "update",
                    payload: {
                      frameStyle: "none"
                    }
                  });
                }}
                className="size-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 cursor-pointer"
                title="Remove custom frame"
              >
                <IconX className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFineTuneControls = () => {
    return (
      <div className="flex flex-col gap-4">
        {sliderSettings.map((setting) => {
          const value = getScreenshotSetting(
            state.present.screenshot,
            setting.key
          );

          return (
            <SliderDemo
              key={setting.key}
              label={setting.label}
              value={[value]}
              setValue={handleScreenshotSliderChange(
                setting.key,
                value
              )}
              min={setting.min}
              max={setting.max}
              step={setting.step}
              unit={setting.unit}
            />
          );
        })}
      </div>
    );
  };

  const renderExportActionsControls = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Actions</span>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              {isExporting ? (
                <IconLoader2 className="size-4 animate-spin mr-1" />
              ) : (
                <IconArrowDownToArc className="size-4 mr-1" />
              )}
              Export PNG
            </Button>
            
            <Button
              onClick={handleCopyToClipboard}
              disabled={isCopying}
              variant="outline"
              className="h-9 px-3 text-xs"
              title="Copy to clipboard"
            >
              {isCopying ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconCopy className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderBackground = () => {
    if (state.present.backgroundType === "color") {
      return (
        <div
          className="absolute inset-0"
          style={{ background: state.present.background }}
        />
      );
    }

    return (
      <img
        src={state.present.background}
        alt="mockup background"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  };

  return (
    <main className="flex h-svh w-svw flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <SidebarProvider style={{ minHeight: "100%", height: "100%" }} className="overflow-hidden">
          <Sidebar className="w-72 hidden lg:flex" style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
            <SidebarContent className="flex h-full flex-col p-2">
              {renderBackgroundAndColorsControls()}
            </SidebarContent>
          </Sidebar>

          <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-14 w-full items-center justify-between lg:justify-center shrink-0 border-b border-border/40 bg-background/50 backdrop-blur-md px-4 gap-2 lg:gap-4 select-none">
              {/* Undo/Redo */}
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/20">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-sm"
                      disabled={!canUndo}
                      onClick={() => dispatch({ type: "undo" })}
                      variant="ghost"
                      className="size-8 rounded-md"
                    >
                      <IconArrowBackUp className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-sm"
                      disabled={!canRedo}
                      onClick={() => dispatch({ type: "redo" })}
                      variant="ghost"
                      className="size-8 rounded-md"
                    >
                      <IconArrowBackUp className="rotate-180 rotate-x-180 size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo</TooltipContent>
                </Tooltip>
              </div>

              <div className="hidden lg:block h-4 w-px bg-border/40" />

              {/* Canvas Aspect Ratio selector - Hidden on Mobile, handled in Canvas Drawer */}
              <div className="hidden lg:flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/20 text-xs">
                {(["16-9", "1-1", "4-3", "9-16"] as const).map((ratio) => {
                  let label = "16:9";
                  if (ratio === "1-1") label = "1:1";
                  if (ratio === "4-3") label = "4:3";
                  if (ratio === "9-16") label = "9:16";

                  const active = canvasRatio === ratio;
                  return (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setCanvasRatio(ratio)}
                      className={cn(
                        "h-7 px-2.5 rounded-md font-medium transition cursor-pointer select-none text-[11px]",
                        active
                          ? "bg-background text-foreground shadow-xs border border-border/10"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:block h-4 w-px bg-border/40" />

              {/* View Resets & Action Buttons */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleResetView} className="h-9 px-2 lg:px-3 gap-1.5 text-xs font-medium cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                      </svg>
                      <span className="hidden lg:inline">Reset view</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset 3D translations & zoom to defaults</TooltipContent>
                </Tooltip>

                <Popover onOpenChange={setStartOverOpen} open={startOverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 px-2 lg:px-3 text-xs cursor-pointer">
                      <span className="hidden lg:inline">Start over</span>
                      <span className="inline lg:hidden">Reset</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="flex flex-col gap-3 p-2">
                      <span className="text-xs font-medium text-foreground">Are you sure you want to reset everything?</span>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Button size="sm" variant="ghost" onClick={() => setStartOverOpen(false)} className="h-8 text-xs cursor-pointer">
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 text-xs cursor-pointer"
                          onClick={() => {
                            dispatch({ type: "reset" });
                            setCanvasRatio("16-9");
                            setStartOverOpen(false);
                            toast.success("Editor reset!");
                          }}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsPreviewOpen(true)} className="size-9 cursor-pointer">
                      <IconArrowsMaximize className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fullscreen Preview</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-zinc-950/[0.015] bg-[radial-gradient(#e4e4e7_1.2px,transparent_1.2px)] [background-size:16px_16px] dark:bg-zinc-950/20 dark:bg-[radial-gradient(#27272a_1.2px,transparent_1.2px)] transition-all duration-300">
              <div
                id="mockup-canvas"
                style={{
                  aspectRatio: canvasRatio === "16-9" ? "16/9" : canvasRatio === "1-1" ? "1/1" : canvasRatio === "9-16" ? "9/16" : "4/3",
                }}
                className={cn(
                  "relative m-4 mx-auto overflow-hidden rounded-xl bg-zinc-900 shadow-2xl transition-all duration-300 max-w-full max-h-[calc(100svh-14rem)] flex items-center justify-center",
                  canvasRatio === "16-9" && "w-[min(90%,56rem,calc((100svh-14rem)*1.7777))]",
                  canvasRatio === "1-1" && "w-[min(90%,34rem,calc(100svh-14rem))]",
                  canvasRatio === "9-16" && "w-[min(90%,21rem,calc((100svh-14rem)*0.5625))]",
                  canvasRatio === "4-3" && "w-[min(90%,46rem,calc((100svh-14rem)*1.3333))]"
                )}
              >
                {renderBackground()}
                <div className="absolute inset-0 flex items-center justify-center">
                  {state.present.frameStyle === "custom-device" && state.present.selectedFrame ? (
                    (() => {
                      const frame = appleFrames.find(f => f.id === state.present.selectedFrame?.id);
                      const category = frame?.category ?? "phone";
                      return (
                        <div
                          className={cn(
                            "mockup-card transition-all duration-300 relative flex flex-col items-center justify-center",
                            (category === "laptop" || category === "desktop") ? (
                              canvasRatio === "16-9" ? "w-[80%] max-w-4xl" :
                              canvasRatio === "4-3" ? "w-[82%] max-w-3xl" :
                              canvasRatio === "1-1" ? "w-[85%] max-w-2xl" :
                              "w-[90%] max-w-md"
                            ) : category === "tablet" ? (
                              canvasRatio === "16-9" ? "w-[40%] max-w-[380px]" :
                              canvasRatio === "4-3" ? "w-[48%] max-w-[420px]" :
                              canvasRatio === "1-1" ? "w-[58%] max-w-[460px]" :
                              "w-[75%] max-w-[360px]"
                            ) : (
                              // Phone & Watch
                              canvasRatio === "16-9" ? "w-[24%] max-w-[220px]" :
                              canvasRatio === "4-3" ? "w-[30%] max-w-[240px]" :
                              canvasRatio === "1-1" ? "w-[48%] max-w-[260px]" :
                              "w-[75%] max-w-[280px]"
                            )
                          )}
                      style={{
                        transform: `
                          perspective(${screenshotPerspective}px)
                          translate(${screenshotX}px, ${screenshotY}px)
                          rotateX(${screenshotRotateX}deg)
                          rotateY(${screenshotRotateY}deg)
                          rotateZ(${screenshotRotateZ}deg)
                          scale(${screenshotZoom})
                        `,
                      }}
                    >
                      {renderCustomAppleFrame(state.present.selectedFrame.id, state.present.selectedFrame.color)}
                        </div>
                      );
                    })()
                  ) : state.present.deviceType === "mobile" ? (
                    /* Mobile Mockup Card */
                    <div
                      className={cn(
                        "mockup-card transition-all duration-300 relative shadow-2xl flex flex-col items-center justify-center",
                        canvasRatio === "16-9" && "w-[24%] max-w-[220px]",
                        canvasRatio === "4-3" && "w-[30%] max-w-[240px]",
                        canvasRatio === "1-1" && "w-[48%] max-w-[260px]",
                        canvasRatio === "9-16" && "w-[75%] max-w-[280px]"
                      )}
                      style={{
                        transform: `
                          perspective(${screenshotPerspective}px)
                          translate(${screenshotX}px, ${screenshotY}px)
                          rotateX(${screenshotRotateX}deg)
                          rotateY(${screenshotRotateY}deg)
                          rotateZ(${screenshotRotateZ}deg)
                          scale(${screenshotZoom})
                        `,
                      }}
                    >
                      {/* Phone Frame Wrapper */}
                      <div
                        className={cn(
                          "w-full rounded-[38px] p-[6px] transition-all duration-300 shadow-2xl relative",
                          state.present.frameStyle === "phone-light" ? "bg-zinc-200 shadow-zinc-400/20" : 
                          state.present.frameStyle === "phone-dark" ? "bg-zinc-800 shadow-black/40" : 
                          "bg-transparent p-0"
                        )}
                      >
                        {/* Inner Bezel (Black Ring around screen) */}
                        <div
                          className={cn(
                            "w-full rounded-[32px] overflow-hidden aspect-[9/19.5] relative bg-black",
                            state.present.frameStyle === "none" && "rounded-xl"
                          )}
                          style={state.present.frameStyle === "none" ? { borderRadius: `${screenshotRadius}px` } : {}}
                        >
                          {/* Dynamic Island */}
                          {(state.present.frameStyle === "phone-light" || state.present.frameStyle === "phone-dark") && (
                            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-3.5 rounded-full bg-black z-20 flex items-center justify-center">
                              <span className="size-1 rounded-full bg-[#111] absolute right-2.5 opacity-60 ring-1 ring-blue-900/30" />
                            </div>
                          )}

                          {/* Home Indicator */}
                          {(state.present.frameStyle === "phone-light" || state.present.frameStyle === "phone-dark") && (
                            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/30 z-20" />
                          )}

                          {!state.present.screenshot?.image ? (
                            <label className="flex aspect-[9/19.5] w-full cursor-pointer flex-col items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 transition-colors">
                              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                                <IconUpload className="size-5 text-primary" />
                              </div>
                              <p className="text-[9px] font-medium text-zinc-400">Upload screenshot</p>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleScreenshotUpload}
                              />
                            </label>
                          ) : (
                            <img
                              src={state.present.screenshot.image}
                              className="aspect-[9/19.5] w-full object-cover"
                              alt="Mobile Screenshot"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Desktop Mockup Card */
                    <div
                      className={cn(
                        "mockup-card overflow-hidden drop-shadow-[0_40px_60px_rgba(0,0,0,.35)] flex flex-col bg-background",
                        canvasRatio === "16-9" && "w-[85%] max-w-4xl",
                        canvasRatio === "4-3" && "w-[88%] max-w-3xl",
                        canvasRatio === "1-1" && "w-[90%] max-w-2xl",
                        canvasRatio === "9-16" && "w-[94%] max-w-md"
                      )}
                      style={{
                        borderRadius: `${screenshotRadius}px`,
                        padding: `${screenshotPadding}px`,
                        transform: `
                          perspective(${screenshotPerspective}px)
                          translate(${screenshotX}px, ${screenshotY}px)
                          rotateX(${screenshotRotateX}deg)
                          rotateY(${screenshotRotateY}deg)
                          rotateZ(${screenshotRotateZ}deg)
                          scale(${screenshotZoom})
                        `,
                      }}
                    >
                      {state.present.frameStyle && 
                       state.present.frameStyle !== "none" && 
                       state.present.frameStyle !== "phone-light" && 
                       state.present.frameStyle !== "phone-dark" && (
                        <BrowserHeader theme={state.present.frameStyle === "browser-light" ? "light" : "dark"} />
                      )}
                       {!state.present.screenshot?.image ? (
                        <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-md border border-dashed border-border/60 bg-background/50 transition-all hover:border-primary hover:bg-background backdrop-blur-sm p-4 overflow-hidden">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <IconUpload className="size-5 text-primary" />
                          </div>
                          <div className="text-center px-2">
                            <p className="font-medium text-xs sm:text-sm">Upload screenshot</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Drag & drop or click to browse</p>
                            <p className="text-[9px] text-muted-foreground/60 mt-1">PNG, JPG, WEBP</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleScreenshotUpload}
                          />
                        </label>
                      ) : (
                        <img
                          src={state.present.screenshot.image}
                          className="aspect-video w-full object-cover"
                          alt="Screenshot"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden flex h-16 w-full items-center justify-around border-t border-border/40 bg-background/80 backdrop-blur-md px-2 pb-safe select-none shrink-0 z-40">
              <button
                type="button"
                onClick={() => setActiveMobileDrawer("canvas")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors py-1 px-3 rounded-md cursor-pointer",
                  activeMobileDrawer === "canvas" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconPalette className="size-5" />
                <span>Canvas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMobileDrawer("layouts")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors py-1 px-3 rounded-md cursor-pointer",
                  activeMobileDrawer === "layouts" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconStackForward className="size-5" />
                <span>Layouts</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMobileDrawer("device")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors py-1 px-3 rounded-md cursor-pointer",
                  activeMobileDrawer === "device" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconDeviceLaptop className="size-5" />
                <span>Device</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMobileDrawer("adjust")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors py-1 px-3 rounded-md cursor-pointer",
                  activeMobileDrawer === "adjust" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconSettings className="size-5" />
                <span>Adjust</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMobileDrawer("export")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors py-1 px-3 rounded-md cursor-pointer",
                  activeMobileDrawer === "export" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconArrowDownToArc className="size-5" />
                <span>Export</span>
              </button>
            </div>

            {/* Mobile Drawer */}
            <Drawer open={activeMobileDrawer !== null} onOpenChange={(open: boolean) => !open && setActiveMobileDrawer(null)}>
              <DrawerContent className="p-4 pt-2">
                <DrawerHeader className="px-1 py-3 text-left">
                  <DrawerTitle className="text-sm font-semibold capitalize flex items-center justify-between">
                    <span>
                      {activeMobileDrawer === "canvas" && "Canvas Settings"}
                      {activeMobileDrawer === "layouts" && "Mockup Layouts"}
                      {activeMobileDrawer === "device" && "Device & Bezel Frame"}
                      {activeMobileDrawer === "adjust" && "Fine Tune Mockup"}
                      {activeMobileDrawer === "export" && "Export Actions"}
                    </span>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-full cursor-pointer">
                        <IconX className="size-4" />
                      </Button>
                    </DrawerClose>
                  </DrawerTitle>
                </DrawerHeader>
                <div className="max-h-[50vh] overflow-y-auto pb-6 px-1">
                  {activeMobileDrawer === "canvas" && (
                    <div className="space-y-4">
                      <div className="pb-3 border-b border-border/40">
                        <span className="text-[10px] text-muted-foreground block mb-2 uppercase font-semibold">Canvas Aspect Ratio</span>
                        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/20 text-xs">
                          {(["16-9", "1-1", "4-3", "9-16"] as const).map((ratio) => {
                            let label = "16:9";
                            if (ratio === "1-1") label = "1:1";
                            if (ratio === "4-3") label = "4:3";
                            if (ratio === "9-16") label = "9:16";

                            const active = canvasRatio === ratio;
                            return (
                              <button
                                key={ratio}
                                type="button"
                                onClick={() => setCanvasRatio(ratio)}
                                className={cn(
                                  "h-7 px-2.5 rounded-md font-medium transition cursor-pointer select-none text-[11px] flex-1 text-center",
                                  active
                                    ? "bg-background text-foreground shadow-xs border border-border/10"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="h-[40vh] flex flex-col">
                        {renderBackgroundAndColorsControls()}
                      </div>
                    </div>
                  )}
                  {activeMobileDrawer === "layouts" && renderLayoutsControls()}
                  {activeMobileDrawer === "device" && renderDeviceFrameControls()}
                  {activeMobileDrawer === "adjust" && renderFineTuneControls()}
                  {activeMobileDrawer === "export" && renderExportActionsControls()}
                </div>
              </DrawerContent>
            </Drawer>
          </main>

          <Sidebar side="right" className="w-80 border-l border-border/50 hidden lg:flex" style={{ "--sidebar-width": "20rem" } as React.CSSProperties}>
            <SidebarContent className="flex h-full flex-col p-3 gap-3 overflow-hidden">
              {/* Header Action Bar */}
              <div className="flex flex-col gap-2 shrink-0 pb-2 border-b border-border/40">
                <div className="font-semibold text-[10px] tracking-wide text-muted-foreground uppercase">Actions</div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex-1 text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  >
                    {isExporting ? (
                      <IconLoader2 className="size-4 animate-spin mr-1" />
                    ) : (
                      <IconArrowDownToArc className="size-4 mr-1" />
                    )}
                    Export PNG
                  </Button>
                  
                  <Button
                    onClick={handleCopyToClipboard}
                    disabled={isCopying}
                    variant="outline"
                    className="h-9 px-3 text-xs"
                    title="Copy to clipboard"
                  >
                    {isCopying ? (
                      <IconLoader2 className="size-4 animate-spin" />
                    ) : (
                      <IconCopy className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Scrollable controls */}
              <ScrollArea className="flex-1 min-h-0 pr-1">
                <div className="space-y-4 pb-4">
                  
                  {/* Section 1: Mockup Layouts */}
                  <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
                    <button
                      type="button"
                      onClick={() => toggleSection("layouts")}
                      className="flex items-center justify-between w-full p-2.5 text-left font-medium text-xs text-foreground bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-muted/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {mockupPresets.length}
                        </span>
                        <span>Mockup Layouts</span>
                      </div>
                      {sectionsExpanded.layouts ? (
                        <IconChevronDown className="size-3.5 text-muted-foreground" />
                      ) : (
                        <IconChevronRight className="size-3.5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {sectionsExpanded.layouts && (
                      <div className="p-2 border-t border-border/40 bg-card/10">
                        {renderLayoutsControls()}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Frame Style */}
                  <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
                    <button
                      type="button"
                      onClick={() => toggleSection("frame")}
                      className="flex items-center justify-between w-full p-2.5 text-left font-medium text-xs text-foreground bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <span>Device & Bezel Frame</span>
                      {sectionsExpanded.frame ? (
                        <IconChevronDown className="size-3.5 text-muted-foreground" />
                      ) : (
                        <IconChevronRight className="size-3.5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {sectionsExpanded.frame && (
                      <div className="p-3 border-t border-border/40 bg-card/10">
                        {renderDeviceFrameControls()}
                      </div>
                    )}
                  </div>

                  {/* Section 3: Fine Tune Settings */}
                  <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
                    <button
                      type="button"
                      onClick={() => toggleSection("fineTune")}
                      className="flex items-center justify-between w-full p-2.5 text-left font-medium text-xs text-foreground bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <span>Fine Tune Mockup</span>
                      {sectionsExpanded.fineTune ? (
                        <IconChevronDown className="size-3.5 text-muted-foreground" />
                      ) : (
                        <IconChevronRight className="size-3.5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {sectionsExpanded.fineTune && (
                      <div className="p-3 border-t border-border/40 bg-card/10">
                        {renderFineTuneControls()}
                      </div>
                    )}
                  </div>

                </div>
              </ScrollArea>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>

      {/* Fullscreen Preview Mode */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {/* Top control bar */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              {isExporting ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconArrowDownToArc className="size-4" />
              )}
              <span className="hidden sm:inline">Export PNG</span>
              <span className="sm:hidden">Export</span>
            </Button>
            
            <Button
              onClick={handleCopyToClipboard}
              disabled={isCopying}
              size="sm"
              variant="outline"
              className="text-zinc-100 hover:bg-zinc-800 gap-1.5"
            >
              {isCopying ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconCopy className="size-4" />
              )}
              <span className="hidden sm:inline">Copy Image</span>
              <span className="sm:hidden">Copy</span>
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-full border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100"
            >
              <IconX className="size-5" />
            </Button>
          </div>
          
          <div
            style={{
              aspectRatio: canvasRatio === "16-9" ? "16/9" : canvasRatio === "1-1" ? "1/1" : canvasRatio === "9-16" ? "9/16" : "4/3",
            }}
            className={cn(
              "overflow-hidden rounded-2xl border border-zinc-800/80 shadow-2xl relative bg-zinc-900 w-[90vw] max-h-[80vh] flex items-center justify-center transition-all duration-300",
              canvasRatio === "16-9" && "w-[min(90vw,70rem)]",
              canvasRatio === "1-1" && "w-[min(90vw,40rem)]",
              canvasRatio === "9-16" && "w-[min(90vw,26rem)]",
              canvasRatio === "4-3" && "w-[min(90vw,60rem)]"
            )}
          >
            {renderBackground()}
            <div className="absolute inset-0 flex items-center justify-center">
              {state.present.frameStyle === "custom-device" && state.present.selectedFrame ? (
                (() => {
                  const frame = appleFrames.find(f => f.id === state.present.selectedFrame?.id);
                  const category = frame?.category ?? "phone";
                  return (
                    <div
                      className={cn(
                        "mockup-card transition-all duration-300 relative flex flex-col items-center justify-center",
                        (category === "laptop" || category === "desktop") ? (
                          canvasRatio === "16-9" ? "w-[80%] max-w-4xl" :
                          canvasRatio === "4-3" ? "w-[82%] max-w-3xl" :
                          canvasRatio === "1-1" ? "w-[85%] max-w-2xl" :
                          "w-[90%] max-w-md"
                        ) : category === "tablet" ? (
                          canvasRatio === "16-9" ? "w-[40%] max-w-[380px]" :
                          canvasRatio === "4-3" ? "w-[48%] max-w-[420px]" :
                          canvasRatio === "1-1" ? "w-[58%] max-w-[460px]" :
                          "w-[75%] max-w-[360px]"
                        ) : (
                          // Phone & Watch
                          canvasRatio === "16-9" ? "w-[24%] max-w-[220px]" :
                          canvasRatio === "4-3" ? "w-[30%] max-w-[240px]" :
                          canvasRatio === "1-1" ? "w-[48%] max-w-[260px]" :
                          "w-[75%] max-w-[280px]"
                        )
                      )}
                      style={{
                        transform: `
                          perspective(${screenshotPerspective}px)
                          translate(${screenshotX}px, ${screenshotY}px)
                          rotateX(${screenshotRotateX}deg)
                          rotateY(${screenshotRotateY}deg)
                          rotateZ(${screenshotRotateZ}deg)
                          scale(${screenshotZoom})
                        `,
                      }}
                    >
                      {renderCustomAppleFrame(state.present.selectedFrame.id, state.present.selectedFrame.color)}
                    </div>
                  );
                })()
              ) : state.present.deviceType === "mobile" ? (
                /* Mobile Mockup Card */
                <div
                  className="mockup-card w-[42%] max-w-[260px] overflow-hidden drop-shadow-[0_30px_50px_rgba(0,0,0,.45)] flex flex-col transition-all duration-300 relative border-black"
                  style={{
                    borderRadius: `32px`,
                    padding: `${screenshotPadding / 6 + 6}px`,
                    borderWidth: `9px`,
                    borderColor: state.present.frameStyle === "phone-light" ? "#f4f4f5" : "#18181b",
                    backgroundColor: state.present.frameStyle === "phone-light" ? "#f4f4f5" : "#18181b",
                    transform: `
                      perspective(${screenshotPerspective}px)
                      translate(${screenshotX}px, ${screenshotY}px)
                      rotateX(${screenshotRotateX}deg)
                      rotateY(${screenshotRotateY}deg)
                      rotateZ(${screenshotRotateZ}deg)
                      scale(${screenshotZoom})
                    `,
                  }}
                >
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 rounded-full bg-black z-20 flex items-center justify-center">
                    <span className="size-1 rounded-full bg-[#1c1c1e] absolute right-2.5 opacity-60" />
                  </div>
                  {/* Home Indicator */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-0.75 rounded-full bg-white/40 z-20" />
                  
                  {!state.present.screenshot?.image ? (
                    <div className="flex aspect-[9/19.5] w-full items-center justify-center rounded-[24px] bg-background/50">
                      <p className="text-[10px] text-muted-foreground">No mobile image</p>
                    </div>
                  ) : (
                    <img
                      src={state.present.screenshot.image}
                      className="aspect-[9/19.5] w-full object-cover rounded-[24px] shadow-inner"
                      alt="Mobile Screenshot"
                    />
                  )}
                </div>
              ) : (
                /* Desktop Mockup Card */
                <div
                  className="mockup-card w-[85%] max-w-4xl overflow-hidden drop-shadow-[0_40px_60px_rgba(0,0,0,.35)] flex flex-col bg-background"
                  style={{
                    borderRadius: `${screenshotRadius}px`,
                    padding: `${screenshotPadding}px`,
                    transform: `
                      perspective(${screenshotPerspective}px)
                      translate(${screenshotX}px, ${screenshotY}px)
                      rotateX(${screenshotRotateX}deg)
                      rotateY(${screenshotRotateY}deg)
                      rotateZ(${screenshotRotateZ}deg)
                      scale(${screenshotZoom})
                    `,
                  }}
                >
                  {state.present.frameStyle && 
                   state.present.frameStyle !== "none" && 
                   state.present.frameStyle !== "phone-light" && 
                   state.present.frameStyle !== "phone-dark" && (
                    <BrowserHeader theme={state.present.frameStyle === "browser-light" ? "light" : "dark"} />
                  )}
                  {!state.present.screenshot?.image ? (
                    <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-md border border-dashed border-border/60 bg-background/50 backdrop-blur-sm">
                      <p className="font-medium text-muted-foreground text-sm">No screenshot uploaded</p>
                    </div>
                  ) : (
                    <img
                      src={state.present.screenshot.image}
                      className="aspect-video w-full object-cover"
                      alt="Screenshot"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Device Catalog Dialog */}
      {isDeviceCatalogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative bg-[#1c1c1f] text-zinc-100 rounded-3xl border border-zinc-800 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide text-zinc-200">Mockup / Frame</span>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">Apple Collection</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDeviceCatalogOpen(false)}
                className="size-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
              >
                <IconX className="size-4" />
              </Button>
            </div>

            {/* Categories Bar */}
            <div className="flex items-center gap-1.5 px-6 py-3 border-b border-zinc-800/40 bg-zinc-950/20 overflow-x-auto select-none scrollbar-none">
              {catalogCategories.map((cat) => {
                const active = selectedCatalogCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatalogCategory(cat.id as any)}
                    className={cn(
                      "h-8 px-4 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer",
                      active 
                        ? "bg-zinc-100 text-zinc-950 font-semibold" 
                        : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    )}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0">
              {renderCatalogSections()}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster position="bottom-right" theme="dark" closeButton />
    </main>
  );
}
