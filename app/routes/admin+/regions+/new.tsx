import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { FormInputText } from "#app/components/admin/form/form-input-text";
import { createRegion } from "#app/models/region.server";
import { getUserId } from "#app/utils/auth.server";
import { getCrud } from "#app/utils/crud";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { validateFormIntent } from "#app/validations/form-intent";
import { regionSchemaCreateForm } from "#app/validations/region-schema";

const { crudRegion: crud } = getCrud();

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/new`);

  return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent({ formData, intent: "create" });

  const submission = parseWithZod(formData, {
    schema: regionSchemaCreateForm,
  });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid form data");
  }

  const userId = await getUserId(request);

  invariant(userId, "userId must be set"); // TODO : make this check obsolete by refactoring getUserId function(s)

  try {
    await createRegion({ ...submission.value }, userId);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.index,
    `${crud.singular} created successfully`,
  );
};

export default function Component() {
  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: regionSchemaCreateForm,
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
