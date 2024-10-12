interface Props {
  label: string;
  children: React.ReactNode;
}

export const FormInputTextReadOnly = ({ label, children }: Props) => {
  return (
    <div className="space-y-5 py-2.5">
      {/* Grid */}
      <div className="grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0">
        {/* Col Label*/}
        <div className="whitespace-nowrap sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
          <label className="inline-block text-sm text-gray-500 sm:mt-3 dark:text-neutral-500">
            {label}
          </label>
        </div>
        {/* End Col Label*/}

        {/* Col Children*/}
        <div className="mt-0 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
          <div className="block min-h-12 w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-80 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600">
            {children}
          </div>
        </div>
        {/* End Col Children*/}
      </div>
      {/* End Grid */}
    </div>
  );
};
