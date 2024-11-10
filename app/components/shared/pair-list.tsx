import { cn } from "#app/utils/lib/cn";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const PairList = ({ className, children, ...rest }: Props) => {
  return (
    <table
      className={cn("table-auto border-separate border-spacing-y-4", className)}
      {...rest}
    >
      <tbody>{children}</tbody>
    </table>
  );
};

const Pair = ({ className, children, ...rest }: Props) => {
  return (
    <tr className={cn("flex flex-col pb-3 sm:table-row", className)} {...rest}>
      {children}
    </tr>
  );
};

const Key = ({ className, children, ...rest }: Props) => {
  return (
    <td
      className={cn(
        "whitespace-nowrap pb-1 font-semibold text-tertiary-foreground align-top",
        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
};

const Value = ({ className, children, ...rest }: Props) => {
  return (
    <td className={cn("w-full pb-1 sm:pl-0 md:pl-5", className)} {...rest}>
      {children}
    </td>
  );
};

PairList.Pair = Pair;
PairList.Key = Key;
PairList.Value = Value;

export { PairList };
