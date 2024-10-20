import { cn } from "#app/utils/lib/cn";

interface InputProps {
  className?: string;
  children: React.ReactNode;
}

const Input = ({ className, children }: InputProps) => {
  return (
    <div className={cn("space-y-5 py-2", className)}>
      {/* Grid */}
      <div className="grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0">
        {children}
      </div>
    </div>
  );
};

interface LabelProps {
  className?: string;
  children: React.ReactNode;
}

const Label = ({ className, children }: LabelProps) => {
  return (
    <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
      <label
        htmlFor="null"
        className={cn(
          "inline-block text-sm font-normal text-gray-500 sm:mt-2.5 dark:text-neutral-500",
          className
        )}
      >
        {children}
      </label>
    </div>
  );
};

interface FieldProps {
  className?: string;
  children: React.ReactNode;
}

const Field = ({ className, children }: FieldProps) => {
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
