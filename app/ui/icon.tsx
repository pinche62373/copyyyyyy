import { type SVGProps } from "react";
import { type IconName } from "#app/ui/icons/name.js";
import href from "#app/ui/icons/spritesheet.svg?url";
import { cn } from "#app/utils/lib/cn.ts";

export { href, IconName };

const sizeClassName = {
  font: "w-[1em] h-[1em]",
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
} as const;

type Size = keyof typeof sizeClassName;

const childrenSizeClassName = {
  font: "gap-1.5",
  xs: "gap-1.5",
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2",
  xl: "gap-3",
} satisfies Record<Size, string>;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
  size?: keyof typeof sizeClassName;
}

export const Icon = ({
  name,
  size = "font",
  className,
  children,
  ...rest
}: IconProps) => {
  if (children) {
    return (
      <span
        className={`inline-flex items-center align-middle ${childrenSizeClassName[size]}`}
      >
        <Icon name={name} size={size} className={className} {...rest} />
        {children}
      </span>
    );
  }
  return (
    <svg
      // fill="currentColor"
      // stroke="curentColor"
      className={cn(
        sizeClassName[size],
        "inline self-center align-middle",
        className,
      )}
      data-name={name}
      {...rest}
    >
      <use href={`${href}#${name}`} />
    </svg>
  );
};
