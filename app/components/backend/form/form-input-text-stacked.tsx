import { type FormMetadata } from "@conform-to/react";

interface PropTypes {
  fieldName: string;
  label: string;
  placeholder?: string;
  fields: ReturnType<FormMetadata["getFieldset"]>;
  defaultValue?: string;
}

export const FormInputTextStacked = ({
  fieldName,
  label,
  placeholder,
  fields,
  defaultValue,
}: PropTypes) => {
  return (
    <div className="space-y-2">
      <label>{label}</label>

      <input
        autoFocus
        type="text"
        name={fields[fieldName].name}
        defaultValue={defaultValue}
        className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
        placeholder={placeholder}
      />

      {/* Validation Error */}
      <div className="pt-1 text-red-700 text-xs" id="name-error">
        {fields[fieldName].errors}
      </div>
    </div>
  );
};
