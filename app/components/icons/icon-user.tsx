// icon:home | Feathericons https://feathericons.com/ | Cole Bemis

import * as React from "react";

export const IconUser = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="flex-shrink-0 size-4"
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};
