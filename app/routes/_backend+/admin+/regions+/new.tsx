import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { FormInputHidden } from "#app/components/backend/form/form-input-hidden";
import { FormInputText } from "#app/components/backend/form/form-input-text";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { createRegion } from "#app/models/region.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import { validateSubmission } from "#app/utils/misc";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { regionSchemaCreateForm } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

const intent = "create";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const submission = validateSubmission({
    intent,
    formData: await request.formData(),
    schema: regionSchemaCreateForm,
  });

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any",
  });

  try {
    await createRegion(submission.value, userId);
  } catch {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.routes.index,
    `${humanize(crud.singular)} created successfully`,
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
      <BackendPageTitle title={`New ${crud.singular}`} />

      <BackendContentContainer className="p-5">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <FormInputHidden name="intent" value={intent} />

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
      </BackendContentContainer>
    </>
  );
}
