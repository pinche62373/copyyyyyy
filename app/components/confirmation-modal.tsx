interface PropTypes {
  modalId: string;
  formId?: string;
  caption: string;
  body: string;
  confirmButtonText: string;
  className?: string;
}

export function ConfirmationModal({
  modalId,
  formId,
  caption,
  body,
  confirmButtonText,
  ...rest
}: PropTypes) {
  return (
    <div
      id={modalId}
      className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto"
      {...rest}
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-xl md:w-full m-3 md:mx-auto">
        {/* Close Button */}
        <div className="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
          <div className="absolute top-2 end-2">
            <button
              type="button"
              className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700"
              data-hs-overlay={"#" + modalId}
            >
              <span className="sr-only">Close</span>
              <svg
                className="flex-shrink-0 size-4"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 sm:p-10 overflow-y-auto">
            <div className="flex gap-x-4 md:gap-x-7">
              {/* <!-- Icon --> */}
              <span className="flex-shrink-0 inline-flex justify-center items-center size-[46px] sm:w-[62px] sm:h-[62px] rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100">
                <svg
                  className="flex-shrink-0 size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </span>
              {/* <!-- End Icon --> */}

              <div className="grow">
                <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">
                  {caption}
                </h3>
                <p className="text-wrap text-gray-500 dark:text-neutral-500">{body}</p>
              </div>
            </div>

          </div>

          <div className="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-neutral-950 dark:border-neutral-800">
            <button
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800"
              data-hs-overlay={"#" + modalId}
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formId}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay={"#" + modalId}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
