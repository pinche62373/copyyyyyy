import { FormButton } from "#app/components/form-button";

interface PropTypes {
  label: string;
  buttonLabel: string;
  disabled?: boolean;
}

export const AdminFormInputButton = ({
  label,
  buttonLabel,
  disabled = false,
}: PropTypes) => {
  return (
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

        {/* Col Name Input*/}
        <div className="mt-0.5 sm:col-span-4 md:col-span-4 lg:col-span-4 xl:col-span-3 text-right">
          <FormButton label={buttonLabel} disabled={disabled} />
        </div>
        {/* End Col Name Input*/}
      </div>
      {/* End Grid */}
    </div>
  );
};
