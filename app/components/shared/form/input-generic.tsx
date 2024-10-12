import { useField, FormScope, ValueOfInputType } from "@rvf/react";
import { ComponentPropsWithRef, forwardRef, useId } from "react";

// For our props, we'll take everything from the native input element except for `type`.
// You can make futher changes here to suite your needs.
type BaseInputProps = Omit<ComponentPropsWithRef<"input">, "type">;

interface DefaultInputProps<Type extends string> extends BaseInputProps {
  label: string;
  type?: Type;
  scope: FormScope<ValueOfInputType<Type>>;
}

interface HiddenInputPropsTwo<Type extends string> extends BaseInputProps {
  type: "hidden";
  scope: FormScope<ValueOfInputType<Type>>;
}

// We need to do this in order to get a generic type out of `forwardRef`.
// In React 19, you won't need this anymore.
type InputType = <Type extends string>(
  props: DefaultInputProps<Type> | HiddenInputPropsTwo<Type>
) => React.ReactNode;

const MyInputImpl = forwardRef<HTMLInputElement, DefaultInputProps<string>>(
  ({ label, scope, type, ...rest }, ref) => {
    const field = useField(scope);
    const inputId = useId();
    const errorId = useId();

    if (type === "hidden") {
      return (
        <input
          {...field.getInputProps({
            type,
            id: inputId,
            ref,
            ...rest
          })}
        />
      );
    }

    return (
      <>
        <div className="space-y-5 py-2.5">
          {/* Grid */}
          <div className="grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0">
            {/* Column Label*/}
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
              <label
                htmlFor={inputId}
                className="inline-block text-sm text-gray-500 sm:mt-2.5 dark:text-neutral-500"
              >
                {label}
              </label>
            </div>
            {/* End Column Label*/}

            {/* Column Input*/}
            <div className="mt-0.5 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
              {/* Input */}
              <input
                className="block w-full rounded-lg border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                {...field.getInputProps({
                  type,
                  id: inputId,
                  ref,
                  "aria-describedby": errorId,
                  "aria-invalid": !!field.error(),
                  ...rest
                })}
              />

              {/* Validation Errors */}
              <div id={errorId} className="pt-1 text-xs text-red-700">
                {field.error()}
              </div>
            </div>
            {/* End Column Input*/}
          </div>
          {/* End Grid */}
        </div>
        {/* End Container */}
      </>
    );
  }
);

MyInputImpl.displayName = "MyInput";

export const InputGeneric = MyInputImpl as InputType;
