import { DebouncedInput } from "#app/components/debounced-input";

export const TableSearchInput = ({
  onChange,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  return (
    <div className="px-3 pt-5 pb-5 grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5">
      <div>
        {/*Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
            <svg
              className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>

          <DebouncedInput
            {...props}
            onChange={onChange}
            className="py-[7px] px-3 ps-10 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
          />
        </div>
        {/*End Search Input */}
      </div>
      {/*End Col */}
    </div>
  );
};
