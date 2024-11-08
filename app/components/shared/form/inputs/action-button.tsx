import { ConfirmationLauncher } from "#app/components/confirmation-launcher";
import { ConfirmationModal } from "#app/components/confirmation-modal";
import { cn } from "#app/utils/lib/cn";

interface PropTypes {
  formId: string;
  label: string;
  buttonLabel: string;
  enabled?: boolean;
}

export const ActionButton = ({
  formId,
  label,
  buttonLabel,
  enabled = true
}: PropTypes) => {
  const modalId = `confirm-${formId}`;

  const disabledButtonClass =
    enabled !== true && "opacity-50 cursor-not-allowed"; // mimic tailwind utility class

  return (
    <>
      <div className="space-y-5 py-2.5">
        {/* Grid */}
        <div className="grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0">
          {/* Col Name Label*/}
          <div className="sm:col-span-8 md:col-span-8 lg:col-span-8 xl:col-span-9">
            <label className="inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500">
              {label}
            </label>
          </div>
          {/* End Col Name Label*/}

          {/* Col Name Buttons */}
          <div className="mt-0.5 text-right sm:col-span-4 md:col-span-4 lg:col-span-4 xl:col-span-3">
            <ConfirmationLauncher modalId={modalId} enabled={enabled}>
              <span
                className={cn(
                  "inline-flex items-center justify-center gap-x-2 rounded-lg px-3 py-2 text-start align-middle", 
                  "text-sm font-medium shadow-sm focus:outline-none focus:ring-1",
                  "border border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
                  "focus:ring-blue-300 dark:focus:ring-blue-500",                  
                  disabledButtonClass
                )}
              >
                {buttonLabel}
              </span>
            </ConfirmationLauncher>
          </div>
          {/* End Col Name Buttons */}
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
