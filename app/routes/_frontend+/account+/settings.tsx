import { LoaderFunctionArgs } from "@remix-run/node";

import { FrontendSection } from "#app/components/frontend/section";
import { authenticator } from "#app/utils/auth.server";
import { AUTH_LOGIN_ROUTE } from "#app/utils/constants";
import { useUser } from "#app/utils/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  await authenticator.isAuthenticated(request, {
    failureRedirect: AUTH_LOGIN_ROUTE + `?returnTo=${url.pathname}`,
  });

  return null;
};

export default function SettingsIndexPage() {
  const user = useUser();

  return (
    <FrontendSection>
      {/* Personal Info */}
      <div className="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
        <h2 className="font-semibold text-gray-800 dark:text-neutral-200">
          Settings
        </h2>

        {/* Grid */}
        <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
          <div className="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
            <label
              htmlFor="hs-pro-dappiun"
              className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
            >
              Username
            </label>
          </div>
          {/* End Col */}

          <div className="sm:col-span-8 xl:col-span-4">
            <input
              id="hs-pro-dappiun"
              type="text"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
              value={user.email}
            />
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}

        {/* Grid */}
        <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
          <div className="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
            <label
              htmlFor="hs-pro-dappiem"
              className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
            >
              Email
            </label>
          </div>
          {/* End Col */}

          <div className="sm:col-span-8 xl:col-span-4">
            <input
              id="hs-pro-dappiem"
              type="text"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
              placeholder="Enter email address"
            />
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}

        {/* ----------------------------------------- */}

        {/* Password */}
        <div className="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
          <div className="inline-flex items-center gap-x-2">
            <h2 className="font-semibold text-gray-800 dark:text-neutral-200">
              Password
            </h2>

            {/* Tooltip */}
            <div className="hs-tooltip inline-block">
              <svg
                className="hs-tooltip-toggle flex-shrink-0 ms-1 size-3 text-gray-500 dark:text-neutral-500"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              <div
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-[60] p-4 w-96 bg-white rounded-xl shadow-xl dark:bg-neutral-900 dark:text-neutral-400"
                role="tooltip"
              >
                <p className="font-medium text-gray-800 dark:text-neutral-200">
                  Password requirements:
                </p>
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-neutral-400">
                  Ensure that these requirements are met:
                </p>
                <ul className="mt-1 ps-3.5 list-disc list-outside text-sm font-normal text-gray-500 dark:text-neutral-400">
                  <li>Minimum 8 characters long - the more, the better</li>
                  <li>At least one lowercase character</li>
                  <li>At least one uppercase character</li>
                  <li>At least one number, symbol, or whitespace character</li>
                </ul>
              </div>
            </div>
            {/* End Tooltip */}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
            <div className="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
              <label
                htmlFor="hs-pro-dappcp"
                className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
              >
                Current password
              </label>
            </div>
            {/* End Col */}

            <div className="sm:col-span-8 xl:col-span-4">
              {/* Input */}
              <div className="relative">
                <input
                  id="hs-pro-dappcp"
                  type="text"
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  data-hs-toggle-password='{
                      "target": "#hs-pro-dappcp"
                    }'
                  className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                >
                  <svg
                    className="flex-shrink-0 size-3.5"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      className="hs-password-active:hidden"
                      d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                    />
                    <path
                      className="hs-password-active:hidden"
                      d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                    />
                    <path
                      className="hs-password-active:hidden"
                      d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                    />
                    <line
                      className="hs-password-active:hidden"
                      x1="2"
                      x2="22"
                      y1="2"
                      y2="22"
                    />
                    <path
                      className="hidden hs-password-active:block"
                      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                    />
                    <circle
                      className="hidden hs-password-active:block"
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </svg>
                </button>
              </div>
              {/* End Input */}
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}

          {/* Grid */}
          <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
            <div className="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
              <label
                htmlFor="hs-pro-dappnp"
                className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
              >
                New password
              </label>
            </div>
            {/* End Col */}

            <div className="sm:col-span-8 xl:col-span-4">
              <div data-hs-toggle-password-group className="space-y-2">
                {/* Input */}
                <div className="relative">
                  <input
                    id="hs-pro-dappnp"
                    type="text"
                    className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    data-hs-toggle-password='{
                        "target": ["#hs-pro-dappnp", "#hs-pro-dapprnp"]
                      }'
                    className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                  >
                    <svg
                      className="flex-shrink-0 size-3.5"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        className="hs-password-active:hidden"
                        d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                      />
                      <path
                        className="hs-password-active:hidden"
                        d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                      />
                      <path
                        className="hs-password-active:hidden"
                        d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                      />
                      <line
                        className="hs-password-active:hidden"
                        x1="2"
                        x2="22"
                        y1="2"
                        y2="22"
                      />
                      <path
                        className="hidden hs-password-active:block"
                        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                      />
                      <circle
                        className="hidden hs-password-active:block"
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  </button>
                </div>
                {/* End Input */}

                {/* Input */}
                <div className="relative">
                  <input
                    id="hs-pro-dapprnp"
                    type="text"
                    className="mt-5 py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    data-hs-toggle-password='{
                        "target": ["#hs-pro-dappnp", "#hs-pro-dapprnp"]
                      }'
                    className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                  >
                    <svg
                      className="flex-shrink-0 size-3.5"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        className="hs-password-active:hidden"
                        d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                      />
                      <path
                        className="hs-password-active:hidden"
                        d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                      />
                      <path
                        className="hs-password-active:hidden"
                        d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                      />
                      <line
                        className="hs-password-active:hidden"
                        x1="2"
                        x2="22"
                        y1="2"
                        y2="22"
                      />
                      <path
                        className="hidden hs-password-active:block"
                        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                      />
                      <circle
                        className="hidden hs-password-active:block"
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  </button>
                </div>
                {/* End Input */}

                <div
                  data-hs-strong-password='{
                        "target": "#hs-pro-dappnp",
                        "stripClasses": "hs-strong-password:opacity-100 hs-strong-password-accepted:bg-teal-500 h-2 flex-auto rounded-full bg-blue-500 opacity-50 mx-1"
                      }'
                  className="flex mt-2 -mx-1 pt-2 pb-4"
                ></div>

                {/* Button Group */}
                <div className="flex items-center gap-x-3 mt-5">
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Change
                  </button>
                </div>
                {/* End Button Group */}
              </div>
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </div>
        {/* End Password */}
      </div>

      {/* End Account Card */}
    </FrontendSection>
  );
}
