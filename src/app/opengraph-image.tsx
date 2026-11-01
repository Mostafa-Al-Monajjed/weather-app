import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "../lib/site";

export const alt = `${siteName}: live weather`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "linear-gradient(160deg, #1e3a8a 0%, #0b1020 70%)",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: -140,
          right: -140,
          width: 560,
          height: 560,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(253,224,71,0.55), rgba(253,224,71,0) 65%)",
        }}
      />
      <div style={{ display: "flex", fontSize: 110 }}>{siteName}</div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 40,
          color: "#cbd5e1",
          maxWidth: 820,
        }}
      >
        {siteDescription}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 48,
          fontSize: 30,
          color: "#fde047",
        }}
      >
        24-hour and 7-day forecast · Animated skies · Floating widget
      </div>
    </div>,
    { ...size },
  );
}
