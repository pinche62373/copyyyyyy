import type * as React from "react";

export const UpstreamLogo = ({
  width = "165",
  height = "40",
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 165 40"
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Latin text */}
      <text
        x="0"
        y="30"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="32"
        fontWeight="300"
        letterSpacing="2"
        fill="#2c3e50"
      >
        Ushiwa
      </text>

      {/* Thin separator line */}
      <line
        x1="115"
        y1="5"
        x2="115"
        y2="35"
        stroke="#2c3e50"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Kanji */}
      <text
        x="125"
        y="30"
        fontFamily="sans-serif"
        fontSize="36"
        fontWeight="500"
        fill="#2c3e50"
      >
        牛
      </text>
    </svg>
  );
};
