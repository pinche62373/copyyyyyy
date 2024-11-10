import { ConfirmationLauncher } from "#app/components/confirmation-launcher";
import { ConfirmationModal } from "#app/components/confirmation-modal";
import { cn } from "#app/utils/lib/cn";

interface PropTypes {
  formId: string;
  label: string;
  className?: string;
  buttonLabel: string;
  enabled?: boolean;
}

export const ActionButton = ({
  formId,
  label,
  buttonLabel,
  className,
  enabled = true,
  ...rest
}: PropTypes) => {
  const modalId = `confirm-${formId}`;

  const disabledButtonClass =
    enabled !== true && "opacity-50 cursor-not-allowed"; // mimic tailwind utility class

  return (
    <>
      {/* CONTAINER */}
      <div className="flex items-center justify-center">
        {/* LABEL */}
        <div className="flex flex-1">{label}</div>
        {/* BUTTON */}
        <div className="flex justify-end">
          <ConfirmationLauncher modalId={modalId} enabled={enabled}>
            <span
              className={cn(
                "inline-flex rounded-lg px-3 py-2 text-start",
                "text-sm font-medium shadow-sm focus:outline-none focus:ring-1",
                "border border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
                "focus:ring-blue-300 dark:focus:ring-blue-500",
                disabledButtonClass,
                className
              )}
              {...rest}
            >
              {buttonLabel}
            </span>
          </ConfirmationLauncher>
        </div>
      </div>

      <ConfirmationModal
        id={modalId}
        formId={formId}
        caption="Delete expired sessions?"
      />
    </>
  );
};
