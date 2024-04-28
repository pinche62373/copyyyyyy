import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createLanguage } from "~/models/language.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "This field is required" } },
      { status: 400 },
    );
  }

  const language = await createLanguage({ name });

  return redirect(`/admin/languages`);
  return redirect(`/admin/languages/${language.id}`);
};

export default function AdminPageNewLanguage() {
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="p-5 md:p-8 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Title */}
      <div className="mb-4 xl:mb-8 border-b border-stone-200 dark:border-neutral-700" >
        <h1 className="mb-4 text-lg font-semibold text-gray-800 dark:text-neutral-200">
          New Language
        </h1>
      </div>
      {/* End Title */}

      {/* Form */}
      <Form
        method="post"
      >
        {/* Form Field Name */}
        <div className="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
          {/* Grid */}
          <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
            {/* Col Name Label*/}
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
              <label
                htmlFor="inputName"
                className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
              >
                Name
              </label>
            </div>
            {/* End Col Name Label*/}

            {/* Col Name Input*/}
            <div className="sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
              <input
                id="inputName"
                ref={nameRef}
                name="name"
                type="text"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                aria-invalid={actionData?.errors?.name ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.name ? "title-error" : undefined
                }
              />
              {/* Validation Error */}
              {actionData?.errors?.name ? (
                <div className="pt-1 text-red-700 text-xs" id="title-error">
                  {actionData.errors.name}
                </div>
              ) : null}
              {/* End Validation Error */}
            </div>
          </div>
          {/* End Col Name Input*/}
        </div>
        {/* End Form Field Name */}

        {/* Footer */}
        <div className="flex justify-end gap-x-2">
          <div className="w-full flex justify-end items-center gap-x-2">
            <button
              type="submit"
              className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
        {/* End Footer */}
      </Form>
    </div>
  );
}
