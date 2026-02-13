import * as React from "react";

export interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  step?: number;
  className?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className = "", value = [0], onValueChange, max = 100, step = 1 }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onValueChange) {
        onValueChange([Number(e.target.value)]);
      }
    };

    return (
      <div ref={ref} className={`relative flex w-full touch-none select-none items-center ${className}`}>
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #0f172a 0%, #0f172a ${(value[0] / max) * 100}%, #e2e8f0 ${(value[0] / max) * 100}%, #e2e8f0 100%)`
          }}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
