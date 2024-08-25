import { PropsWithChildren } from "react";

export const FormFooter = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-end gap-x-2 pt-2">
      <div className="w-full flex justify-end items-center gap-x-2">
        {children}
      </div>
    </div>
  );
};
