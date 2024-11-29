import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const FrontendSection = ({ className, children, ...rest }: Props) => {
  return (
    <section className="w-full  py-4 lg:gap-8 lg:py-6">
      <div className="z-50 mx-auto flex w-full max-w-7xl basis-full flex-wrap items-center bg-indigo-200 px-4 sm:px-6 md:flex-nowrap md:justify-start lg:px-8 dark:bg-black">
        <div className={className} {...rest}>
          {children}
        </div>
      </div>
    </section>
  );
};
