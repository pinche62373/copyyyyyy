import { type FormMetadata } from "@conform-to/react";

interface PropTypes {
  fieldName: string;
  label: string;
  fields: ReturnType<FormMetadata["getFieldset"]>;
  defaultValue?: string;
}

export const FormInputText = ({
  fieldName,
  label,
  fields,
  defaultValue
}: PropTypes) => {
  return (
    <div className="space-y-5 py-2.5">
      {/* Grid */}
      <div className="grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0">
        {/* Col Name Label*/}
        <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
          <label className="inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500">
            {label}
          </label>
        </div>
        {/* End Col Name Label*/}

        {/* Col Name Input*/}
        <div className="mt-0.5 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
          <input
            autoFocus
            type="text"
            name={fields[fieldName].name}
            defaultValue={defaultValue}
            className="block w-full rounded-lg border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
          />
          {/* Validation Error */}
          <div className="pt-1 text-xs text-red-700" id="name-error">
            {fields[fieldName].errors}
          </div>
          {/* End Validation Error */}
        </div>
        {/* End Col Name Input*/}
      </div>
      {/* End Grid */}
    </div>
  );
};
