import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconX, IconDeviceLaptop } from "@tabler/icons-react";
import { appleFrames, catalogCategories } from "@/lib/constants";
import { EditorState, Action, AppleFrame } from "@/lib/types";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@/lib/utils";

interface DeviceCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  state: EditorState;
  dispatch: React.Dispatch<Action>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  all: null,
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
      <path d="M12 18h.01"/>
    </svg>
  ),
  tablet: (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" transform="rotate(90 12 12)"/>
      <path d="M12 18h.01"/>
    </svg>
  ),
  laptop: (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/>
      <path d="M2 20h20"/>
      <path d="M12 16v4"/>
    </svg>
  ),
  desktop: (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="20" height="14" x="2" y="3" rx="2"/>
      <line x1="8" x2="16" y1="21" y2="21"/>
      <line x1="12" x2="12" y1="17" y2="21"/>
    </svg>
  ),
  watch: (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="12" height="18" x="6" y="3" rx="3"/>
      <path d="M12 3V1"/>
      <path d="M12 23v-2"/>
      <path d="M12 7V9"/>
    </svg>
  ),
};

export function DeviceCatalog({
  isOpen,
  onClose,
  state,
  dispatch,
}: DeviceCatalogProps) {
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<
    "all" | "phone" | "tablet" | "laptop" | "desktop" | "watch"
  >("all");
  const [catalogDeviceColors, setCatalogDeviceColors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const initialColors: Record<string, string> = {};
      appleFrames.forEach((frame) => {
        initialColors[frame.id] = frame.colors[0]?.value ?? "silver";
      });
      if (state.selectedFrame) {
        initialColors[state.selectedFrame.id] = state.selectedFrame.color;
      }
      setCatalogDeviceColors(initialColors);
    }
  }, [isOpen, state.selectedFrame]);

  const handleCatalogDeviceColorChange = (frameId: string, colorValue: string) => {
    setCatalogDeviceColors((prev) => ({
      ...prev,
      [frameId]: colorValue,
    }));
    if (state.frameStyle === "custom-device" && state.selectedFrame?.id === frameId) {
      dispatch({
        type: "update",
        payload: {
          selectedFrame: {
            id: frameId,
            color: colorValue,
          },
        },
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
          color: color,
        },
      },
    });
    onClose();
    toast.success(`Applied ${frame.name} frame!`);
  };

  if (!isOpen) return null;

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
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z" />
                  </svg>
                )}
                {frame.brand === "Google" && (
                  <svg className="size-3 fill-zinc-400 shrink-0" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18 8.448 18 5.37 14.922 5.37 11.13s3.078-6.87 6.87-6.87c1.785 0 3.398.643 4.67 1.857l2.42-2.42C17.382 1.83 14.957 1 12.24 1a10.13 10.13 0 0 0-10.13 10.13 10.13 10.13 0 0 0 10.13 10.13c5.385 0 9.77-3.9 9.77-9.77 0-.61-.054-1.2-.162-1.77h-9.608z" />
                  </svg>
                )}
                {frame.brand === "Dell" && (
                  <span className="text-[8px] font-bold border border-zinc-700 px-1 py-0.2 rounded-xs text-zinc-400 font-mono scale-90 shrink-0">
                    DELL
                  </span>
                )}
                <h4 className="text-xs font-semibold tracking-wide truncate">{frame.name}</h4>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 shrink-0">{frame.resolution}</span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-0.5">Aspect ratio {frame.aspectRatio}</p>
          </div>

          {/* Color Dots */}
          <div className="flex items-center gap-1.5 mt-3 mb-3">
            {frame.colors.map((col) => {
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

    const phoneFrames = filteredFrames.filter((f) => f.category === "phone");
    const tabletFrames = filteredFrames.filter((f) => f.category === "tablet");
    const laptopFrames = filteredFrames.filter((f) => f.category === "laptop");
    const desktopFrames = filteredFrames.filter((f) => f.category === "desktop");

    // Brand sub-groups
    const applePhones = phoneFrames.filter((f) => f.brand === "Apple");
    const googlePhones = phoneFrames.filter((f) => f.brand === "Google");

    const appleLaptops = laptopFrames.filter((f) => f.brand === "Apple");
    const dellLaptops = laptopFrames.filter((f) => f.brand === "Dell");

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
                <div className="aspect-video w-full rounded-lg bg-zinc-955 flex flex-col items-center justify-center p-3 relative overflow-hidden mb-3 border border-zinc-850">
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
                          frameStyle: "browser-dark",
                        },
                      });
                      onClose();
                      toast.success("Applied Browser frame!");
                    }}
                  >
                    Select Frame
                  </Button>
                </div>
              </div>

              {/* Card 2: Pro Display XDR */}
              {renderFrameCatalogCard(appleFrames.find((f) => f.id === "pro-display-xdr")!)}
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
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z" />
                    </svg>
                    <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">iPhone Collection</h3>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium text-[9px]">iOS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {applePhones.map((frame) => renderFrameCatalogCard(frame))}
                </div>
              </div>
            )}

            {googlePhones.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <svg className="size-3.5 fill-current text-zinc-400" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18 8.448 18 5.37 14.922 5.37 11.13s3.078-6.87 6.87-6.87c1.785 0 3.398.643 4.67 1.857l2.42-2.42C17.382 1.83 14.957 1 12.24 1a10.13 10.13 0 0 0-10.13 10.13 10.13 10.13 0 0 0 10.13 10.13c5.385 0 9.77-3.9 9.77-9.77 0-.61-.054-1.2-.162-1.77h-9.608z" />
                    </svg>
                    <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Google Pixel Collection</h3>
                  </div>
                  <span className="bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full font-medium text-[9px]">Android</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {googlePhones.map((frame) => renderFrameCatalogCard(frame))}
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
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z" />
                </svg>
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">iOS & Android Smartphones</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Smartphones</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phoneFrames.map((frame) => renderFrameCatalogCard(frame))}
            </div>
          </div>
        )}

        {/* --- TABLETS SECTION --- */}
        {tabletFrames.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
              <div className="flex items-center gap-2">
                <svg className="size-3.5 fill-current text-zinc-400" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z" />
                </svg>
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">iPad Series</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Tablets</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tabletFrames.map((frame) => renderFrameCatalogCard(frame))}
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
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.82-2.38-6.53-6.83-11.1-13.36-7.85-11.4-13.91-23.75-18.17-37.06-4.26-13.31-6.39-25.56-6.39-36.78 0-16.14 3.96-29.28 11.89-39.41 7.92-10.13 18.06-15.34 30.41-15.65 5.66 0 11.55 1.76 17.67 5.27 6.13 3.51 10.42 5.27 12.88 5.27 1.95 0 6-1.57 12.16-4.7 6.16-3.14 11.85-4.66 17.07-4.56 12.39.4 22.39 4.96 29.98 13.68 5.92 6.95 10.04 15.11 12.37 24.5-13.99 5.75-20.9 15.66-20.73 29.74.17 11.04 4.3 20.15 12.39 27.32 8.09 7.17 17.67 11.02 28.74 11.56-2.2 6.07-4.42 11.5-6.66 16.3zm-38.37-124.9c0 8.09-3 15.71-9.01 22.86-6 7.15-13.36 11.52-22.09 13.1-1-8.31 2-16.14 8.03-23.47 6.03-7.33 13.56-11.54 22.59-12.63.48.14.48.14.48.14z" />
                    </svg>
                    <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">MacBook Lineup</h3>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-medium">macOS Laptops</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {appleLaptops.map((frame) => renderFrameCatalogCard(frame))}
                </div>
              </div>
            )}

            {dellLaptops.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold border border-zinc-700 px-1 py-0.2 rounded-xs text-zinc-400 font-mono">
                      DELL
                    </span>
                    <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Dell XPS Collection</h3>
                  </div>
                  <span className="bg-zinc-750 text-zinc-400 px-2 py-0.5 rounded-full font-medium text-[9px]">
                    Windows
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dellLaptops.map((frame) => renderFrameCatalogCard(frame))}
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
                  <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12" />
                  <path d="M2 20h20" />
                  <path d="M12 16v4" />
                </svg>
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Premium Laptops</h3>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">Laptops</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {laptopFrames.map((frame) => renderFrameCatalogCard(frame))}
            </div>
          </div>
        )}

        {/* --- DESKTOPS SECTION --- */}
        {desktopFrames.length > 0 &&
          (selectedCatalogCategory === "desktop" || selectedCatalogCategory === "all") && (
            <div>
              <div className="flex items-center justify-between mb-3.5 border-b border-zinc-800 pb-1.5">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 shrink-0">
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                  <h3 className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">
                    Mac & Desktop displays
                  </h3>
                </div>
                <span className="text-[9px] text-zinc-500 font-medium">Monitors & Desktops</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {desktopFrames.map((frame) => renderFrameCatalogCard(frame))}
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#1c1c1f] text-zinc-100 rounded-3xl border border-zinc-800 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-wide text-zinc-200">Mockup / Frame</span>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
              Apple Collection
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <IconX className="size-4" />
          </Button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-zinc-800/40 bg-zinc-955/20 overflow-x-auto select-none scrollbar-none">
          {catalogCategories.map((cat) => {
            const active = selectedCatalogCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatalogCategory(cat.id)}
                className={cn(
                  "h-8 px-4 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer",
                  active
                    ? "bg-zinc-100 text-zinc-950 font-semibold"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                )}
              >
                {categoryIcons[cat.id]}
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
  );
}
