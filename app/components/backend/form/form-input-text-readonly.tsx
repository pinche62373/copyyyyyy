interface Props {
  label: string;
  children: React.ReactNode;
}

export const FormInputTextReadOnly = ({ label, children }: Props) => {
  return (
    <div className="py-2.5 space-y-5">
      {/* Grid */}
      <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
        {/* Col Label*/}
        <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1 whitespace-nowrap">
          <label className="sm:mt-3 inline-block text-sm text-gray-500 dark:text-neutral-500">
            {label}
          </label>
        </div>
        {/* End Col Label*/}

        {/* Col Children*/}
        <div className="mt-0 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
          <div className="min-h-12 py-3 px-4 block w-full rounded-lg text-sm bg-gray-100 border-gray-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600 disabled:opacity-80">
            {children}
          </div>
        </div>
        {/* End Col Children*/}
      </div>
      {/* End Grid */}
    </div>
  );
};
