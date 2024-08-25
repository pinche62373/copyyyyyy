import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { FormInputHidden } from "#app/components/backend/form/form-input-hidden";
import { FormInputText } from "#app/components/backend/form/form-input-text";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { getRegion, updateRegion } from "#app/models/region.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import { validateSubmission , validatePageId } from "#app/utils/misc";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { regionSchemaUpdateForm } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

const intent = "update";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const regionId = validatePageId(params.regionId, regionSchemaUpdateForm);

  const region = await getRegion({ id: regionId });

  if (!region) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return { region };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const submission = validateSubmission({
    intent,
    formData: await request.formData(),
    schema: regionSchemaUpdateForm,
  });

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any",
  });

  try {
    await updateRegion(submission.value, userId);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.routes.index,
    `${humanize(crud.singular)} updated successfully`,
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
      <BackendPageTitle title={`Edit ${humanize(crud.singular)}`} />

      <BackendContentContainer className="p-6">
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
      </BackendContentContainer>
    </>
  );
}
