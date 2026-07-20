"use client";

import * as React from "react";
import { IconUpload } from "@tabler/icons-react";
import { AppleFrame } from "@/lib/types";

interface SvgDeviceFrameProps {
  frame: AppleFrame;
  color: string;
  screenshotImage?: string;
  onUploadScreenshot: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SvgDeviceFrame({
  frame,
  color,
  screenshotImage,
  onUploadScreenshot,
}: SvgDeviceFrameProps) {
  const activeColorObj = frame.colors.find((c) => c.value === color) ?? frame.colors[0];
  const colorHex = activeColorObj?.hex ?? "#e3e4e5";
  const clipId = `vector-screen-clip-${frame.id}`;

  const category = frame.category;

  const renderUploadPlaceholder = () => (
    <label className="flex w-full h-full cursor-pointer flex-col items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-850 transition-colors select-none p-4 text-white">
      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
        <IconUpload className="size-5 text-primary" />
      </div>
      <p className="text-[10px] font-medium text-zinc-300 text-center">Upload mockup image</p>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUploadScreenshot}
      />
    </label>
  );

  // ==========================================
  // 1. LAPTOPS (MacBook Pro 16, MacBook Air 15, Dell XPS 16)
  // ==========================================
  if (category === "laptop") {
    const isDell = frame.brand === "Dell";
    const vw = 1600;
    const vh = 1040;

    const bezelX = 70;
    const bezelY = 40;
    const bezelW = 1460;
    const bezelH = 930;
    const bezelRx = isDell ? 4 : 20;

    // Native 16:10 Screen
    const screenX = 86;
    const screenY = 56;
    const screenW = 1428;
    const screenH = 892;
    const screenRx = isDell ? 0 : 10;

    return (
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        className="w-full h-auto block select-none drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={screenX} y={screenY} width={screenW} height={screenH} rx={screenRx} />
          </clipPath>
          <linearGradient id={`chassis-grad-${frame.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorHex} />
            <stop offset="100%" stopColor={colorHex} stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={`bezel-border-${frame.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#44444c" />
            <stop offset="100%" stopColor="#1a1a1e" />
          </linearGradient>
        </defs>

        {/* Outer Back Enclosure */}
        <rect
          x={bezelX}
          y={bezelY}
          width={bezelW}
          height={bezelH}
          rx={bezelRx}
          fill="#0c0c0e"
          stroke={`url(#bezel-border-${frame.id})`}
          strokeWidth="3"
        />

        {/* Screen Background Fill */}
        <rect x={screenX} y={screenY} width={screenW} height={screenH} rx={screenRx} fill="#000000" />

        {/* User Screenshot or Upload Prompt (Clipped) */}
        <g clipPath={`url(#${clipId})`}>
          {screenshotImage ? (
            <image
              href={screenshotImage}
              x={screenX}
              y={screenY}
              width={screenW}
              height={screenH}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <foreignObject x={screenX} y={screenY} width={screenW} height={screenH}>
              {renderUploadPlaceholder()}
            </foreignObject>
          )}
        </g>

        {/* FRONT OVERLAY LAYER: Bezel Frame sitting ON TOP of screenshot */}
        <rect
          x={bezelX + 8}
          y={bezelY + 8}
          width={bezelW - 16}
          height={bezelH - 16}
          rx={bezelRx - 4}
          fill="none"
          stroke="#0c0c0e"
          strokeWidth="16"
        />

        {/* MacBook Camera Notch */}
        {!isDell && (
          <g>
            <path
              d={`M ${vw / 2 - 65} ${screenY} h 130 a 10 10 0 0 1 10 10 v 12 a 8 8 0 0 1 -8 8 h -134 a 8 8 0 0 1 -8 -8 v -12 a 10 10 0 0 1 10 -10 z`}
              fill="#0c0c0e"
            />
            <circle cx={vw / 2} cy={screenY + 12} r="4" fill="#111827" />
            <circle cx={vw / 2} cy={screenY + 12} r="2" fill="#1e3a8a" />
            <circle cx={vw / 2 + 25} cy={screenY + 12} r="1.5" fill="#10b981" opacity="0.8" />
          </g>
        )}

        {/* Dell XPS WebCam */}
        {isDell && (
          <circle cx={vw / 2} cy={screenY - 6} r="3" fill="#333333" />
        )}

        {/* Laptop Hinge & Base Body */}
        <g>
          <path
            d={`M 0 968 C 0 968 15 968 40 970 L 1560 970 C 1585 968 1600 968 1600 968 L 1600 994 C 1600 1012 1580 1024 1540 1024 L 60 1024 C 20 1024 0 1012 0 994 Z`}
            fill={`url(#chassis-grad-${frame.id})`}
            stroke="#55555e"
            strokeWidth="1"
          />

          <rect x="520" y="966" width="560" height="6" rx="3" fill="#18181b" opacity="0.9" />

          {/* Thumb indent for opening lid */}
          <path
            d={`M ${vw / 2 - 70} 970 C ${vw / 2 - 50} 982, ${vw / 2 + 50} 982, ${vw / 2 + 70} 970 Z`}
            fill="#121215"
          />

          <path
            d="M 40 971 L 1560 971"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />

          <rect x="140" y="1022" width="120" height="8" rx="4" fill="#09090b" />
          <rect x="1340" y="1022" width="120" height="8" rx="4" fill="#09090b" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // 2. PHONES (iPhone 17 Pro Max, 17 Pro, 16 Pro, 16, Pixel 9 Pro)
  // ==========================================
  if (category === "phone") {
    const isPixel = frame.id === "pixel-9-pro";
    const vw = 1000;
    const vh = 2060;

    const outerX = 40;
    const outerY = 40;
    const outerW = 920;
    const outerH = 1980;
    const outerRx = isPixel ? 110 : 140;

    const bezelX = 62;
    const bezelY = 62;
    const bezelW = 876;
    const bezelH = 1936;
    const bezelRx = isPixel ? 90 : 118;

    const screenX = 74;
    const screenY = 74;
    const screenW = 852;
    const screenH = 1912;
    const screenRx = isPixel ? 78 : 106;

    return (
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        className="w-full h-auto block select-none drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={screenX} y={screenY} width={screenW} height={screenH} rx={screenRx} />
          </clipPath>
          <linearGradient id={`phone-metal-${frame.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorHex} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor={colorHex} />
          </linearGradient>
        </defs>

        {/* Buttons */}
        <rect x="26" y="380" width="14" height="60" rx="7" fill={colorHex} />
        <rect x="26" y="480" width="14" height="110" rx="7" fill={colorHex} />
        <rect x="26" y="620" width="14" height="110" rx="7" fill={colorHex} />
        <rect x="960" y="520" width="14" height="150" rx="7" fill={colorHex} />

        {/* Metal Body Chassis Outer */}
        <rect
          x={outerX}
          y={outerY}
          width={outerW}
          height={outerH}
          rx={outerRx}
          fill={`url(#phone-metal-${frame.id})`}
          stroke="#44444c"
          strokeWidth="2"
        />

        {/* Screen Background Fill */}
        <rect x={screenX} y={screenY} width={screenW} height={screenH} rx={screenRx} fill="#000000" />

        {/* Screenshot Image or Upload Prompt (Clipped) */}
        <g clipPath={`url(#${clipId})`}>
          {screenshotImage ? (
            <image
              href={screenshotImage}
              x={screenX}
              y={screenY}
              width={screenW}
              height={screenH}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <foreignObject x={screenX} y={screenY} width={screenW} height={screenH}>
              {renderUploadPlaceholder()}
            </foreignObject>
          )}
        </g>

        {/* FRONT OVERLAY LAYER: Inner Black Bezel sitting ON TOP of screenshot */}
        <rect
          x={bezelX}
          y={bezelY}
          width={bezelW}
          height={bezelH}
          rx={bezelRx}
          fill="none"
          stroke="#09090b"
          strokeWidth="24"
        />

        {/* Dynamic Island or Hole Punch Camera */}
        {!isPixel ? (
          <g>
            <rect
              x={vw / 2 - 110}
              y={screenY + 28}
              width="220"
              height="56"
              rx="28"
              fill="#000000"
            />
            <circle cx={vw / 2 + 55} cy={screenY + 56} r="10" fill="#111827" />
            <circle cx={vw / 2 + 55} cy={screenY + 56} r="5" fill="#1e3a8a" />
            <circle cx={vw / 2 - 50} cy={screenY + 56} r="7" fill="#0f172a" />
          </g>
        ) : (
          <g>
            <circle cx={vw / 2} cy={screenY + 48} r="18" fill="#000000" />
            <circle cx={vw / 2} cy={screenY + 48} r="8" fill="#1e3a8a" />
          </g>
        )}

        {/* Home Bar Indicator */}
        <rect
          x={vw / 2 - 90}
          y={screenY + screenH - 24}
          width="180"
          height="10"
          rx="5"
          fill="#ffffff"
          opacity="0.4"
        />
      </svg>
    );
  }

  // ==========================================
  // 3. TABLETS (iPad Pro 13)
  // ==========================================
  if (category === "tablet") {
    const vw = 1600;
    const vh = 2133;

    const outerX = 40;
    const outerY = 40;
    const outerW = 1520;
    const outerH = 2053;
    const outerRx = 64;

    const bezelX = 68;
    const bezelY = 68;
    const bezelW = 1464;
    const bezelH = 1997;
    const bezelRx = 44;

    const screenX = 100;
    const screenY = 100;
    const screenW = 1400;
    const screenH = 1933;
    const screenRx = 24;

    return (
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        className="w-full h-auto block select-none drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={screenX} y={screenY} width={screenW} height={screenH} rx={screenRx} />
          </clipPath>
        </defs>

        {/* iPad Chassis */}
        <rect
          x={outerX}
          y={outerY}
          width={outerW}
          height={outerH}
          rx={outerRx}
          fill={colorHex}
          stroke="#44444c"
          strokeWidth="2"
        />

        {/* Screen Background Fill */}
        <rect x={screenX} y={screenY} width={screenW} height={screenH} rx={screenRx} fill="#000000" />

        {/* User Screenshot or Upload Prompt (Clipped) */}
        <g clipPath={`url(#${clipId})`}>
          {screenshotImage ? (
            <image
              href={screenshotImage}
              x={screenX}
              y={screenY}
              width={screenW}
              height={screenH}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <foreignObject x={screenX} y={screenY} width={screenW} height={screenH}>
              {renderUploadPlaceholder()}
            </foreignObject>
          )}
        </g>

        {/* FRONT OVERLAY LAYER: Black Bezel Frame sitting ON TOP */}
        <rect
          x={bezelX}
          y={bezelY}
          width={bezelW}
          height={bezelH}
          rx={bezelRx}
          fill="none"
          stroke="#09090b"
          strokeWidth="64"
        />

        <circle cx={vw / 2} cy={bezelY + 32} r="6" fill="#1c1c1e" />
      </svg>
    );
  }

  // ==========================================
  // 4. DESKTOPS & MONITORS (iMac 24, Pro Display XDR)
  // ==========================================
  const isImac = frame.id === "imac-24";
  const vw = 1920;
  const vh = 1600;

  // Outer Enclosure Box
  const glassX = 160;
  const glassY = 60;
  const glassW = 1600;
  const glassH = 1040;
  const glassRx = 16;

  // Standard 16:9 Display Screen Area (1540 / 866.25 = 1.777 EXACT 16:9!)
  const screenX = 190;
  const screenY = 90;
  const screenW = 1540;
  const screenH = 866;
  const screenRx = 8;

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      className="w-full h-auto block select-none drop-shadow-2xl overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={screenX} y={screenY} width={screenW} height={screenH} rx={screenRx} />
        </clipPath>
      </defs>

      {/* Screen Back Enclosure Frame */}
      <rect
        x={glassX}
        y={glassY}
        width={glassW}
        height={glassH}
        rx={glassRx}
        fill="#111115"
        stroke="#33333c"
        strokeWidth="3"
      />

      {/* Screen Background Fill */}
      <rect x={screenX} y={screenY} width={screenW} height={screenH} rx={screenRx} fill="#000000" />

      {/* User Screenshot or Upload Prompt (Clipped) */}
      <g clipPath={`url(#${clipId})`}>
        {screenshotImage ? (
          <image
            href={screenshotImage}
            x={screenX}
            y={screenY}
            width={screenW}
            height={screenH}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <foreignObject x={screenX} y={screenY} width={screenW} height={screenH}>
            {renderUploadPlaceholder()}
          </foreignObject>
        )}
      </g>

      {/* FRONT OVERLAY LAYER: Black Glass Bezel sitting ON TOP of screenshot */}
      <rect
        x={glassX + 12}
        y={glassY + 12}
        width={glassW - 24}
        height={isImac ? 872 : glassH - 24}
        rx={glassRx - 4}
        fill="none"
        stroke="#111115"
        strokeWidth="36"
      />

      {/* iMac Lower Colored Chin Bar */}
      {isImac && (
        <path
          d={`M ${glassX} ${glassY + 884} L ${glassX + glassW} ${glassY + 884} L ${glassX + glassW} ${glassY + glassH - 12} A 16 16 0 0 1 ${glassX + glassW - 16} ${glassY + glassH} L ${glassX + 16} ${glassY + glassH} A 16 16 0 0 1 ${glassX} ${glassY + glassH - 16} Z`}
          fill={colorHex}
        />
      )}

      {/* Camera Dot */}
      <circle cx={vw / 2} cy={screenY - 14} r="5" fill="#1c1c1e" />

      {/* Desktop Stand Stem */}
      <path
        d={`M ${vw / 2 - 90} ${glassY + glassH} L ${vw / 2 - 110} 1420 L ${vw / 2 + 110} 1420 L ${vw / 2 + 90} ${glassY + glassH} Z`}
        fill={isImac ? colorHex : "#e3e4e5"}
        stroke="#888894"
        strokeWidth="1"
      />

      {/* Desktop Stand Base Plate */}
      <rect
        x={vw / 2 - 220}
        y="1420"
        width="440"
        height="28"
        rx="8"
        fill={isImac ? colorHex : "#e3e4e5"}
        stroke="#777782"
        strokeWidth="1.5"
      />
    </svg>
  );
}
