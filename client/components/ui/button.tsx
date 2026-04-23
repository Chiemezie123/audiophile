import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3  rounded-full transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#d87d4a] text-xs font-bold uppercase leading-normal tracking-[0.24em] text-white shadow-[0_14px_32px_rgba(216,125,74,0.24)] hover:bg-[#f0a57b]",
        secondary:
          "border border-black/14 bg-transparent text-xs font-bold uppercase leading-normal tracking-[0.24em] text-black hover:border-[#15161a] hover:bg-[#15161a] hover:text-white",
        outline:
          "border border-black/14 bg-transparent text-xs font-bold uppercase leading-normal tracking-[0.24em] text-black hover:border-[#15161a] hover:bg-[#15161a] hover:text-white",
        tertiary:
          "bg-transparent text-xs font-bold uppercase leading-normal tracking-[0.24em] text-black/55 hover:text-[#d87d4a]",
        quaternary:
          "border border-black/8 bg-[#15161a] text-xs font-bold uppercase leading-normal tracking-[0.24em] text-white hover:bg-[#2b2e36]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-[18px]",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn("group", buttonVariants({ variant, size, className }))}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span>{leftIcon}</span>}
        {props.children}
        {rightIcon && (
          <span className=" flex items-center justify-center transform duration-200 ease-in-out group-hover:translate-x-[4px]">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

export { Button, buttonVariants };
