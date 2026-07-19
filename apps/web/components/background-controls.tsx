import { useEffect, useState } from "react";
import SliderDemo from "@/components/shadcn-space/slider/slider-04";
import { solidPresets, gradientPresets } from "@/lib/constants";
import { cn, backgrounds, categories } from "@/lib/utils";
import { EditorState, Action } from "@/lib/types";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  IconStackForward,
  IconPaintFilled,
  IconCheck,
  IconTrash,
  IconPlus,
  IconHeart,
  IconPalette,
} from "@tabler/icons-react";

interface BackgroundAndColorsControlsProps {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
}

export function BackgroundAndColorsControls({
  state,
  dispatch,
}: BackgroundAndColorsControlsProps) {
  const [activeTab, setActiveTab] = useState<"background" | "colors">(
    state.backgroundType === "color" ? "colors" : "background"
  );
  const [lastSelectedImage, setLastSelectedImage] = useState<string>(
    state.backgroundType === "image" || !state.backgroundType
      ? state.background
      : "/images/backgrounds/desktop/desktop-01.jpg"
  );
  const [lastSelectedColor, setLastSelectedColor] = useState<string>(
    state.backgroundType === "color"
      ? state.background
      : "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)"
  );

  const [colorSubTab, setColorSubTab] = useState<"presets" | "custom" | "saved">("presets");
  const [customColor, setCustomColor] = useState("#f8fafc");

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

  // Sync custom gradient compile live to parent canvas state
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
          backgroundType: "color",
        },
      });
    }
  }, [
    activeTab,
    colorSubTab,
    gradientType,
    gradientAngle,
    radialShape,
    radialPosition,
    radialX,
    radialY,
    gradientStops,
  ]);

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
          <div className="flex-1 min-h-0 space-y-4">
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

                  <div className="mt-1.5 grid grid-cols-6 gap-2 w-full">
                    {categoryBackgrounds.slice(0, 17).map((bg) => (
                      <button
                        key={bg.backgroundUrl}
                        type="button"
                        className={cn(
                          "relative aspect-square rounded-md overflow-hidden transition w-full border border-black/5 cursor-pointer",
                          state.backgroundType === "image" &&
                            state.background === bg.backgroundUrl
                            ? "ring-2 ring-primary"
                            : "hover:ring-2 hover:ring-primary/50"
                        )}
                        onClick={() =>
                          handleBackgroundImageSelection(bg.backgroundUrl)
                        }
                        aria-label={`Use ${bg.name}`}
                      >
                        <img
                          src={bg.previewUrl}
                          alt=""
                          className="absolute inset-0 size-full object-cover"
                        />
                      </button>
                    ))}

                    {categoryBackgrounds.length > 17 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="aspect-square w-full rounded-md text-xs p-0 h-auto cursor-pointer"
                          >
                            +{categoryBackgrounds.length - 17}
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
                                    handleBackgroundImageSelection(bg.backgroundUrl)
                                  }
                                  aria-label={`Use ${bg.name}`}
                                >
                                  <img
                                    src={bg.previewUrl}
                                    alt=""
                                    className={cn(
                                      "size-9 rounded-md transition",
                                      state.backgroundType === "image" &&
                                        state.background === bg.backgroundUrl
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
          </div>
        </TabsContent>

        <TabsContent value="colors" className="h-full flex flex-col min-h-0 flex-1">
          <div className="flex flex-col h-full min-h-0 flex-1">
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

            <div className="flex-1 min-h-0 space-y-4">
              {colorSubTab === "presets" && (
                <div className="space-y-6 px-0.5">
                  {/* Solids Section */}
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>Solid Presets</span>
                      <span className="text-[10px] text-muted-foreground/80 font-normal">{solidPresets.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {solidPresets.map((color) => {
                        const isSelected =
                          state.backgroundType === "color" &&
                          state.background === color.value;

                        return (
                          <button
                            key={color.name}
                            type="button"
                            className={cn(
                              "group relative overflow-hidden rounded-lg border bg-card p-2 text-left transition w-full",
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
                          state.backgroundType === "color" &&
                          state.background === color.value;

                        return (
                          <button
                            key={color.name}
                            type="button"
                            className={cn(
                              "group relative overflow-hidden rounded-lg border bg-card p-2 text-left transition w-full",
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
                        className="font-mono text-xs h-9 w-full flex-1 min-w-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {colorSubTab === "custom" && (
                <div className="space-y-4 px-0.5">
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
                          className="text-xs h-8 capitalize w-full"
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
                              className="text-[11px] h-7 capitalize w-full"
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
                              className="text-[10px] h-6 px-1 w-full"
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
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {gradientStops.map((stop) => (
                        <div key={stop.id} className="flex flex-col gap-1.5 p-2 rounded-xl border border-border/40 bg-card/35">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Color Indicator */}
                              <div className="relative size-7 shrink-0 rounded-md overflow-hidden border border-border shadow-xs cursor-pointer">
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
                              <span className="text-[10px] font-mono font-semibold text-muted-foreground/80">{stop.color}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Precise percentage input */}
                              <div className="flex items-center gap-1">
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
                                  className="w-12 text-center h-7 text-[10px] font-mono px-1! [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="text-[10px] text-muted-foreground">%</span>
                              </div>

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
                                className="size-7 text-muted-foreground hover:text-destructive"
                              >
                                <IconTrash className="size-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Position range slider */}
                          <div className="flex items-center px-1">
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
                              className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
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
                  <div className="pt-3 border-t border-border/30 mt-4 flex flex-col gap-2">
                    <Input
                      placeholder="Preset Name"
                      value={customPresetName}
                      onChange={(e) => setCustomPresetName(e.target.value)}
                      className="text-xs h-8 w-full"
                    />
                    <Button
                      type="button"
                      onClick={saveToPresets}
                      className="text-xs h-8 w-full bg-primary/95 text-primary-foreground hover:bg-primary font-medium"
                    >
                      <IconHeart className="size-3.5 mr-1" />
                      Save Preset
                    </Button>
                  </div>
                </div>
              )}

              {colorSubTab === "saved" && (
                <div className="space-y-4 px-0.5">
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
                          state.backgroundType === "color" &&
                          state.background === color.value;

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
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
