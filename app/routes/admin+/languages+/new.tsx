import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { AdminFormButtons } from "#app/components/admin/form/form-buttons";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { FormInputText } from "#app/components/admin/form/form-input-text";
import { createLanguage } from "#app/models/language.server";
import { getModelCrud } from "#app/utils/crud";
import { languageSchema } from "#app/validations/language-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

const { crudLanguage: crud } = getModelCrud();

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "create");

  const submission = parseWithZod(formData, {
    schema: languageSchema.omit({ id: true }),
  });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid form data");
  }

  try {
    await createLanguage(submission.value);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.target,
    `${crud.singular} created successfully`,
  );
};

export default function Component() {
  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: languageSchema.omit({ id: true }),
      });
    },
  });

  return (
    <>
      <AdminPageTitle title={`New ${crud.singular}`} />

      <AdminContentCard className="p-5">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <FormInputHidden name="intent" value="create" />

          <FormInputText label="Name" fieldName="name" fields={fields} />

          <AdminFormButtons cancelLink={crud.target} />
        </Form>
      </AdminContentCard>
    </>
  );
}
