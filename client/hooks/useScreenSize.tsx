"use client";

import React, { useEffect, useState } from "react";

type ScreenSizeProps = "small" | "medium" | "large";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreenSizeProps>("large");

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        setScreenSize("small");
      } else if (
        window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches
      ) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
