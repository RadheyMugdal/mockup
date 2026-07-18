export type EditorState = {
  background: string;
  backgroundType?: "image" | "color";
  screenshot?: {
    radius?: number;
    padding?: number;
    image?: string;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    perspective?: number;
    zoom?: number;
    x?: number;
    y?: number;
  };
  frame?: {
    type: "macbook" | "imac" | "macbook-pro" | "iphone" | "ipad";
    image?: string;
  };
  frameStyle?: "none" | "browser-light" | "browser-dark" | "phone-light" | "phone-dark" | "custom-device";
  deviceType?: "desktop" | "mobile";
  selectedFrame?: {
    id: string;
    color: string;
  };
};

export type HistoryState = {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
};

export type ScreenshotSettings = NonNullable<EditorState["screenshot"]>;
export type NumericScreenshotSetting = Exclude<keyof ScreenshotSettings, "image">;

export type MockupPreset = {
  id: string;
  name: string;
  detail: string;
  frameStyle: "none" | "browser-light" | "browser-dark";
  settings: Required<Omit<ScreenshotSettings, "image">>;
};

export type ColorPreset = {
  name: string;
  value: string;
};

export type AppleFrame = {
  id: string;
  name: string;
  brand: "Apple" | "Google" | "Samsung" | "Dell" | "Lenovo" | "Huawei";
  category: "all" | "phone" | "tablet" | "laptop" | "desktop" | "watch";
  aspectRatio: string;
  displayRatioClass: string;
  resolution: string;
  status?: "New" | "Featured";
  colors: { name: string; value: string; hex: string }[];
  insets: { top: string; left: string; right: string; bottom: string; borderRadius: string };
  assetPattern: string;
};

export type Action =
  | { type: "update"; payload: Partial<EditorState> }
  | { type: "redo" }
  | { type: "undo" }
  | { type: "reset" }
  | { type: "preview" };
