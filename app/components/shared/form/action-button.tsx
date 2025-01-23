import type { ForwardedRef } from "react";
import { Button } from "#app/components/shared/button";
import { Confirm } from "#app/components/shared/confirm";
import { cn } from "#app/utils/lib/cn.ts";

interface PropTypes {
  formRef: ForwardedRef<HTMLFormElement>;
  buttonLabel: string;
  disabled?: boolean;
  modalHeading: string;
  modalBody: string;
  className?: string;
}

export const ActionButton = ({
  formRef,
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
      <div className="flex items-end justify-end">
        {/* Aria Button Container */}
        <div className="flex justify-end grow sm:grow-0">
          {/* Invisible Aria Button */}
          <Confirm
            ariaLabel="Are you sure?"
            disabled={disabled}
            className="grow sm:grow-0"
          >
            {/* Visible Button */}
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
