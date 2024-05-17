import { type FormMetadata } from "@conform-to/react";
import Select from "react-select";

interface PropTypes {
  // fieldName: string;
  label: string;
  fields: ReturnType<FormMetadata["getFieldset"]>;
  items: {
    id: string;
    name: string;
  }[];
  defaultValue?: string;
}

export const AdminFormFieldDropdown = ({
  label,
  fields,
  items,
  defaultValue,
}: PropTypes) => {
  const fieldName = label.toLowerCase() + "Id"; // e.g. `regionId`

  const options = items.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const defaultOption = options.find(function (option) {
    return option.value === defaultValue;
  });

  return (
    <div className="py-2 space-y-5">
      {/* Grid */}
      <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
        {/* Col Name Label*/}
        <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
          <label className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500">
            {label}
          </label>
        </div>
        {/* End Col Name Label*/}

        {/* Test Col */}
        <div className="sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
          <Select
            name={fieldName}
            options={options}
            placeholder={`Select a ${label.toLowerCase()}...`}
            className="py-2"
            defaultValue={defaultOption}
          />
          {/* Validation Error */}
          <div className="pt-1 text-red-700 text-xs" id="name-error">
            {fields[fieldName].errors}
          </div>
          {/* End Validation Error */}          
        </div>
        {/* End Test Col */}
      </div>
      {/* End Grid */}
    </div>
  );
};
