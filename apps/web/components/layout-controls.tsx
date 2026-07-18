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
    <div className="grid grid-cols-2 gap-2">
      {mockupPresets.map((preset) => {
        const active = isActivePreset(preset, state);
        
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
                    state.backgroundType === "color"
                      ? state.background
                      : `url(${state.background}) center/cover no-repeat`,
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
}
