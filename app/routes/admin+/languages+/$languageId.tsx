import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useLoaderData
} from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import { z } from "zod";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import {
  AdminFormButtons,
  AdminFormFieldHidden,
  AdminFormFieldText,
} from "#app/components/admin/form";
import { getLanguage, updateLanguage } from "#app/models/language.server";
import { languageSchema } from "#app/validations/language-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

export async function loader({ params }: LoaderFunctionArgs) {
  const languageId = z.coerce.string().parse(params.languageId);
  const language = await getLanguage({ id: languageId });

  if (!language) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ language });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "update");

  const submission = parseWithZod(formData, { schema: languageSchema });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid form data");
  }

  try {
    await updateLanguage(submission.value);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    "/admin/languages",
    "Language updated successfully",
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: languageSchema });
    },
  });

  return (
    <>
      <AdminPageTitle title="Edit Language" />

      <AdminContentCard className="p-6">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <AdminFormFieldHidden name="intent" value="update" />
          <AdminFormFieldHidden name="id" value={data.language.id} />

          <AdminFormFieldText
            label="Name"
            fieldName="name"
            fields={fields}
            defaultValue={data.language.name}
          />

          <AdminFormButtons cancelLink="/admin/languages" />
        </Form>
      </AdminContentCard>
    </>
  );
}
