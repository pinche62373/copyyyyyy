import { useLoaderData } from "@remix-run/react";

import { prisma } from "#app/utils/db.server";

export const loader = async () => {
  const userCount = await prisma.user.count()

  return { userCount }
};

export default function AdminIndexPage() {
  const { userCount } = useLoaderData<typeof loader>()

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-5">
        {/* Card */}
        <div className="p-4 sm:p-5 bg-white border border-stone-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="sm:flex sm:gap-x-3">
            <svg
              className="sm:order-2 mb-2 sm:mb-0 flex-shrink-0 size-6 text-stone-400 dark:text-neutral-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" x2="22" y1="12" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <div className="sm:order-1 grow space-y-1">
              <h2 className="sm:mb-3 text-sm text-stone-500 dark:text-neutral-400">
                Movies
              </h2>
              <p className="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">
                1.214
              </p>
            </div>
          </div>
        </div>
        {/* End Card */}

        {/* Card */}
        <div className="p-4 sm:p-5 bg-white border border-stone-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="sm:flex sm:gap-x-3">
            <svg
              className="sm:order-2 mb-2 sm:mb-0 flex-shrink-0 size-6 text-stone-400 dark:text-neutral-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m15 9-6 6" />
              <path d="M9 9h.01" />
              <path d="M15 15h.01" />
            </svg>
            <div className="sm:order-1 grow space-y-1">
              <h2 className="sm:mb-3 text-sm text-stone-500 dark:text-neutral-400">
                Actors
              </h2>
              <p className="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">
                29
              </p>
            </div>
          </div>
        </div>
        {/* End Card */}

        {/* Card */}
        <div className="p-4 sm:p-5 bg-white border border-stone-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="sm:flex sm:gap-x-3">
            <svg
              className="sm:order-2 mb-2 sm:mb-0 flex-shrink-0 size-6 text-stone-400 dark:text-neutral-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
              <path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
              <rect width="8" height="8" x="14" y="14" rx="2" />
            </svg>
            <div className="sm:order-1 grow space-y-1">
              <h2 className="sm:mb-3 text-sm text-stone-500 dark:text-neutral-400">
                Animals
              </h2>
              <p className="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">
                123
              </p>
            </div>
          </div>
        </div>
        {/* End Card */}

        {/* Card */}
        <div className="p-4 sm:p-5 bg-white border border-stone-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="sm:flex sm:gap-x-3">
            <svg
              className="sm:order-2 mb-2 sm:mb-0 flex-shrink-0 size-6 text-stone-400 dark:text-neutral-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
              <path d="M2 7h20" />
              <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
            </svg>
            <div className="sm:order-1 grow space-y-1">
              <h2 className="sm:mb-3 text-sm text-stone-500 dark:text-neutral-400">
                Users
              </h2>
              <p className="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">
                {userCount}
              </p>
            </div>
          </div>
        </div>
        {/* End Card */}
      </div>
      {/* End Stats Grid */}
    </>
  );
}
