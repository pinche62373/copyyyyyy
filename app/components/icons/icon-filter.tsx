// preline

import * as React from "react";

export const IconFilter = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="size-3.5 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="21" x2="14" y1="4" y2="4"></line>
      <line x1="10" x2="3" y1="4" y2="4"></line>
      <line x1="21" x2="12" y1="12" y2="12"></line>
      <line x1="8" x2="3" y1="12" y2="12"></line>
      <line x1="21" x2="16" y1="20" y2="20"></line>
      <line x1="12" x2="3" y1="20" y2="20"></line>
      <line x1="14" x2="14" y1="2" y2="6"></line>
      <line x1="8" x2="8" y1="10" y2="14"></line>
      <line x1="16" x2="16" y1="18" y2="22"></line>
    </svg>
  );
};
