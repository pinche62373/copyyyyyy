import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";
import { z } from "zod";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { FormInputText } from "#app/components/admin/form/form-input-text";
import { getRegion, updateRegion } from "#app/models/region.server";
import { getUserId } from "#app/utils/auth.server";
import { getCrud } from "#app/utils/crud";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { regionSchemaUpdateForm } from "#app/validations/region-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

const { crudRegion: crud } = getCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/edit`);

  const regionId = z.coerce.string().parse(params.regionId);
  const region = await getRegion({ id: regionId });

  if (!region) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return json({ region });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "update");

  const submission = parseWithZod(formData, { schema: regionSchemaUpdateForm });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid form data");
  }

  const userId = await getUserId(request);

  invariant(userId, "userId must be set"); // TODO : make this check obsolete by refactoring getUserId function(s)

  try {
    await updateRegion(submission.value, userId);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.index,
    `${crud.singular} updated successfully`,
  );
};

export default function Component() {
  const { region } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: regionSchemaUpdateForm });
    },
  });

  return (
    <>
      <AdminPageTitle title={`Edit ${crud.singular}`} />

      <AdminContentCard className="p-6">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <FormInputHidden name="intent" value="update" />
          <FormInputHidden name="id" value={region.id} />

          <FormInputText
            label="Name"
            fieldName="name"
            fields={fields}
            defaultValue={region.name}
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
