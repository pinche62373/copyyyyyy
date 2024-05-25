import { PropsWithChildren } from "react";

interface PropTypes {
  modalId: string;
  formId?: string | number;
  className?: string;
}

export function ConfirmationLauncher({
  modalId,
  className,
  children,
  ...rest
}: PropsWithChildren<PropTypes>) {
  return (
    <button
      type="button"
      data-hs-overlay={"#" + modalId}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
