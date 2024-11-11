import { ConfirmationLauncher } from "#app/components/confirmation-launcher";
import { ConfirmationModal } from "#app/components/confirmation-modal";
import { Button } from "#app/components/shared/button";

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

  return (
    <>
      {/* CONTAINER */}
      <div className="flex items-center justify-center">
        {/* LABEL */}
        <div className="flex flex-1">{label}</div>
        {/* BUTTON */}
        <div className="flex justify-end">
          <ConfirmationLauncher modalId={modalId} enabled={enabled}>
            <Button
              type="button"
              className={className}
              text={buttonLabel}
              disabled={!enabled}
              {...rest}
            />
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
