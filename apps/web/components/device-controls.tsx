import { Button } from "@workspace/ui/components/button";
import { IconDeviceLaptop, IconX } from "@tabler/icons-react";
import { appleFrames } from "@/lib/constants";
import { EditorState, Action } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DeviceControlsProps {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
  setIsDeviceCatalogOpen: (open: boolean) => void;
}

export function DeviceControls({
  state,
  dispatch,
  setIsDeviceCatalogOpen,
}: DeviceControlsProps) {
  const currentFrameStyle = state.frameStyle ?? "none";

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Device Type Select */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Device Mockup Type</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["desktop", "mobile"] as const).map((device) => {
            const active = (state.deviceType ?? "desktop") === device;
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
                  if (device === "mobile") {
                    if (currentFrameStyle === "browser-light") nextFrameStyle = "phone-light";
                    if (currentFrameStyle === "browser-dark") nextFrameStyle = "phone-dark";
                    if (currentFrameStyle === "none") nextFrameStyle = "none";
                    if (currentFrameStyle === "custom-device") nextFrameStyle = "custom-device";
                  } else {
                    if (currentFrameStyle === "phone-light") nextFrameStyle = "browser-light";
                    if (currentFrameStyle === "phone-dark") nextFrameStyle = "browser-dark";
                    if (currentFrameStyle === "none") nextFrameStyle = "none";
                    if (currentFrameStyle === "custom-device") nextFrameStyle = "custom-device";
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
          {state.deviceType === "mobile" ? (
            (["none", "phone-light", "phone-dark"] as const).map((styleName) => {
              const active = currentFrameStyle === styleName;
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
              const active = currentFrameStyle === styleName;
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

        {state.frameStyle === "custom-device" && state.selectedFrame && (
          <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Active Device</span>
              <span className="text-[10px] font-medium text-foreground truncate">
                {appleFrames.find(f => f.id === state.selectedFrame?.id)?.name} ({state.selectedFrame.color})
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
}
