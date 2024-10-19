import { cn } from "#app/utils/lib/cn";

interface PropTypes {
  children: React.ReactNode;
  className?: string;
}

const Input = ({ className, children }: PropTypes) => {
  return (
    <div className={cn("space-y-5 py-2", className)}>
      {/* Grid */}
      <div className="grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0">
        {children}
      </div>
    </div>
  );
};

const Label = ({ className, children }: PropTypes) => {
  return (
    <div
      className={cn(
        "sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1",
        className
      )}
    >
      {children}
    </div>
  );
};

const Field = ({ className, children }: PropTypes) => {
  return (
    <div
      className={cn(
        "mt-0.5 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11",
        className
      )}
    >
      {children}
    </div>
  );
};

Input.Label = Label;
Input.Field = Field;

export { Input };
