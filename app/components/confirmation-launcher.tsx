import { PropsWithChildren } from "react";

interface PropTypes {
  modalId: string;
  className?: string;
  enabled?: boolean;
  title?: string;

}

export function ConfirmationLauncher({
  modalId,
  className,
  enabled = true,
  title,
  children,
  ...rest
}: PropsWithChildren<PropTypes>) {
  return (
    <>
      {enabled === true ? (
        <button
          title={title}
          type="button"
          data-hs-overlay={"#" + modalId}
          className={className}
          {...rest}
        >
          {children}
        </button>
      ) : (
        <button type="button" className={className} {...rest} disabled>
          {children}
        </button>
      )}
    </>
  );
}
