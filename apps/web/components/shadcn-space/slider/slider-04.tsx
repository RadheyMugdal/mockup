"use client";

import NumberFlow from "@number-flow/react";
import { Slider } from "@workspace/ui/components/slider";

function SliderDemo({label,value,setValue,unit,min,max,step}:{label:string,value: number[],setValue: (value: number[]) => void,unit?:string,min:number,max:number,step:number}) {

  return (
    <div className="w-full max-w-full">
      <div className="mb-2 flex items-center justify-between">
        <p className=" text-sm">
          {label}
        </p>
        <div className="text-sm">
          <NumberFlow
            value={value[0]!}
            format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
          />
          <span className="ml-0.5">{unit ? unit:'%'}</span>
        </div>
      </div>

      <Slider
        className="h-6 **:data-[slot=slider-track]:h-6 **:data-[slot=slider-track]:rounded-xl **:data-[slot=slider-track]:border **:data-[slot=slider-track]:border-border **:data-[slot=slider-track]:bg-muted **:data-[slot=slider-track]:shadow-[0_1px_2px_0px_rgba(0,0,0,0.1)] **:data-[slot=slider-track]:ring-1 **:data-[slot=slider-track]:ring-background **:data-[slot=slider-track]:ring-inset **:data-[slot=slider-range]:h-full **:data-[slot=slider-range]:ml-0.5 **:data-[slot=slider-range]:mr-0.5 **:data-[slot=slider-range]:overflow-hidden **:data-[slot=slider-range]:rounded-lg **:data-[slot=slider-range]:border **:data-[slot=slider-range]:border-border **:data-[slot=slider-range]:bg-foreground **:data-[slot=slider-range]:shadow-xs **:data-[slot=slider-thumb]:h-7 **:data-[slot=slider-thumb]:w-[3px] **:data-[slot=slider-thumb]:rounded-xl **:data-[slot=slider-thumb]:border-0 **:data-[slot=slider-thumb]:bg-muted **:data-[slot=slider-thumb]:shadow-none **:data-[slot=slider-thumb]:cursor-ew-resize **:data-[slot=slider-thumb]:transform-[translateX(-8px)] **:data-[slot=slider-thumb]:ring-0 **:data-[slot=slider-thumb]:hover:ring-0 **:data-[slot=slider-thumb]:focus-visible:ring-0"
        value={value}
        onValueChange={(val) => setValue(Array.isArray(val) ? val : [val])}
        min={min}
        max={max}
        step={step}
        aria-label="Volume"
      />
    </div>
  );
}

export default SliderDemo;
