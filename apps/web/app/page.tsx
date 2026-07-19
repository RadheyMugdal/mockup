"use client";

import { useEffect, useReducer, useState } from "react";
import { snapdom } from "@zumer/snapdom";
import { toast, Toaster } from "sonner";
import {
  IconArrowBackUp,
  IconArrowsMaximize,
  IconChevronDown,
  IconChevronRight,
  IconUpload,
  IconX,
  IconCopy,
  IconLoader2,
  IconDeviceLaptop,
  IconStackForward,
  IconSettings,
  IconPalette,
  IconArrowDownToArc,
} from "@tabler/icons-react";

import { Button } from "@workspace/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Sidebar, SidebarContent, SidebarProvider } from "@workspace/ui/components/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@workspace/ui/components/drawer";

// Split Imports
import { appleFrames, initialState } from "@/lib/constants";
import { reducer, getScreenshotSetting } from "@/lib/reducer";
import { EditorState, ScreenshotSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

// Custom Subcomponents
import { BrowserHeader } from "@/components/browser-header";
import { BackgroundAndColorsControls } from "@/components/background-controls";
import { LayoutControls } from "@/components/layout-controls";
import { DeviceControls } from "@/components/device-controls";
import { FineTuneControls } from "@/components/fine-tune-controls";
import { ExportActionsControls } from "@/components/export-actions";


export default function Page() {
  const [canvasRatio, setCanvasRatio] = useState<"16-9" | "1-1" | "9-16" | "4-3">("16-9");
  const [state, dispatch] = useReducer(reducer, {
    past: [],
    present: initialState,
    future: [],
  });

  const [startOverOpen, setStartOverOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [activeMobileDrawer, setActiveMobileDrawer] = useState<"canvas" | "layouts" | "device" | "adjust" | "export" | null>(null);

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

  const handleExport = async () => {
    console.log("[handleExport] Started export process.");
    const canvasElement = document.getElementById("mockup-canvas");
    if (!canvasElement) {
      console.error("[handleExport] Mockup canvas element (#mockup-canvas) not found in DOM.");
      toast.error("Mockup canvas element not found");
      return;
    }

    // Inspect images inside canvasElement for CORS/loading issues
    const images = Array.from(canvasElement.querySelectorAll("img"));
    console.log(`[handleExport] Found ${images.length} <img> tags inside canvasElement:`, images.map(img => ({
      src: img.src,
      complete: img.complete,
      crossOrigin: img.crossOrigin,
      naturalWidth: img.naturalWidth
    })));

    try {
      setIsExporting(true);
      toast.loading("Rendering mockup...", { id: "export-mockup" });
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("[handleExport] Calling snapdom...");
      const result = await snapdom(canvasElement, {
        scale: 3,
        embedFonts: true,
      });

      console.log("[handleExport] snapdom rendering completed. Initiating download...");
      await result.download({
        format: "png",
        filename: `mockup-${Date.now()}.png`,
      });

      toast.success("Mockup exported successfully!", { id: "export-mockup" });
    } catch (error: any) {
      console.error("[handleExport] Error during export process:", error);
      toast.error(`Failed to export mockup: ${error?.message || "Unknown error"}. See console for details.`, { id: "export-mockup" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    console.log("[handleCopyToClipboard] Started copy to clipboard process.");
    const canvasElement = document.getElementById("mockup-canvas");
    if (!canvasElement) {
      console.error("[handleCopyToClipboard] Mockup canvas element (#mockup-canvas) not found in DOM.");
      toast.error("Mockup canvas element not found");
      return;
    }

    try {
      setIsCopying(true);
      toast.loading("Copying to clipboard...", { id: "copy-mockup" });
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("[handleCopyToClipboard] Calling snapdom...");
      const result = await snapdom(canvasElement, {
        scale: 2,
        embedFonts: true,
      });

      console.log("[handleCopyToClipboard] snapdom rendering completed. Exporting to blob...");
      const blob = await result.toBlob({ type: "png" });

      if (!blob) {
        throw new Error("Generated blob is null");
      }

      console.log("[handleCopyToClipboard] Generated blob successfully. Type:", blob.type, "Size:", blob.size);
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        toast.success("Mockup copied to clipboard!", { id: "copy-mockup" });
      } catch (e: any) {
        console.error("[handleCopyToClipboard] Clipboard write failed:", e);
        toast.error(`Clipboard blocked or size too large. Try downloading instead. (${e?.message || "Permission issue"})`, { id: "copy-mockup" });
      }
    } catch (error: any) {
      console.error("[handleCopyToClipboard] Error during copy to clipboard process:", error);
      toast.error(`Failed to copy image: ${error?.message || "Unknown error"}. See console for details.`, { id: "copy-mockup" });
    } finally {
      setIsCopying(false);
    }
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
            x: getScreenshotSetting(state.present.screenshot, "x"),
            y: getScreenshotSetting(state.present.screenshot, "y"),
            radius: getScreenshotSetting(state.present.screenshot, "radius"),
            padding: getScreenshotSetting(state.present.screenshot, "padding"),
            zoom: getScreenshotSetting(state.present.screenshot, "zoom"),
            rotateX: getScreenshotSetting(state.present.screenshot, "rotateX"),
            rotateY: getScreenshotSetting(state.present.screenshot, "rotateY"),
            rotateZ: getScreenshotSetting(state.present.screenshot, "rotateZ"),
            perspective: getScreenshotSetting(state.present.screenshot, "perspective"),
          },
        },
      });
      toast.success("Screenshot uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const canRedo = state.future.length > 0;
  const canUndo = state.past.length > 0;
  const screenshotRadius = getScreenshotSetting(state.present.screenshot, "radius");
  const screenshotPadding = getScreenshotSetting(state.present.screenshot, "padding");
  const screenshotX = getScreenshotSetting(state.present.screenshot, "x");
  const screenshotY = getScreenshotSetting(state.present.screenshot, "y");
  const screenshotRotateX = getScreenshotSetting(state.present.screenshot, "rotateX");
  const screenshotRotateY = getScreenshotSetting(state.present.screenshot, "rotateY");
  const screenshotRotateZ = getScreenshotSetting(state.present.screenshot, "rotateZ");
  const screenshotPerspective = getScreenshotSetting(state.present.screenshot, "perspective");
  const screenshotZoom = getScreenshotSetting(state.present.screenshot, "zoom");

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

  const renderCustomAppleFrame = (frameId: string, color: string) => {
    const frame = appleFrames.find((f) => f.id === frameId);
    if (!frame) return null;

    const imageUrl = frame.assetPattern.replace("${color}", color);
    const insets = frame.insets;

    // Explicit image file aspect ratios to ensure immediate layout height calculation and avoid async image-load shifts
    let fileAspectRatio: string | undefined;
    if (frameId === "macbook-pro-16") fileAspectRatio = "4340/2860";
    else if (frameId === "macbook-air-15") fileAspectRatio = "3580/2364";
    else if (frameId === "dell-xps-16") fileAspectRatio = "4210/2456";
    else if (frameId === "imac-24") fileAspectRatio = "4880/5720";
    else if (frameId === "pro-display-xdr") fileAspectRatio = "6416/4865";
    else if (frameId === "ipad-pro-13") fileAspectRatio = "2264/2952";

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
      <div
        className="relative w-full"
        style={fileAspectRatio ? { aspectRatio: fileAspectRatio } : undefined}
      >
        {/* Screenshot in transparent window */}
        <div
          className="absolute overflow-hidden bg-black"
          style={{
            top: insets.top,
            left: insets.left,
            right: insets.right,
            bottom: insets.bottom,
            borderRadius: insets.borderRadius,
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

  return (
    <main className="flex h-svh w-svw flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <SidebarProvider style={{ minHeight: "100%", height: "100%" }} className="overflow-hidden">
          <Sidebar className="w-80 border-r border-border/50 hidden lg:flex" style={{ "--sidebar-width": "20rem" } as React.CSSProperties}>
            <SidebarContent className="flex h-full flex-col p-3 gap-3 overflow-hidden">
              <ScrollArea className="flex-1 min-h-0 pr-1">
                <BackgroundAndColorsControls state={state.present} dispatch={dispatch} />
              </ScrollArea>
              <div className="shrink-0 pt-2.5 border-t border-border/40">
                <DeviceControls state={state.present} dispatch={dispatch} />
              </div>
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

              {/* Canvas Aspect Ratio selector */}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetView}
                      className="h-9 px-2 lg:px-3 gap-1.5 text-xs font-medium cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2050/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
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
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-zinc-955/[0.015] bg-[radial-gradient(#e4e4e7_1.2px,transparent_1.2px)] [background-size:16px_16px] dark:bg-zinc-950/20 dark:bg-[radial-gradient(#27272a_1.2px,transparent_1.2px)] transition-all duration-300">
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
                      const frame = appleFrames.find((f) => f.id === state.present.selectedFrame?.id);
                      const category = frame?.category ?? "phone";
                      return (
                        <div
                          className={cn(
                            "mockup-card transition-all duration-300 relative flex flex-col items-center justify-center",
                            category === "laptop" || category === "desktop"
                              ? canvasRatio === "16-9"
                                ? "w-[80%] max-w-4xl"
                                : canvasRatio === "4-3"
                                ? "w-[82%] max-w-3xl"
                                : canvasRatio === "1-1"
                                ? "w-[85%] max-w-2xl"
                                : "w-[90%] max-w-md"
                              : category === "tablet"
                              ? canvasRatio === "16-9"
                                ? "w-[40%] max-w-[380px]"
                                : canvasRatio === "4-3"
                                ? "w-[48%] max-w-[420px]"
                                : canvasRatio === "1-1"
                                ? "w-[58%] max-w-[460px]"
                                : "w-[75%] max-w-[360px]"
                              : canvasRatio === "16-9"
                              ? "w-[24%] max-w-[220px]"
                              : canvasRatio === "4-3"
                              ? "w-[30%] max-w-[240px]"
                              : canvasRatio === "1-1"
                              ? "w-[48%] max-w-[260px]"
                              : "w-[75%] max-w-[280px]"
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
                          state.present.frameStyle === "phone-light"
                            ? "bg-zinc-200 shadow-zinc-400/20"
                            : state.present.frameStyle === "phone-dark"
                            ? "bg-zinc-800 shadow-black/40"
                            : "bg-transparent p-0"
                        )}
                      >
                        {/* Inner Bezel */}
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
                        <BackgroundAndColorsControls state={state.present} dispatch={dispatch} />
                      </div>
                    </div>
                  )}
                  {activeMobileDrawer === "layouts" && <LayoutControls state={state.present} dispatch={dispatch} />}
                  {activeMobileDrawer === "device" && (
                    <DeviceControls
                      state={state.present}
                      dispatch={dispatch}
                    />
                  )}
                  {activeMobileDrawer === "adjust" && (
                    <FineTuneControls state={state.present} updateScreenshot={updateScreenshot} />
                  )}
                  {activeMobileDrawer === "export" && (
                    <ExportActionsControls
                      handleExport={handleExport}
                      isExporting={isExporting}
                      handleCopyToClipboard={handleCopyToClipboard}
                      isCopying={isCopying}
                    />
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </main>

          <Sidebar
            side="right"
            className="w-80 border-l border-border/50 hidden lg:flex"
            style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
          >
            <SidebarContent className="flex h-full flex-col p-3 gap-3 overflow-hidden">
              {/* Header Action Bar */}
              <div className="flex flex-col gap-2 shrink-0 pb-2 border-b border-border/40">
                <ExportActionsControls
                  handleExport={handleExport}
                  isExporting={isExporting}
                  handleCopyToClipboard={handleCopyToClipboard}
                  isCopying={isCopying}
                />
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
                        <LayoutControls state={state.present} dispatch={dispatch} />
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
                        <FineTuneControls state={state.present} updateScreenshot={updateScreenshot} />
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-955/95 backdrop-blur-md transition-all duration-300 animate-in fade-in">
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
                  const frame = appleFrames.find((f) => f.id === state.present.selectedFrame?.id);
                  const category = frame?.category ?? "phone";
                  return (
                    <div
                      className={cn(
                        "mockup-card transition-all duration-300 relative flex flex-col items-center justify-center",
                        category === "laptop" || category === "desktop"
                          ? canvasRatio === "16-9"
                            ? "w-[80%] max-w-4xl"
                            : canvasRatio === "4-3"
                            ? "w-[82%] max-w-3xl"
                            : canvasRatio === "1-1"
                            ? "w-[85%] max-w-2xl"
                            : "w-[90%] max-w-md"
                          : category === "tablet"
                          ? canvasRatio === "16-9"
                            ? "w-[40%] max-w-[380px]"
                            : canvasRatio === "4-3"
                            ? "w-[48%] max-w-[420px]"
                            : canvasRatio === "1-1"
                            ? "w-[58%] max-w-[460px]"
                            : "w-[75%] max-w-[360px]"
                          : canvasRatio === "16-9"
                          ? "w-[24%] max-w-[220px]"
                          : canvasRatio === "4-3"
                          ? "w-[30%] max-w-[240px]"
                          : canvasRatio === "1-1"
                          ? "w-[48%] max-w-[260px]"
                          : "w-[75%] max-w-[280px]"
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


      {/* Toast Notifications */}
      <Toaster position="bottom-right" theme="dark" closeButton />
    </main>
  );
}
