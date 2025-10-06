import React, { useRef } from "react";

type OtpInputProps = {
  length?: number;
  onChange?: (otp: string) => void;
  index?: number;
  value?: string;
};

const OtpInput = ({ length = 6, onChange, value = "" }: OtpInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  interface HandleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  interface HandleKeyDownEvent extends React.KeyboardEvent<HTMLInputElement> {}

  const handleChange = (e: HandleChangeEvent, index: number): void => {
    const inputValue = e.target.value;

    if (!/^\d?$/.test(inputValue)) return;

    // Create new OTP string
    const otpArray = value
      .split("")
      .concat(Array(length).fill(""))
      .slice(0, length);
    otpArray[index] = inputValue;

    const newOtp = otpArray.join("").replace(/\s/g, "");
    onChange?.(newOtp);

    // Move to next input if value entered and not at last input
    if (inputValue && index < length - 1) {
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
          value={value[i] || ""}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-full h-[64px] text-center border border-[#D0D5DD] rounded-lg text-lg text-base-900 font-semibold bg-white focus:outline-none focus:border-[#DE6A4C] focus:shadow-[0px_1px_2px_0px_#E58870,0px_0px_0px_4px_#F8E1DB] transition"
        />
      ))}
    </div>
  );
};

export default OtpInput;
