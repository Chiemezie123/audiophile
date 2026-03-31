import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, #2a2d34 0%, #111215 72%)",
          borderRadius: 18,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 18%, rgba(216,125,74,0.18), transparent 42%)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 4,
              width: 28,
              height: 18,
              borderTop: "6px solid #FFF7F0",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderRadius: "999px 999px 0 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 2,
              top: 14,
              width: 10,
              height: 20,
              background: "#D87D4A",
              borderRadius: 8,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 2,
              top: 14,
              width: 10,
              height: 20,
              background: "#D87D4A",
              borderRadius: 8,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 6,
              width: 18,
              height: 8,
              borderBottom: "4px solid #FFF7F0",
              borderRadius: "0 0 999px 999px",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
