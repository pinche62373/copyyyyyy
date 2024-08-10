import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputDropdown } from "#app/components/admin/form/form-input-dropdown";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { FormInputText } from "#app/components/admin/form/form-input-text";
import { createCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize, validateSubmission } from "#app/utils/misc";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { countrySchemaCreateForm } from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: crud.routes.new,
    scope: "any",
  });

  const regions = await getRegions();

  return { regions };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const intent = "create"

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any",
  });

  const userId = await requireUserId(request);

  const submission = validateSubmission({
    intent,
    formData: await request.formData(),
    schema: countrySchemaCreateForm,
  });

  if ((await getRegionById(submission.value.regionId)) === null) {
    return jsonWithError(null, "Invalid relationship");
  }

  try {
    await createCountry(submission.value, userId);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.routes.index,
    `${humanize(crud.singular)} created successfully`,
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: countrySchemaCreateForm,
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

          <FormInputDropdown
            label="Region"
            items={data.regions}
            fields={fields}
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
      </AdminContentCard>
    </>
  );
}
