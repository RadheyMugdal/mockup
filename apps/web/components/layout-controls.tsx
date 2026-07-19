import { IconCheck } from "@tabler/icons-react";
import { mockupPresets } from "@/lib/constants";
import { EditorState, Action, MockupPreset } from "@/lib/types";
import { isActivePreset } from "@/lib/reducer";
import { cn } from "@/lib/utils";

interface LayoutControlsProps {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
}

export function LayoutControls({ state, dispatch }: LayoutControlsProps) {
  const applyMockupPreset = (preset: MockupPreset) => {
    let nextFrameStyle: EditorState["frameStyle"] = preset.frameStyle;
    if (state.deviceType === "mobile") {
      if (preset.frameStyle === "browser-light") nextFrameStyle = "phone-light";
      if (preset.frameStyle === "browser-dark") nextFrameStyle = "phone-dark";
    }
    dispatch({
      type: "update",
      payload: {
        screenshot: {
          ...state.screenshot,
          ...preset.settings,
        },
        frameStyle: nextFrameStyle,
      },
    });
  };

  return (
    <div className="flex flex-col gap-3.5 pb-2">
      {mockupPresets.map((preset) => {
        const active = isActivePreset(preset, state);
        
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyMockupPreset(preset)}
            className={cn(
              "group relative rounded-xl border bg-card p-2 text-left transition select-none cursor-pointer w-full overflow-hidden",
              active
                ? "border-primary ring-1 ring-primary/20 bg-primary/5"
                : "border-border/40 hover:border-primary/30"
            )}
          >
            {/* 3D Layout Preview Card */}
            <div className="relative mb-2 aspect-video overflow-hidden rounded-lg bg-muted border border-border/10">
              {/* Canvas Background */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    state.backgroundType === "color"
                      ? state.background
                      : `url(${state.background}) center/cover no-repeat`,
                }}
              />
              
              {/* Mockup Card Container */}
              <div 
                className="absolute inset-0 flex items-center justify-center" 
                style={{ perspective: `${preset.settings.perspective / 2}px` }}
              >
                <div
                  className="w-[72%] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl flex flex-col transition-all duration-300"
                  style={{
                    borderRadius: `${Math.max(
                      preset.settings.radius / 3.5,
                      4
                    )}px`,
                    transform: `
                      translate(${preset.settings.x / 5}px, ${preset.settings.y / 5}px)
                      rotateX(${preset.settings.rotateX}deg)
                      rotateY(${preset.settings.rotateY}deg)
                      rotateZ(${preset.settings.rotateZ}deg)
                      scale(${preset.settings.zoom * 0.95})
                    `,
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                    outline: "1px solid transparent",
                  }}
                >
                  {/* Browser Header Bar simulation */}
                  {preset.frameStyle && preset.frameStyle !== "none" && (
                    <div
                      className={cn(
                        "flex h-2.5 w-full items-center justify-between border-b px-1 select-none shrink-0",
                        preset.frameStyle === "browser-dark"
                          ? "bg-zinc-950 border-zinc-900 text-[2px]"
                          : "bg-zinc-100 border-zinc-200 text-[2px]"
                      )}
                    >
                      <div className="flex items-center gap-[1.5px] w-1/3">
                        <span className="size-[2.5px] rounded-full bg-red-400/80" />
                        <span className="size-[2.5px] rounded-full bg-yellow-400/80" />
                        <span className="size-[2.5px] rounded-full bg-green-400/80" />
                      </div>
                      <div className="h-[2px] w-4 rounded-xs bg-zinc-700/30" />
                      <div className="w-1/3" />
                    </div>
                  )}

                  {/* Preview Image */}
                  {state.screenshot?.image ? (
                    <img
                      src={state.screenshot.image}
                      alt=""
                      className="aspect-video w-full object-cover rounded-[inherit]"
                    />
                  ) : (
                    <div className="aspect-video rounded-[inherit] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500/80">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Label and Info */}
            <div className="flex items-center justify-between px-1">
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-foreground leading-tight">
                  {preset.name}
                </div>
                <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                  {preset.detail}
                </div>
              </div>
              {active ? (
                <span className="shrink-0 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <IconCheck className="size-3" />
                </span>
              ) : (
                <span className="shrink-0 text-[10px] font-semibold text-muted-foreground/60 group-hover:text-foreground transition opacity-0 group-hover:opacity-100 pr-1 select-none">
                  Apply
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
