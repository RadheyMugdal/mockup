export type EditorState={
    background:string,
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

}

export type HistoryState={
    past:EditorState[],
    present:EditorState,
    future:EditorState[]
}
