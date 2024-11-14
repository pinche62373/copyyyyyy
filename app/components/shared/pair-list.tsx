import { cn } from "#app/utils/lib/cn";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const PairList = ({ className, children, ...rest }: Props) => {
  return (
    <table className={cn("table-auto", className)} {...rest}>
      <tbody>{children}</tbody>
    </table>
  );
};

const Pair = ({ className, children, ...rest }: Props) => {
  return (
    <tr
      className={cn(
        "flex flex-col sm:table-row",

        className
      )}
      {...rest}
    >
      {children}
    </tr>
  );
};

interface KeyProps extends Props {
  last?: boolean;
}

const Key = ({ className, children, last, ...rest }: KeyProps) => {
  return (
    <td
      className={cn(
        "whitespace-nowrap align-middle font-semibold text-tertiary-foreground",
        last ? "pb-1" : "pb-5",
        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
};

interface ValueProps extends Props {
  last?: boolean;
}

const Value = ({ className, children, last, ...rest }: ValueProps) => {
  return (
    <td
      className={cn(
        "w-full align-middle sm:pl-0 md:pl-5",
        last ? "pb-1" : "pb-5",

        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
};

PairList.Pair = Pair;
PairList.Key = Key;
PairList.Value = Value;

export { PairList };
