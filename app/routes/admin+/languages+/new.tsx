import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { FormInputText } from "#app/components/admin/form/form-input-text";
import { createLanguage } from "#app/models/language.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { validateSubmission } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { languageSchemaCreateForm } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, crud.routes.new);

  return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireRoutePermission(request, crud.routes.new);

  const userId = await requireUserId(request);

  const submission = validateSubmission({
    intent: "create",
    formData: await request.formData(),
    schema: languageSchemaCreateForm,
  });

  try {
    await createLanguage(submission.value, userId);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.routes.index,
    `${crud.singular} created successfully`,
  );
};

export default function Component() {
  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: languageSchemaCreateForm,
      });
    },
  });

  return (
    <>
      <AdminPageTitle title={`New ${crud.singular}`} noBackButton />

      <AdminContentCard className="p-5">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <FormInputHidden name="intent" value="create" />

          <FormInputText label="Name" fieldName="name" fields={fields} />

          <FormFooter>
            <Button
              type="button"
              text="Cancel"
              to={crud.routes.index}
              secondary
            />
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
