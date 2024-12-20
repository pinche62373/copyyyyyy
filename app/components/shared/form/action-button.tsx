import type { RefObject } from "react";
import { Button } from "#app/components/shared/button";
import { Confirm } from "#app/components/shared/confirm";

interface PropTypes {
  formRef: RefObject<HTMLFormElement>;
  label: string;
  buttonLabel: string;
  disabled?: boolean;
  modalHeading: string;
  modalBody: string;
  className?: string;
}

export const ActionButton = ({
  formRef,
  label,
  buttonLabel,
  disabled,
  modalHeading,
  modalBody,
  className,
  ...rest
}: PropTypes) => {
  return (
    <>
      {/* Container */}
      <div className="flex items-center justify-center">
        {/* Label */}
        <div className="flex flex-1">{label}</div>

        {/* Button */}
        <div className="flex justify-end">
          <Confirm ariaLabel="Are you sure?" disabled={disabled}>
            <Confirm.Trigger>
              <Button as="div" text={buttonLabel} {...rest}></Button>
            </Confirm.Trigger>

            <Confirm.Modal formRef={formRef} heading={modalHeading}>
              {modalBody}
            </Confirm.Modal>
          </Confirm>
        </div>
        {/* End Button */}
      </div>
      {/* End Container */}
    </>
  );
};
