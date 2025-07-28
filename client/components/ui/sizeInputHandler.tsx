"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SizeInputHandlerProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const SizeInputHandler = ({
  value = 1,
  onChange,
  min = 1,
  max = 100,
  className,
}: SizeInputHandlerProps) => {
  const [count, setCount] = useState(value);

  const handleIncrement = () => {
    if (count < max) {
      setCount((prev) => {
        const newVal = prev + 1;
        onChange?.(newVal);
        return newVal;
      });
    }
  };

  const handleDecrement = () => {
    if (count > min) {
      setCount((prev) => {
        const newVal = prev - 1;
        onChange?.(newVal);
        return newVal;
      });
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3   bg-light-gray  w-[120px] h-12",
        className
      )}
    >
      <button
        type="button"
        className="text-lg font-bold text-black focus:text-warm-orange-brown"
        onClick={handleDecrement}
        disabled={count <= min}
      >
        –
      </button>
      <span className="text-xs text-black font-bold w-6 text-center">
        {count}
      </span>
      <button
        type="button"
        className="text-lg font-bold text-black focus:text-warm-orange-brown"
        onClick={handleIncrement}
        disabled={count >= max}
      >
        +
      </button>
    </div>
  );
};

export default SizeInputHandler;
