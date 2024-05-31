// icon:logout | Heroicons

import * as React from "react";

export const IconLogout = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="flex-shrink-0 size-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"      
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
      />
    </svg>
  );
};
