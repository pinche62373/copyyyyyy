interface Props {
  children: React.ReactNode;
  className?: string;
}

export const FrontendSection = ({ className, children, ...rest }: Props) => {
  return (
    <section className="w-full  lg:gap-8 py-4 lg:py-6">
      <div className="bg-indigo-200 dark:bg-black max-w-[80rem] basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap md:justify-start md:flex-nowrap z-50">
        <div className={className} {...rest}>
          {children}
        </div>
      </div>
    </section>
  );
};
