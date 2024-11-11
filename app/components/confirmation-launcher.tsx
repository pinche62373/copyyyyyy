interface PropTypes {
  modalId: string;
  className?: string;
  enabled?: boolean;
  children: React.ReactNode;
}

export function ConfirmationLauncher({
  modalId,
  className,
  enabled = true,
  children,
  ...rest
}: PropTypes) {
  return (
    <>
      {enabled === true ? (
        <div
          id="modal-launcher"
          data-hs-overlay={"#" + modalId}
          className={className}
          {...rest}
        >
          {children}
        </div>
      ) : (
        <div id="modal-launcher" className={className}>
          {children}
        </div>
      )}
    </>
  );
}
