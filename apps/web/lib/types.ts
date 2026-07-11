export type EditorState={
    background:string,
    backgroundType?:"image" | "color",
    screenshot?:{
        radius?:number,
        padding?:number,
        image?:string,
        rotateX?:number,
        rotateY?:number,
        rotateZ?:number,
        perspective?:number,
        zoom?:number,
        x?:number,
        y?:number
    },
    frame?:{
        type:"macbook" | "imac" | "macbook-pro" | "iphone" | "ipad",
        image?:string
    },
    frameStyle?: "none" | "browser-light" | "browser-dark" | "phone-light" | "phone-dark" | "custom-device",
    deviceType?: "desktop" | "mobile",
    selectedFrame?: {
        id: string;
        color: string;
    };
}

export type HistoryState={
    past:EditorState[],
    present:EditorState,
    future:EditorState[]
}
