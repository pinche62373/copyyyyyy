interface PropTypes {
  modalId: string;
  children: React.ReactNode;
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
}: PropTypes) {
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
