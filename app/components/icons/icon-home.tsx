// icon:home | Feathericons https://feathericons.com/ | Cole Bemis

import * as React from "react";

export const IconHome = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="flex-shrink-0 size-4"
      xmlns="http://www.w3.org/2000/svg"            
      width="24"
      height="24"
      viewBox="0 0 24 24"      
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      {...props}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

