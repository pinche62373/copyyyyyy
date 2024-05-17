import { type FormMetadata } from "@conform-to/react";
import { clsx } from "clsx";
import Select from "react-select";

// https://www.jussivirtanen.fi/writing/styling-react-select-with-tailwind
const controlStyles = {
  base: "border rounded-lg bg-white hover:cursor-pointer text-sm",
  nonFocus:
    "border-gray-200 placeholder:text-gray-400 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60",
  focus: "border-blue-500 ring-1 ring-blue-500 dark:ring-neutral-600",
};

const placeholderStyles = "text-gray-500 pl-1 py-0.5 text-sm";
const selectInputStyles = "pl-1 py-0.5";
const valueContainerStyles = "p-1 gap-1";
const singleValueStyles = "leading-7 ml-1";
const multiValueStyles =
  "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5";
const multiValueRemoveStyles =
  "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md";
const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles =
  "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800";
const indicatorSeparatorStyles = "none"; // "bg-gray-300";
const dropdownIndicatorStyles =
  "p-1 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black";
const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
  base: "hover:cursor-pointer px-3 py-2 rounded dark:text-neutral-400",
  focus: "bg-gray-100 active:bg-gray-200",
  // selected:
  //   "after:content-['✔'] after:ml-2 after:text-green-500 text-gray-500",
};
const noOptionsMessageStyles =
  "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";

interface PropTypes {
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
            placeholder={`Select a ${label.toLowerCase()}...`}
            options={options}
            defaultValue={defaultOption}
            unstyled
            styles={{
              input: (base) => ({
                ...base,
                fontSize: "14px",
                "input:focus": {
                  boxShadow: "none",
                },
              }),
              // On mobile, the label will truncate automatically, so we want to
              // override that behaviour.
              multiValueLabel: (base) => ({
                ...base,
                whiteSpace: "normal",
                overflow: "visible",
              }),
              control: (base) => ({
                ...base,
                fontSize: "14px",
                transition: "none",
              }),
              option: (base) => ({
                ...base,
                fontSize: "14px",
              }),
            }}
            classNames={{
              control: ({ isFocused }) =>
                clsx(
                  isFocused ? controlStyles.focus : controlStyles.nonFocus,
                  controlStyles.base,
                ),
              placeholder: () => placeholderStyles,
              input: () => selectInputStyles,
              valueContainer: () => valueContainerStyles,
              singleValue: () => singleValueStyles,
              multiValue: () => multiValueStyles,
              multiValueLabel: () => multiValueLabelStyles,
              multiValueRemove: () => multiValueRemoveStyles,
              indicatorsContainer: () => indicatorsContainerStyles,
              clearIndicator: () => clearIndicatorStyles,
              indicatorSeparator: () => indicatorSeparatorStyles,
              dropdownIndicator: () => dropdownIndicatorStyles,
              menu: () => menuStyles,
              groupHeading: () => groupHeadingStyles,
              option: ({ isFocused, isSelected }) =>
                clsx(
                  isFocused && optionStyles.focus,
                  isSelected && optionStyles.focus,
                  optionStyles.base,
                ),
              noOptionsMessage: () => noOptionsMessageStyles,
            }}
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
