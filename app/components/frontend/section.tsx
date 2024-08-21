interface Props {
  children: React.ReactNode;
  className?: string;
}

export const FrontendSection = ({ className, children, ...rest }: Props) => {
  return (
    <section className="w-full dark:bg-black lg:gap-8 py-4 lg:py-6">
      <div className="max-w-[80rem] bg-indigo-200 basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap md:justify-start md:flex-nowrap z-50">
        <div className={className} {...rest}>
          {children}
        </div>
      </div>
    </section>
  );
};
