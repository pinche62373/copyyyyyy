import { cn } from "#app/utils/lib/cn";

interface PanelProps {
  className?: string;
  children: React.ReactNode;
}

const BackendPanel = ({ className, children, ...rest }: PanelProps) => {
  return (
    <div className="relative overflow-visible">
      <div
        className={cn(
          "rounded-md border border-border bg-foreground px-5 py-5 dark:border-none",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};

interface HeaderProps {
  className?: string;
  children: React.ReactNode;
}

const HeaderLeft = ({ className, children, ...rest }: HeaderProps) => {
  return (
    <div className={cn("float-left pb-5", className)} {...rest}>
        <div className="flex">
            {children}
        </div>
    </div>
  );
};

const HeaderRight = ({ className, children, ...rest }: HeaderProps) => {
  return (
    <div className={cn("float-right pb-5", className)} {...rest}>
        <div className="flex">
            {children}
        </div>
    </div>
  );
};

interface ContentProps {
  className?: string;
  children: React.ReactNode;
}

const Content = ({ className, children, ...rest }: ContentProps) => {
  return (
    <div
      className={cn(
        "inline-block",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

BackendPanel.HeaderLeft = HeaderLeft;
BackendPanel.HeaderRight = HeaderRight;
BackendPanel.Content = Content;

export { BackendPanel };
