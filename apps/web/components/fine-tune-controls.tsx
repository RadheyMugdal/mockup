import { useState, useRef, useEffect } from "react";
import SliderDemo from "@/components/shadcn-space/slider/slider-04";
import { EditorState, NumericScreenshotSetting } from "@/lib/types";
import { getScreenshotSetting } from "@/lib/reducer";
import { cn } from "@/lib/utils";

interface FineTuneControlsProps {
  state: EditorState;
  updateScreenshot: (payload: Partial<NonNullable<EditorState["screenshot"]>>) => void;
}

export function FineTuneControls({ state, updateScreenshot }: FineTuneControlsProps) {
  const [activeTab, setActiveTab] = useState<"zoom" | "tilt">("zoom");
  const [isDragging, setIsDragging] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  const x = getScreenshotSetting(state.screenshot, "x");
  const y = getScreenshotSetting(state.screenshot, "y");
  const zoom = getScreenshotSetting(state.screenshot, "zoom");
  const radius = getScreenshotSetting(state.screenshot, "radius");
  const padding = getScreenshotSetting(state.screenshot, "padding");
  const rotateX = getScreenshotSetting(state.screenshot, "rotateX");
  const rotateY = getScreenshotSetting(state.screenshot, "rotateY");
  const rotateZ = getScreenshotSetting(state.screenshot, "rotateZ");
  const perspective = getScreenshotSetting(state.screenshot, "perspective");

  const handleScreenshotSliderChange =
    (key: NumericScreenshotSetting, fallback: number) => (value: number[]) => {
      updateScreenshot({ [key]: value[0] ?? fallback });
    };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
    lastXRef.current = clientX;
    lastYRef.current = clientY;
    handleDrag(e, false);
  };

  const handleDrag = (e: any, isMove = true) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const isShift = e.shiftKey;

    if (activeTab === "zoom") {
      const xMin = -300;
      const xMax = 300;
      const yMin = -200;
      const yMax = 200;

      let nextX = x;
      let nextY = y;

      if (isShift && isMove) {
        const dx = clientX - lastXRef.current;
        const dy = clientY - lastYRef.current;
        nextX = Math.round(nextX + (dx / rect.width) * (xMax - xMin) * 0.15);
        nextY = Math.round(nextY + (dy / rect.height) * (yMax - yMin) * 0.15);
      } else {
        const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        nextX = Math.round(xMin + px * (xMax - xMin));
        nextY = Math.round(yMin + py * (yMax - yMin));
      }

      nextX = Math.max(xMin, Math.min(xMax, nextX));
      nextY = Math.max(yMin, Math.min(yMax, nextY));
      updateScreenshot({ x: nextX, y: nextY });
    } else {
      const rxMin = -80;
      const rxMax = 80;
      const ryMin = -80;
      const ryMax = 80;

      let nextRX = rotateX;
      let nextRY = rotateY;

      if (isShift && isMove) {
        const dx = clientX - lastXRef.current;
        const dy = clientY - lastYRef.current;
        nextRY = Math.round(nextRY + (dx / rect.width) * (ryMax - ryMin) * 0.15);
        nextRX = Math.round(nextRX - (dy / rect.height) * (rxMax - rxMin) * 0.15);
      } else {
        const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        nextRY = Math.round(ryMin + px * (ryMax - ryMin));
        nextRX = Math.round(rxMax - py * (rxMax - rxMin));
      }

      nextRX = Math.max(rxMin, Math.min(rxMax, nextRX));
      nextRY = Math.max(ryMin, Math.min(ryMax, nextRY));
      updateScreenshot({ rotateX: nextRX, rotateY: nextRY });
    }

    lastXRef.current = clientX;
    lastYRef.current = clientY;
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => handleDrag(e);
    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, activeTab, x, y, rotateX, rotateY]);

  // Compute positions of elements in coordinate pad preview
  const tx = (x / 300) * 40; // max translation 40% of bounds
  const ty = (y / 200) * 40;

  const miniCardStyle = activeTab === "zoom"
    ? {
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${tx}%), calc(-50% + ${ty}%))`
      }
    : {
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) perspective(200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      };

  const handleLeft = activeTab === "zoom"
    ? 50 + (x / 300) * 50
    : 50 + (rotateY / 80) * 50;

  const handleTop = activeTab === "zoom"
    ? 50 + (y / 200) * 50
    : 50 - (rotateX / 80) * 50;

  const backgroundStyle = state.backgroundType === "color"
    ? { background: state.background }
    : { backgroundImage: `url(${state.background})`, backgroundSize: "cover", backgroundPosition: "center" };

  return (
    <div className="flex flex-col gap-4">
      {/* Mode selectors */}
      <div className="flex items-center justify-between">
        <div className="flex bg-zinc-955/60 p-0.5 rounded-lg border border-zinc-850 text-xs w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("zoom")}
            className={cn(
              "px-3.5 py-1 rounded-md font-medium transition cursor-pointer select-none text-[11px]",
              activeTab === "zoom"
                ? "bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/10 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Zoom
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tilt")}
            className={cn(
              "px-3.5 py-1 rounded-md font-medium transition cursor-pointer select-none text-[11px]",
              activeTab === "tilt"
                ? "bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/10 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Tilt
          </button>
        </div>
        <span className="text-[9px] text-zinc-500 italic select-none">
          Hold Shift for precision
        </span>
      </div>

      {/* Coordinate Pad */}
      <div
        ref={padRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        className="w-full aspect-[16/10] rounded-xl border border-zinc-800 bg-zinc-950/45 relative overflow-hidden shadow-inner cursor-crosshair select-none flex items-center justify-center"
      >
        {/* Canvas background simulation */}
        <div className="absolute inset-0" style={backgroundStyle} />

        {/* Center Grid Reference Lines */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10 pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10 pointer-events-none" />

        {/* Mini Mockup Card */}
        <div
          className={cn(
            "absolute bg-zinc-900 border border-zinc-700/60 rounded-sm shadow-xl flex flex-col overflow-hidden pointer-events-none select-none transition-all duration-75 ease-out",
            state.deviceType === "mobile"
              ? "w-8 aspect-[9/19.5]"
              : "w-16 aspect-video"
          )}
          style={miniCardStyle}
        >
          {/* Mini browser header */}
          {state.deviceType !== "mobile" && (
            <div className="h-1 w-full bg-zinc-950 border-b border-zinc-850 flex items-center gap-[1.5px] px-0.5 shrink-0">
              <span className="size-[1.5px] rounded-full bg-zinc-700" />
              <span className="size-[1.5px] rounded-full bg-zinc-700" />
              <span className="size-[1.5px] rounded-full bg-zinc-700" />
            </div>
          )}
          {/* Mini body content */}
          <div className="flex-1 bg-zinc-950/40 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-[1px] bg-zinc-800/60 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-600">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <line x1="9" x2="15" y1="9" y2="15"/>
                <line x1="15" x2="9" y1="9" y2="15"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Drag handle dot */}
        <div
          className="absolute size-3 rounded-full bg-zinc-100 border border-zinc-950/50 shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-75 ease-out z-20 flex items-center justify-center"
          style={{ left: `${handleLeft}%`, top: `${handleTop}%` }}
        >
          <span className="size-1 rounded-full bg-primary" />
        </div>
      </div>

      {/* Sliders based on active mode */}
      <div className="space-y-4 mt-2">
        {activeTab === "zoom" ? (
          <>
            <SliderDemo
              label="Zoom"
              value={[zoom]}
              setValue={handleScreenshotSliderChange("zoom", 1)}
              min={0.5}
              max={1.6}
              step={0.01}
              unit="x"
            />
            <SliderDemo
              label="Roundness"
              value={[radius]}
              setValue={handleScreenshotSliderChange("radius", 12)}
              min={0}
              max={100}
              step={0.1}
              unit="px"
            />
          </>
        ) : (
          <>
            <SliderDemo
              label="Rotate Z"
              value={[rotateZ]}
              setValue={handleScreenshotSliderChange("rotateZ", 0)}
              min={-180}
              max={180}
              step={1}
              unit="deg"
            />
            <SliderDemo
              label="Perspective"
              value={[perspective]}
              setValue={handleScreenshotSliderChange("perspective", 1200)}
              min={300}
              max={5000}
              step={10}
              unit="px"
            />
          </>
        )}
      </div>
    </div>
  );
}
