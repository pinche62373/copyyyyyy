import type { FieldError, FieldValues } from "react-hook-form";
import { useFormState } from "react-hook-form";
import type { UseRemixFormReturn } from "remix-hook-form";

/**
 * Helper functions for react-hook-form fields.
 */
export const useFormHelpers = (form: UseRemixFormReturn<FieldValues>) => {
  const { control, resetField, setValue, trigger } = form;
  const { defaultValues } = useFormState({ control });

  /**
   * Sets form field value as usual unless the passed value matches the
   * default value. In that case we reset field, isTouched and isDirty.
   */
  const setFormFieldValue = (field: string, value: string | number) => {
    if (!defaultValues) {
      return;
    }

    // current value matches default value
    if (value === defaultValues[field]) {
      resetField(field, { defaultValue: undefined });

      return;
    }

    // current value does not match default value
    setValue(field, value, {
      shouldTouch: true,
      shouldDirty: true,
    });

    trigger(field);
  };

  type ReactHookFormFieldState = {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isValidating: boolean;
    error?: FieldError | undefined;
  };

  /**
   * Checks if form field has been touched and passed validation.
   */
  const isValidFormField = (fieldState: ReactHookFormFieldState) => {
    return fieldState.isDirty && fieldState.isTouched && !fieldState.invalid;
  };

  return { isValidFormField, setFormFieldValue };
};
