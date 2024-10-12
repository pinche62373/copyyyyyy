import { useEffect } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

interface Args {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const PermissionTypeFilterComponent = ({ onChange }: Args) => {
  const isHydrated = useHydrated();

  // unfortunately we need this effect for preline selects
  // see: https://github.com/htmlstreamofficial/preline/issues/350#issuecomment-2241599171
  useEffect(() => {
    const loadPreline = async () => {
      await import("preline/preline");

      window.HSStaticMethods.autoInit();
    };

    loadPreline();
  }, []);

  return (
    <>
      {isHydrated ? (
        <div className="flex items-center justify-end gap-x-2 pr-3">
          <div className="relative inline-block">
            <select
              id="hs-pro-select-minibar"
              data-hs-select='{
      "placeholder": "Select option...",
      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 before:absolute before:inset-0 before:z-[1] dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
      "dropdownClasses": "whitespace-nowrap end-0 mt-2 z-50 w-40 p-1 space-y-0.5 bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] dark:bg-neutral-950",
      "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-xs text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
    }'
              className="hidden"
              onChange={onChange}
            >
              <option value="all">All permissions</option>
              <option value="model">Model permissions</option>
              <option value="route">Route permissions</option>
            </select>

            <div className="absolute end-1.5 top-1/2 -translate-y-1/2">
              <svg
                className="size-3.5 shrink-0 text-gray-600 dark:text-neutral-400"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
