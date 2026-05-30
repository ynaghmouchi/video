import React from "react";
import { Img, staticFile } from "remotion";

// The real M'EyeBus badge (public/logo.png, 469x531).
export const RealLogo: React.FC<{ width: number }> = ({ width }) => (
  <Img
    src={staticFile("logo.png")}
    style={{ width, height: (width * 531) / 469, display: "block" }}
  />
);
