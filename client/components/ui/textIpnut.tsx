"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  label?: string;
  labelCustomClassName?: string;
  errorMsg?: string;
  successMsg?: string;
  isInput?: boolean;
  hideErrorMsg?: boolean;
  selectLabel?: string;
  placeholder?: string;
  selectPlaceholder?: string;
  selectItemValues?: string[];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  selectClassName?: string;
  max?: number | string;
  min?: number | string;
}

function Input({
  className,
  type,
  label,
  labelCustomClassName,
  errorMsg,
  successMsg,
  isInput = true,
  hideErrorMsg = false,
  selectLabel,
  placeholder,
  selectPlaceholder,
  selectItemValues,
  leftIcon,
  rightIcon,
  selectClassName,
  max,
  min,
  ...props
}: InputProps) {
  const [isValid, setIsValid] = useState({});

  return (
    <div className="group flex flex-col gap-[9px] w-full items-start">
      {label && (
        <label
          className={cn(
            "text-[12px] text-black font-bold tracking-[-0.214px]  w-fit first-letter:capitalize",
            labelCustomClassName
          )}
          htmlFor={props.name}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          id={props.name}
          placeholder={placeholder}
          data-slot="input"
          max={max}
          min={min}
          className={cn(
            "bg-white border-[#CFCFCF] flex h-[56px] font-bold w-full rounded-md border max-w-[309px] px-[1.5rem] py-[1.125rem] tracking-[-0.25px] text-sm outline-none placeholder:text-black placeholder:opacity-50 selection:border-[#CFCFCF] selection:text-black ",
            "focus:border-warm-orange-brown ",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-base-50 disabled:text-gray-200 disabled:border-none",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "placeholder:text-sm lg:placeholder:text-sm xl:placeholder:text-sm",
            className,
            leftIcon && "pl-10",
            rightIcon && "pr-10"
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>

      {!hideErrorMsg && (errorMsg || successMsg) ? (
        <p
          className={cn(
            "text-base-500 text-xs font-circular tracking-[-0.24px]",
            errorMsg ? "text-danger-500" : "text-success-500"
          )}
        >
          {errorMsg || successMsg}
        </p>
      ) : null}
    </div>
  );
}

export { Input };
