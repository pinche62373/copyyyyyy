import { type FormMetadata } from "@conform-to/react";
import { useState } from "react";

interface PropTypes {
  fieldName: string;
  label: string;
  fields: ReturnType<FormMetadata["getFieldset"]>;
  items: {
    id: string;
    name: string;
  }[];
  defaultValue?: string;
}

export const AdminFormFieldDropdown = ({
  fieldName,
  label,
  fields,
  items,
  defaultValue,
}: PropTypes) => {
  const [selected, setSelected] = useState<string | undefined>(defaultValue);

  const changeSelected = (optionId: string) => {
    setSelected(optionId);
  };

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

        {/* Col Name Select*/}
        <div className="sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
          <select
            id="regionId"
            name="regionId"
            onChange={(event) => changeSelected(event.target.value)}
            value={selected}
            className="py-2 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          >
            {/* Options */}
            <option disabled selected defaultValue={selected}>
              Select a region...
            </option>

            {items.map((item, i: number) => {
              return (
                <option
                  key={i}
                  value={item.id}
                  selected={defaultValue === item.id} // set selected item if id matches
                >
                  {item.name}
                </option>
              );
            })}
            {/* End Options */}
          </select>
          {/* Validation Error */}
          <div className="pt-1 text-red-700 text-xs" id="name-error">
            {fields[fieldName].errors}
          </div>
          {/* End Validation Error */}
        </div>
        {/* End Col Name Select*/}
      </div>
      {/* End Grid */}
    </div>
  );
};
