import SliderDemo from "@/components/shadcn-space/slider/slider-04";
import { sliderSettings } from "@/lib/constants";
import { EditorState, NumericScreenshotSetting } from "@/lib/types";
import { getScreenshotSetting } from "@/lib/reducer";

interface FineTuneControlsProps {
  state: EditorState;
  updateScreenshot: (payload: Partial<NonNullable<EditorState["screenshot"]>>) => void;
}

export function FineTuneControls({ state, updateScreenshot }: FineTuneControlsProps) {
  const handleScreenshotSliderChange =
    (key: NumericScreenshotSetting, fallback: number) => (value: number[]) => {
      updateScreenshot({ [key]: value[0] ?? fallback });
    };

  return (
    <div className="flex flex-col gap-4">
      {sliderSettings.map((setting) => {
        const value = getScreenshotSetting(
          state.screenshot,
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
}
