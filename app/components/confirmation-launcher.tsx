import { PropsWithChildren } from "react";

interface PropTypes {
  modalId: string;
  className?: string;
  disabled?: boolean;
}

export function ConfirmationLauncher({
  modalId,
  className,
  disabled,
  children,
  ...rest
}: PropsWithChildren<PropTypes>) {
  return (
    <>
      {disabled ? (
        <button type="button" className={className} {...rest}>
          {children}
        </button>
      ) : (
        <button
          type="button"
          data-hs-overlay={"#" + modalId}
          className={className}
          {...rest}
        >
          {children}
        </button>
      )}
    </>
  );
}
