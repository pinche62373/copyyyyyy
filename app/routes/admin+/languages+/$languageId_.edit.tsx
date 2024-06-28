import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { FormInputText } from "#app/components/admin/form/form-input-text";
import { getLanguage, updateLanguage } from "#app/models/language.server";
import { requireUserId } from "#app/utils/auth.server";
import { getCrud } from "#app/utils/crud";
import { validatePageId, validateFormData } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { languageSchemaUpdateForm } from "#app/validations/language-schema";

const { crudLanguage: crud } = getCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/edit`);

  const languageId = validatePageId(params.languageId, languageSchemaUpdateForm);

  const language = await getLanguage({ id: languageId });

  if (!language) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return { language };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireRoutePermission(request, `${crud.index}/edit`);

  const userId = await requireUserId(request);

  const submission = validateFormData({
    intent: "update",
    formData: await request.formData(),
    schema: languageSchemaUpdateForm,
  });

  try {
    await updateLanguage(submission.value, userId);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.index,
    `${crud.singular} updated successfully`,
  );
};

export default function Component() {
  const { language } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: languageSchemaUpdateForm });
    },
  });

  return (
    <>
      <AdminPageTitle title={`Edit ${crud.singular}`} />

      <AdminContentCard className="p-6">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <FormInputHidden name="intent" value="update" />
          <FormInputHidden name="id" value={language.id} />

          <FormInputText
            label="Name"
            fieldName="name"
            fields={fields}
            defaultValue={language.name}
          />

          <FormFooter>
            <Button type="button" text="Cancel" to={crud.index} secondary />
            <Button
              type="submit"
              text="Save"
              disabled={navigation.state === "submitting"}
            />
          </FormFooter>
        </Form>
      </AdminContentCard>
    </>
  );
}
