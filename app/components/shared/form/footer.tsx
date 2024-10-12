import { PropsWithChildren } from "react";

export const FormFooter = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-end gap-x-2 pt-2">
      <div className="flex w-full items-center justify-end gap-x-2">
        {children}
      </div>
    </div>
  );
};
