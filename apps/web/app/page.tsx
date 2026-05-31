"use client";
import { EditorState, HistoryState } from "@/lib/types";
import { backgrounds, categories, cn } from "@/lib/utils";
import { IconArrowBackUp, IconArrowDownToArc, IconArrowsMaximize, IconPaintFilled, IconStackForward, IconUpload, IconX } from "@tabler/icons-react";
import { AspectRatio } from "@workspace/ui/components/aspect-ratio";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Sidebar, SidebarContent, SidebarProvider } from "@workspace/ui/components/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { useReducer, useState } from "react";


const initialState: EditorState = {
  background: '/images/backgrounds/desktop/desktop-01.jpg'
}

type Action =
  { type: 'update', payload: Partial<EditorState> }
  | { type: 'redo' }
  | { type: 'undo' }
  | { type: 'reset' }
  | { type: 'preview' }

function reducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case 'update':
      const newPresent: EditorState = {
        ...state.present,
        ...action.payload

      }
      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: []
      }
    case 'undo':
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        present: previous!,
        future: [state.present, ...state.future]
      }
    case 'redo':
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        past: [...state.past, state.present],
        present: next!,
        future: state.future.slice(1)
      }
    case 'reset':
      return {
        past: [],
        present: initialState,
        future: []
      }
    default:
      return state
  }
}
export default function Page() {
  const [state, dispatch] = useReducer(reducer, {
    past: [],
    present: initialState,
    future: []
  })
  const [startOverOpen, setStartOverOpen] = useState(false);

  const canRedo = state.future.length > 0
  const canUndo = state.past.length > 0
  const handleBackgroundImageSelection = (bgUrl: string) => {
    dispatch({
      type: 'update', payload: {
        background: bgUrl
      }
    })
  }
  return (
    <main className="w-svw h-svh  flex flex-col">
      {/* Main content  */}
      <div className="flex-1 flex ">
        {/* Sidebar  */}
        <SidebarProvider>
          <Sidebar className=" w-72">
            <SidebarContent className=" p-2  h-full flex flex-col">
              <Tabs defaultValue="background" className=" h-full flex flex-col" >
                <TabsList className=" w-full grid grid-cols-2 " >
                  <TabsTrigger value="background" className="  data-active:bg-card! data-active:border-none! data-active:text-card-foreground! " >
                    <IconStackForward />
                    Background</TabsTrigger>
                  <TabsTrigger value="colors" className="  data-active:bg-card! data-active:border-none! data-active:text-card-foreground! ">
                    <IconPaintFilled />
                    Colors</TabsTrigger>
                </TabsList>
                <div className=" pt-2 flex-1 min-h-0">
                  <TabsContent value="background" className=" h-full">
                    <ScrollArea className=" h-full">

                      {categories.map((category) => {
                        const Icon = category.icon;

                        const categoryBackgrounds = backgrounds.filter(
                          (bg) => bg.category === category.id
                        );

                        return (
                          <div key={category.id} className="mb-4">

                            <div className="text-sm flex items-center gap-1 opacity-80 ">
                              <Icon className="size-4" />
                              <span>{category.label}</span>
                            </div>


                            <div className="w-full mt-1.5 flex flex-wrap">
                              {categoryBackgrounds
                                .slice(0, 11)
                                .map((bg) => (
                                  <div
                                    key={bg.backgroundUrl}
                                    className=" p-1"
                                    onClick={() =>
                                      handleBackgroundImageSelection(bg.backgroundUrl)
                                    }
                                  >
                                    <img
                                      src={bg.previewUrl}
                                      alt="background"
                                      className={cn(
                                        "size-9 rounded-md cursor-pointer transition",
                                        state.present.background === bg.backgroundUrl
                                          ? "ring-2 ring-primary"
                                          : "hover:ring-2 hover:ring-primary/50"
                                      )}
                                    />
                                  </div>
                                ))}

                              {categoryBackgrounds.length > 11 && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className=" size-9 m-1 rounded-md text-xs"
                                    >
                                      +{categoryBackgrounds.length - 11}
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
                                      <div className=" flex flex-wrap   gap-2 pr-2">
                                        {categoryBackgrounds.map((bg) => (
                                          <button
                                            key={bg.backgroundUrl}
                                            type="button"
                                            onClick={() =>
                                              handleBackgroundImageSelection(bg.backgroundUrl)
                                            }
                                          >
                                            <img
                                              src={bg.previewUrl}
                                              alt="background"
                                              className={cn(
                                                "size-9 rounded-md transition",
                                                state.present.background === bg.backgroundUrl
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
                    </ScrollArea>

                  </TabsContent>
                  <TabsContent value="colors">

                  </TabsContent>
                </div>
              </Tabs>
            </SidebarContent>
          </Sidebar>

          {/* Canvas  */}
          <main className=" flex min-w-0 flex-col w-full h-full">
            {/* Top bar */}
            <div className=" h-14 w-full flex items-center justify-center gap-4">
              <div className=" flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size={"icon"} disabled={!canUndo} onClick={() => dispatch({ type: 'undo' })} variant={"outline"}>
                      <IconArrowBackUp />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Undo
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size={"icon"} disabled={!canRedo} onClick={() => dispatch({ type: "redo" })} variant={"outline"}>
                      <IconArrowBackUp className=" rotate-180 rotate-x-180" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Redo
                  </TooltipContent>
                </Tooltip>
              </div>
              <Popover onOpenChange={setStartOverOpen} open={startOverOpen} >
                <PopoverTrigger asChild>
                  <Button>
                    Start over
                  </Button>
                </PopoverTrigger>
                <PopoverContent  >
                  <div className=" p-2 flex flex-col gap-4">
                    <span>Are you sure you want to start over?</span>
                    <div className=" grid grid-cols-2 gap-2">
                      <Button onClick={() => setStartOverOpen(false)}>
                        <IconX />
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => {
                        dispatch({ type: 'reset' })
                        setStartOverOpen(false)
                      }}>
                        Confirm
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant={"outline"}>
                      <IconArrowsMaximize />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Preview
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden ">
              <AspectRatio
                ratio={16 / 9}
                className="mx-auto  m-4 relative w-[min(100%,56rem,calc((100svh-6.5rem)*1.7777777778))] bg-accent rounded-2xl overflow-hidden"
              >
                <img
                  src={state.present.background}
                  alt="mockup"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center ">
                  <div
                    className="mockup-card drop-shadow-[0_40px_60px_rgba(0,0,0,.3)] w-[85%] max-w-4xl bg-accent rounded-xl overflow-hidden"
                    style={{
                      transform: `
          translate(${state.present.screenshot?.x}px, ${state.present.screenshot?.y}px)
          rotateX(${12}deg)
          rotateY(${state.present.screenshot?.rotateY}deg)
          rotateZ(${state.present.screenshot?.rotateZ}deg)
          scale(${state.present.screenshot?.zoom})
        `,
                    }}
                  >
                   {
  !state.present.screenshot?.image ? (
    <label
      className="
        aspect-video w-full
        flex flex-col items-center justify-center
        gap-4
        cursor-pointer
        rounded-md
        border-2 border-dashed
        border-border/60
        bg-background/50
        backdrop-blur-sm
        transition-all
        hover:border-primary
        hover:bg-background
      "
    >
      <div
        className="
          flex items-center justify-center
          size-20 rounded-full
          bg-primary/10
        "
      >
        <IconUpload className="size-10 text-primary" />
      </div>

      <div className="text-center">
        <p className="font-medium">
          Upload screenshot
        </p>

        <p className="text-sm text-muted-foreground">
          Drag & drop or click to browse
        </p>

        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG, WEBP
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();

          reader.onload = () => {
            dispatch({
              type: "update",
              payload: {
                screenshot: {
                  image: reader.result as string,
                  x: 0,
                  y: 0,
                  zoom: 1,
                  rotateY: 0,
                  rotateZ: 0,
                },
              },
            });
          };

          reader.readAsDataURL(file);
        }}
      />
    </label>
  ) : (
    <img
      src={state.present.screenshot.image}
      className="aspect-video w-full object-cover"
      alt="Screenshot"
    />
  )
}

                  </div>
                </div>
              </AspectRatio>
            </div>
          </main>

          <Sidebar side="right">
            <SidebarContent className=" ml-2 p-2">
              <Button>
                <IconArrowDownToArc />
                Export mockup
              </Button>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
    </main>
  )
}
