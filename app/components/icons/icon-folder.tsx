// icon:icon-folder | Heroicons UI https://github.com/sschoger/heroicons-ui | Steve Schoger

import * as React from "react";

export const IconFolder = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="flex-shrink-0 size-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M20 6a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2h7.41l2 2H20zM4 6v12h16V8h-7.41l-2-2H4z" />
    </svg>
  );
};

export default IconFolder;
