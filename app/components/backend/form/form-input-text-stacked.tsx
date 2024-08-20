import { type FormMetadata } from "@conform-to/react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fieldName: string;
  label: string;
  fields: ReturnType<FormMetadata["getFieldset"]>;
}

export const FormInputTextStacked = ({
  fieldName,
  type = "text",
  label,
  placeholder,
  fields,
  autoFocus = false,
  defaultValue,
}: InputProps) => {
  return (
    <div className="space-y-2">
      <label className="sm:mt-2.5 inline-block text-sm text-gray-900 dark:text-neutral-500">
        {label}
      </label>

      <input
        type={type}
        name={fields[fieldName].name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
        autoFocus={autoFocus}
      />

      {/* Validation Error */}
      <div className="pt-1 text-red-700 text-xs" id="name-error">
        {fields[fieldName].errors}
      </div>
    </div>
  );
};
