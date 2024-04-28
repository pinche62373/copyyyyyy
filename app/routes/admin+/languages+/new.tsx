import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, NavLink } from "@remix-run/react";

import { AdminPageTitle } from "#app/components/admin/page-title";
import { createLanguage } from "#app/models/language.server";
import { languageSchema } from "#app/validations/language-schema";


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const submission = await parseWithZod(formData, { schema: languageSchema })

  // Send the submission back to the client if the status is not successful
  if (submission.status !== 'success') {
    return json(
      { status: "error", submission },
      { status: 400 },
    )
  }

  // Successful submission, create record
  const { name } = submission.value

  await createLanguage({ name });

  return redirect(`/admin/languages`);
    // return redirect(`/admin/languages/${language.id}`);
};

export default function AdminPageNewLanguage() {
  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: languageSchema })
    },
  })

  return (
    <>
      <AdminPageTitle title="New Language" />

      <div className="p-5 md:p-8 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        {/* Form */}
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          {/* Form Field Name */}
          <div className="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
            {/* Grid */}
            <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
              {/* Col Name Label*/}
              <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
                <label
                  htmlFor={fields.name.id}
                  className="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
                >
                  Name
                </label>
              </div>
              {/* End Col Name Label*/}

              {/* Col Name Input*/}
              <div className="sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
                <input
                  autoFocus
                  id="inputName"
                  type="text"
                  name={fields.name.name}
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                />
                {/* Validation Error */}
                  <div className="pt-1 text-red-700 text-xs" id="name-error">
                    {fields.name.errors}
                  </div>

                {/* End Validation Error */}
              </div>
            </div>
            {/* End Col Name Input*/}
          </div>
          {/* End Form Field Name */}

          {/* Footer */}
          <div className="flex justify-end gap-x-2">
            <div className="w-full flex justify-end items-center gap-x-2">
              <NavLink to="/admin/languages">
                <button
                  type="button"
                  className="py-2 px-3 inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  Cancel
                </button>
              </NavLink>

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
    </>
  );
}
