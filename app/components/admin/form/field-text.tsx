interface PropTypes {
  fieldName: string;
  label: string;
  fields: any;
  defaultValue?: string;
}

export const AdminFormFieldText = ({
  fieldName,
  label,
  fields,
  defaultValue,
}: PropTypes) => {
  return (
    <div className="py-2 space-y-5">
      {/* Grid */}
      <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
        {/* Col Name Label*/}
        <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
          <label
            className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
          >
            {label}
          </label>
        </div>
        {/* End Col Name Label*/}

        {/* Col Name Input*/}
        <div className="sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
          <input
            autoFocus
            type="text"
            name={fields[fieldName].name}
            defaultValue={defaultValue}
            className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
          />
          {/* Validation Error */}
          <div className="pt-1 text-red-700 text-xs" id="name-error">
            {fields[fieldName].errors}
          </div>

          {/* End Validation Error */}
        </div>
      </div>
    </div>
  );
};
