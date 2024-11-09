import { cn } from "#app/utils/lib/cn";

interface Props {
  text: string;
  className?: string;
}

export const BackendTitle = ({ text, className, ...rest }: Props) => {
  return (
    <h1
      className={cn("text-lg font-semibold text-primary-foreground", className)}
      {...rest}
    >
      {text}
    </h1>
  );
};
