import { cn } from "#app/utils/lib/cn";

interface Props {
  text: string;
  foreground?: boolean;
  className?: string;
}

export const BackendTitle = ({
  text,
  className,
  foreground,
  ...rest
}: Props) => {
  return (
    <h1
      className={cn(
        "text-lg font-semibold",
        foreground ? "text-primary-foreground" : "text-primary",
        className,
      )}
      {...rest}
    >
      {text}
    </h1>
  );
};
