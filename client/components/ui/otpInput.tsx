import React, { useRef } from "react";

type OtpInputProps = {
  length?: number;
  onChange?: (otp: string) => void;
  index?: number;
  value?: string;
};

const OtpInput = ({ length = 6, onChange }: OtpInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  interface HandleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  interface HandleKeyDownEvent extends React.KeyboardEvent<HTMLInputElement> {}

  const handleChange = (e: HandleChangeEvent, index: number): void => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    const prevNotFilled = inputsRef.current
      .slice(0, index)
      .some((input) => input && input.value === "");

    if (prevNotFilled) return;

    const newOtp = inputsRef.current
      .map((input) => (input && input.value ? input.value : ""))
      .join("")
      .padEnd(length, ""); // Pads with empty string to ensure consistent length
    onChange?.(newOtp);

    if (value && index < length - 1) {
      if (inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]!.focus();
      }
    }
  };

  const handleKeyDown = (e: HandleKeyDownEvent, index: number) => {
    if (
      e.key === "Backspace" &&
      !(e.target as HTMLInputElement).value &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-[57px w-full h-[64px] text-center border border-[#D0D5DD] rounded-lg text-lg text-base-900 font-semibold bg-white focus:outline-none focus:border-[#DE6A4C] focus:shadow-[0px_1px_2px_0px_#E58870,0px_0px_0px_4px_#F8E1DB] transition"
        />
      ))}
    </div>
  );
};

export default OtpInput;
