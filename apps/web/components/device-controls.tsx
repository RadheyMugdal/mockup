import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { appleFrames } from "@/lib/constants";
import { EditorState, Action, AppleFrame } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";

interface DeviceControlsProps {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
  setIsDeviceCatalogOpen?: (open: boolean) => void;
}

const categories = [
  { id: "all", label: "All" },
  { id: "phone", label: "Mobile" },
  { id: "tablet", label: "Tablet" },
  { id: "laptop", label: "Laptop" },
  { id: "desktop", label: "Desktop" },
  { id: "watch", label: "Watch" },
] as const;

export function DeviceControls({
  state,
  dispatch,
}: DeviceControlsProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Local state to track chosen color for each frame card within the catalog
  const [cardColors, setCardColors] = useState<Record<string, string>>({});
  
  // Local state to track active Browser style (dark vs light) inside the Essentials catalog card
  const [browserStyle, setBrowserStyle] = useState<"browser-dark" | "browser-light">("browser-dark");

  // Sync initial and updated frame color selections
  useEffect(() => {
    const initialColors: Record<string, string> = {};
    appleFrames.forEach((frame) => {
      initialColors[frame.id] = frame.colors[0]?.value ?? "silver";
    });
    if (state.selectedFrame) {
      initialColors[state.selectedFrame.id] = state.selectedFrame.color;
    }
    setCardColors(initialColors);

    if (state.frameStyle && state.frameStyle.startsWith("browser")) {
      setBrowserStyle(state.frameStyle as "browser-dark" | "browser-light");
    }
  }, [state.selectedFrame, state.frameStyle]);

  const handleCardColorChange = (frameId: string, colorValue: string) => {
    setCardColors((prev) => ({
      ...prev,
      [frameId]: colorValue,
    }));
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
    toast.success(`Applied ${frame.name} (${color})!`);
  };

  const getActiveDeviceDetails = () => {
    if (state.frameStyle === "custom-device" && state.selectedFrame) {
      const frame = appleFrames.find((f) => f.id === state.selectedFrame?.id);
      if (frame) {
        const color = state.selectedFrame.color;
        const imgUrl = frame.assetPattern.replace("${color}", color);
        return {
          name: frame.name,
          resolution: frame.resolution,
          imgUrl: imgUrl,
          isCustom: true,
          category: frame.category,
        };
      }
    }

    if (state.frameStyle && state.frameStyle.startsWith("browser")) {
      return {
        name: state.frameStyle === "browser-light" ? "Light Browser" : "Dark Browser",
        resolution: "Adapts to media",
        imgUrl: null,
        isBrowser: true,
        category: "desktop",
      };
    }

    return {
      name: "Screenshot",
      resolution: "Adapts to media",
      imgUrl: null,
      isScreenshot: true,
      category: "all",
    };
  };

  const activeDetails = getActiveDeviceDetails();

  const renderTriggerThumbnail = () => {
    if (activeDetails.imgUrl) {
      return (
        <div className="relative h-10 w-10 rounded-lg bg-zinc-950/40 border border-zinc-800/80 flex items-center justify-center p-1 shrink-0">
          <img
            src={activeDetails.imgUrl}
            className="max-h-[90%] max-w-[90%] object-contain select-none transition-transform duration-300"
            alt={activeDetails.name}
          />
          {/* Active device indicator light/bar at the bottom */}
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[1.5px] rounded-full bg-white/80 shadow-xs" />
        </div>
      );
    }

    if (activeDetails.isBrowser) {
      return (
        <div className="relative h-10 w-10 rounded-lg bg-zinc-950/40 border border-zinc-800/80 flex flex-col p-1.5 shrink-0 justify-center">
          <div className="w-full border border-zinc-800 bg-zinc-900 rounded-[3px] overflow-hidden flex flex-col shadow-xs">
            <div className="flex items-center gap-[2px] px-[2px] py-[2px] border-b border-zinc-850 bg-zinc-950 shrink-0">
              <span className="size-[2px] rounded-full bg-zinc-500" />
              <span className="size-[2px] rounded-full bg-zinc-500" />
              <span className="size-[2px] rounded-full bg-zinc-500" />
            </div>
            <div className="h-4 w-full bg-zinc-800/40" />
          </div>
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[1.5px] rounded-full bg-white/80 shadow-xs" />
        </div>
      );
    }

    return (
      <div className="relative h-10 w-10 rounded-lg bg-zinc-950/40 border border-zinc-800/80 flex items-center justify-center p-1.5 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <line x1="9" x2="15" y1="9" y2="15"/>
          <line x1="15" x2="9" y1="9" y2="15"/>
        </svg>
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[1.5px] rounded-full bg-white/80 shadow-xs" />
      </div>
    );
  };

  const renderFrameCard = (frame: AppleFrame) => {
    if (!frame) return null;
    const activeColor = cardColors[frame.id] ?? frame.colors[0]?.value ?? "silver";
    const previewUrl = frame.assetPattern.replace("${color}", activeColor);

    return (
      <div
        key={frame.id}
        onClick={() => {
          handleSelectAppleFrame(frame, activeColor);
          setOpen(false);
        }}
        className="bg-[#222226] border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-3 flex flex-col justify-between transition duration-200 group cursor-pointer"
      >
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <h4 className="text-[11px] font-semibold text-zinc-100 truncate tracking-wide leading-tight group-hover:text-white transition">
                {frame.name}
              </h4>
              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{frame.resolution}</p>
            </div>
            {frame.status && (
              <span className="bg-zinc-100 text-zinc-950 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md select-none shrink-0 tracking-wider leading-none shadow-xs uppercase">
                {frame.status}
              </span>
            )}
          </div>

          {/* Thumbnail preview */}
          <div className="aspect-[4/3] w-full rounded-xl bg-zinc-950/65 flex items-center justify-center p-2.5 my-2.5 border border-zinc-850 relative overflow-hidden">
            <img
              src={previewUrl}
              className="max-h-[64px] max-w-[85%] object-contain select-none transition-transform duration-300 group-hover:scale-105"
              alt={frame.name}
            />
          </div>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5 flex-wrap min-h-4">
          {frame.colors.slice(0, 3).map((col) => {
            const selected = activeColor === col.value;
            return (
              <button
                key={col.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardColorChange(frame.id, col.value);
                }}
                className={cn(
                  "size-3.5 rounded-full flex items-center justify-center border transition-all cursor-pointer",
                  selected ? "border-zinc-200 scale-110" : "border-zinc-850 hover:border-zinc-700"
                )}
                title={col.name}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: col.hex }} />
              </button>
            );
          })}
          {frame.colors.length > 3 && (
            <span className="text-[8px] text-zinc-500 font-mono font-semibold select-none leading-none pl-0.5">
              +{frame.colors.length - 3}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderSectionHeader = (title: string, showSeeAllCategory?: string) => {
    return (
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">{title}</span>
        {showSeeAllCategory && (
          <button
            type="button"
            onClick={() => setSelectedCategory(showSeeAllCategory)}
            className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-300 px-2 py-0.5 rounded bg-zinc-850/40 hover:bg-zinc-850 transition cursor-pointer"
          >
            See all
          </button>
        )}
      </div>
    );
  };

  const renderCatalogContent = () => {
    // Filter and group devices
    const phoneFrames = appleFrames.filter((f) => f.category === "phone");
    const tabletFrames = appleFrames.filter((f) => f.category === "tablet");
    const laptopFrames = appleFrames.filter((f) => f.category === "laptop");
    const desktopFrames = appleFrames.filter((f) => f.category === "desktop");

    // Brand sub-groups
    const applePhones = phoneFrames.filter((f) => f.brand === "Apple");
    const googlePhones = phoneFrames.filter((f) => f.brand === "Google");
    const appleLaptops = laptopFrames.filter((f) => f.brand === "Apple");
    const dellLaptops = laptopFrames.filter((f) => f.brand === "Dell");

    if (selectedCategory === "all") {
      const iphone17List = applePhones.filter((f) => f.name.includes("17"));

      return (
        <div className="space-y-5">
          {/* Essentials (Screenshot & Browser) */}
          <div>
            {renderSectionHeader("Essentials")}
            <div className="grid grid-cols-2 gap-3">
              {/* Screenshot Card */}
              <div
                onClick={() => {
                  dispatch({
                    type: "update",
                    payload: { frameStyle: "none" },
                  });
                  setOpen(false);
                  toast.success("Applied Screenshot frame!");
                }}
                className="bg-[#222226] border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-3 flex flex-col justify-between transition duration-200 group cursor-pointer"
              >
                <div>
                  <h4 className="text-[11px] font-semibold text-zinc-100 group-hover:text-white transition">
                    Screenshot
                  </h4>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Adapts to media</p>
                  
                  <div className="aspect-[4/3] w-full rounded-xl bg-zinc-955/65 flex items-center justify-center p-3 my-2.5 border border-zinc-850 relative overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 transition-transform duration-300 group-hover:scale-105">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <line x1="9" x2="15" y1="9" y2="15"/>
                      <line x1="15" x2="9" y1="9" y2="15"/>
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-1 min-h-4">
                  <span className="size-3.5 rounded border border-zinc-850 bg-zinc-800/60" />
                  <span className="size-3.5 rounded border border-zinc-850 bg-zinc-800/60" />
                  <span className="size-3.5 rounded border border-zinc-850 bg-zinc-800/60" />
                  <span className="text-[8px] text-zinc-500 font-mono font-semibold pl-0.5">+9</span>
                </div>
              </div>

              {/* Browser Card */}
              <div
                onClick={() => {
                  dispatch({
                    type: "update",
                    payload: {
                      deviceType: "desktop",
                      frameStyle: browserStyle,
                    },
                  });
                  setOpen(false);
                  toast.success(`Applied Browser (${browserStyle === "browser-light" ? "Light" : "Dark"})!`);
                }}
                className="bg-[#222226] border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-3 flex flex-col justify-between transition duration-200 group cursor-pointer"
              >
                <div>
                  <h4 className="text-[11px] font-semibold text-zinc-100 group-hover:text-white transition">
                    Browser
                  </h4>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Adapts to media</p>
                  
                  <div className="aspect-[4/3] w-full rounded-xl bg-zinc-950/65 flex items-center justify-center p-3 my-2.5 border border-zinc-850 relative overflow-hidden">
                    <div className={cn(
                      "w-11/12 border rounded-[4px] shadow-sm flex flex-col overflow-hidden",
                      browserStyle === "browser-light" ? "border-zinc-300 bg-white" : "border-zinc-800 bg-zinc-900"
                    )}>
                      <div className={cn(
                        "flex items-center gap-[2px] px-[2px] py-[2px] border-b shrink-0",
                        browserStyle === "browser-light" ? "border-zinc-200 bg-zinc-100" : "border-zinc-850 bg-zinc-955"
                      )}>
                        <span className="size-[2px] rounded-full bg-red-500/80" />
                        <span className="size-[2px] rounded-full bg-yellow-500/80" />
                        <span className="size-[2px] rounded-full bg-green-500/80" />
                      </div>
                      <div className="h-6 w-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 min-h-4">
                  {/* Dark style swatch */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBrowserStyle("browser-dark");
                      dispatch({
                        type: "update",
                        payload: {
                          deviceType: "desktop",
                          frameStyle: "browser-dark",
                        },
                      });
                    }}
                    className={cn(
                      "size-3.5 rounded-full flex items-center justify-center border cursor-pointer",
                      browserStyle === "browser-dark" ? "border-zinc-200" : "border-zinc-850"
                    )}
                    title="Dark Browser Style"
                  >
                    <span className="size-2 rounded-full bg-zinc-900" />
                  </button>
                  {/* Light style swatch */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBrowserStyle("browser-light");
                      dispatch({
                        type: "update",
                        payload: {
                          deviceType: "desktop",
                          frameStyle: "browser-light",
                        },
                      });
                    }}
                    className={cn(
                      "size-3.5 rounded-full flex items-center justify-center border cursor-pointer",
                      browserStyle === "browser-light" ? "border-zinc-200" : "border-zinc-850"
                    )}
                    title="Light Browser Style"
                  >
                    <span className="size-2 rounded-full bg-zinc-100" />
                  </button>
                  <span className="text-[8px] text-zinc-500 font-mono font-semibold pl-0.5">+3</span>
                </div>
              </div>
            </div>
          </div>

          {/* iPhone 17 Lineup */}
          {iphone17List.length > 0 && (
            <div>
              {renderSectionHeader("iPhone 17 Lineup", "phone")}
              <div className="grid grid-cols-2 gap-3">
                {iphone17List.map((frame) => renderFrameCard(frame))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedCategory === "phone") {
      return (
        <div className="space-y-5">
          {applePhones.length > 0 && (
            <div>
              {renderSectionHeader("iPhone Collection")}
              <div className="grid grid-cols-2 gap-3">
                {applePhones.map((frame) => renderFrameCard(frame))}
              </div>
            </div>
          )}

          {googlePhones.length > 0 && (
            <div>
              {renderSectionHeader("Google Pixel Collection")}
              <div className="grid grid-cols-2 gap-3">
                {googlePhones.map((frame) => renderFrameCard(frame))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedCategory === "tablet") {
      return (
        <div className="space-y-5">
          {tabletFrames.length > 0 ? (
            <div>
              {renderSectionHeader("iPad Series")}
              <div className="grid grid-cols-2 gap-3">
                {tabletFrames.map((frame) => renderFrameCard(frame))}
              </div>
            </div>
          ) : (
            <p className="text-zinc-500 text-xs text-center py-4">No tablets available.</p>
          )}
        </div>
      );
    }

    if (selectedCategory === "laptop") {
      return (
        <div className="space-y-5">
          {appleLaptops.length > 0 && (
            <div>
              {renderSectionHeader("MacBook Lineup")}
              <div className="grid grid-cols-2 gap-3">
                {appleLaptops.map((frame) => renderFrameCard(frame))}
              </div>
            </div>
          )}

          {dellLaptops.length > 0 && (
            <div>
              {renderSectionHeader("Dell XPS Collection")}
              <div className="grid grid-cols-2 gap-3">
                {dellLaptops.map((frame) => renderFrameCard(frame))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedCategory === "desktop") {
      return (
        <div className="space-y-5">
          {desktopFrames.length > 0 ? (
            <div>
              {renderSectionHeader("Monitors & Desktops")}
              <div className="grid grid-cols-2 gap-3">
                {desktopFrames.map((frame) => renderFrameCard(frame))}
              </div>
            </div>
          ) : (
            <p className="text-zinc-500 text-xs text-center py-4">No desktops available.</p>
          )}
        </div>
      );
    }

    // Default watch / empty state
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 mb-2">
          <rect width="12" height="18" x="6" y="3" rx="3"/>
          <path d="M12 3V1"/>
          <path d="M12 23v-2"/>
          <path d="M12 7V9"/>
        </svg>
        <h5 className="text-xs font-semibold text-zinc-300">Watch frames coming soon!</h5>
        <p className="text-[10px] text-zinc-500 mt-1 max-w-[200px]">
          We are currently designing high-quality smartwatch presets for your mockups.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col text-xs">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Mockup Device Frame</span>
        </div>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full bg-[#1c1c20] hover:bg-[#222226] border border-zinc-800/80 rounded-xl p-2.5 transition flex items-center justify-between text-left cursor-pointer outline-hidden focus:ring-1 focus:ring-primary/40",
                open && "ring-1 ring-primary/40 bg-[#222226]"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {renderTriggerThumbnail()}
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-xs font-semibold text-zinc-100 truncate">
                    {activeDetails.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {activeDetails.resolution}
                  </span>
                </div>
              </div>
              
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 shrink-0 select-none ml-2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </PopoverTrigger>
          
          <PopoverContent 
            align="end" 
            side="left" 
            sideOffset={12} 
            className="w-[348px] p-3.5 bg-[#18181b] border-zinc-850 rounded-3xl shadow-2xl z-50 text-zinc-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Category selection pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none scrollbar-none shrink-0">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer select-none",
                      active
                        ? "bg-white text-zinc-950 px-3.5 h-8.5 rounded-full text-xs font-semibold gap-1.5 shadow-sm"
                        : "bg-zinc-850/65 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200",
                      // Inactive non-all categories display as a circular button
                      !active && cat.id !== "all" ? "size-8.5 rounded-full" : "",
                      // Inactive "all" displays as a small text pill
                      !active && cat.id === "all" ? "h-8.5 px-3.5 rounded-full text-xs font-medium" : ""
                    )}
                  >
                    {/* Render Category Icons */}
                    {cat.id !== "all" && (
                      <span className={cn("shrink-0", active ? "text-zinc-950" : "text-zinc-400")}>
                        {cat.id === "phone" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                            <path d="M12 18h.01"/>
                          </svg>
                        )}
                        {cat.id === "tablet" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" transform="rotate(90 12 12)"/>
                            <path d="M12 18h.01"/>
                          </svg>
                        )}
                        {cat.id === "laptop" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12"/>
                            <path d="M2 20h20"/>
                            <path d="M12 16v4"/>
                          </svg>
                        )}
                        {cat.id === "desktop" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="14" x="2" y="3" rx="2"/>
                            <line x1="8" x2="16" y1="21" y2="21"/>
                            <line x1="12" x2="12" y1="17" y2="21"/>
                          </svg>
                        )}
                        {cat.id === "watch" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="12" height="18" x="6" y="3" rx="3"/>
                            <path d="M12 3V1"/>
                            <path d="M12 23v-2"/>
                            <path d="M12 7V9"/>
                          </svg>
                        )}
                      </span>
                    )}
                    {/* Render Category Text Labels (Only when active, or if it is "All" category) */}
                    {(active || cat.id === "all") && (
                      <span className="leading-none text-[11px] font-semibold">{cat.label}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Scrollable list content */}
            <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-4 min-h-0 scrollbar-thin">
              {renderCatalogContent()}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
