import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[13.322px] whitespace-nowrap w-fit transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 ",
  {
    variants: {
      variant: {
        default:
          "bg-warm-orange-brown text-xs uppercase leading-normal font-bold text-white hover:bg-peachy-orange",
        secondary:
          "bg-transparent text-xs uppercase font-bold leading-normal text-black border shadow-xs hover:bg-black hover:text-white ",
        tertiary:
          "text-warm-orange-brown uppercase font-bold bg-transparent  leading-normal hover:bg-accent hover:text-accent-foreground ",
      },
      size: {
        default: "h-12 px-[31.5px] py-[15px]",
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
          <span className="transform duration-200 ease-in-out group-hover:translate-x-[4px]">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

export { Button, buttonVariants };
