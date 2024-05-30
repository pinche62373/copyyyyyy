import { NavLink } from "@remix-run/react";

import { ConfirmationLauncher } from "#app/components/confirmation-launcher";
import { ConfirmationModal } from "#app/components/confirmation-modal";
import { cn } from "#app/utils/misc";

interface PropTypes {
  formId: string;
  label: string;
  buttonLabel: string;
  disabled?: boolean;
}

export const FormInputActionButton = ({
  formId,
  label,
  buttonLabel,
  disabled = false,
}: PropTypes) => {
  const modalId = `confirm-${formId}`;

  const disabledButtonClass = disabled && "opacity-50 cursor-not-allowed"; // mimic tailwind utility class

  return (
    <>
      <div className="py-2.5 space-y-5">
        {/* Grid */}
        <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
          {/* Col Name Label*/}
          <div className="sm:col-span-8 md:col-span-8 lg:col-span-8 xl:col-span-9">
            <label className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500">
              {label}
            </label>
          </div>
          {/* End Col Name Label*/}

          {/* Only render button column if not disabled */}
          {/* {!disabled && ( */}
          <div className="mt-0.5 sm:col-span-4 md:col-span-4 lg:col-span-4 xl:col-span-3 text-right">
            <ConfirmationLauncher modalId={modalId} disabled>
              <NavLink
                type="button"
                to="#"
                className={cn(
                  "py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500  disabled:opacity-50 disabled:pointer-events-none",
                  disabledButtonClass,
                )}
              >
                {buttonLabel}
              </NavLink>
            </ConfirmationLauncher>
          </div>
          {/* )} */}
        </div>
        {/* End Grid */}
      </div>

      <ConfirmationModal
        id={modalId}
        formId={formId}
        caption="Delete expired sessions?"
      />
    </>
  );
};
