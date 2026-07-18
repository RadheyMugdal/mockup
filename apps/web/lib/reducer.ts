import { HistoryState, Action, EditorState, MockupPreset } from "./types";
import { initialState, defaultScreenshotSettings } from "./constants";

export function reducer(state: HistoryState, action: Action): HistoryState {
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

export function getScreenshotSetting(
  screenshot: EditorState["screenshot"] | undefined,
  key: keyof typeof defaultScreenshotSettings
) {
  return screenshot?.[key] ?? defaultScreenshotSettings[key];
}

export function isActivePreset(
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
