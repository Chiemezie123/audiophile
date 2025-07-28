"use client";

import React, { useState } from "react";

type RadioButtonProps = {
  label: string;
  value: string | number;
  isActive: boolean;
  onClick: (value: string | number) => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex items-center p-[14px] w-full xl:w-[240px] h-[52px] gap-2 rounded-md border transition-all
        ${
          isActive
            ? "bg-orange-50 border-orange-500"
            : "bg-white border-base-200"
        }
      `}
    >
      <div>
        {isActive ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
          >
            <circle cx="8" cy="8.5" r="7.5" fill="#fff" stroke="#EB5E28" />
            <circle cx="8" cy="8.5" r="4" fill="#EB5E28" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
          >
            <circle cx="8" cy="8.5" r="7.5" fill="#fff" stroke="#515253" />
          </svg>
        )}
      </div>
      <span
        className={`text-md font-medium ${
          isActive ? "text-orange-500" : "text-base-700"
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default RadioButton;
