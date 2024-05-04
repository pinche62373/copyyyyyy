import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from '@remix-run/react';

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import {
  AdminFormButtons,
  AdminFormFieldHidden,
  AdminFormFieldText,
} from "#app/components/admin/form";
import { createLanguage } from "#app/models/language.server";
import { languageSchema } from "#app/validations/language-schema";
import { validateFormIntent } from '#app/validations/validate-form-intent';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()

  validateFormIntent(formData, "create")

  const submission = parseWithZod(formData, { schema: languageSchema.omit({id: true}) })

  if (submission.status !== 'success') {
    throw new Response("Error", { status: 404});
  }

  await createLanguage(submission.value);

  return redirect(`/admin/languages`);
};

export default function Component() {
  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: languageSchema.omit({id:true}) })
    },
  })

  return (
    <>
      <AdminPageTitle title="New Language" />

      <AdminContentCard className="p-5">
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <AdminFormFieldHidden name="intent" value="create" />

          <AdminFormFieldText
            label="Name"
            fieldName="name"
            fields={fields}
          />

          <AdminFormButtons cancelLink="/admin/languages" />
      </Form>
      </AdminContentCard>
    </>
  );
}
