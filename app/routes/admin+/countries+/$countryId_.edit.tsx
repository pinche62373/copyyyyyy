import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputDropdown } from "#app/components/admin/form/form-input-dropdown";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { FormInputText } from "#app/components/admin/form/form-input-text";
import { getCountry, updateCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { getUserId } from "#app/utils/auth.server";
import { getCrud } from "#app/utils/crud";
import { getPageId } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { countrySchemaUpdateForm } from "#app/validations/country-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

const { crudCountry: crud } = getCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/edit`);

  const countryId = getPageId(params.countryId, countrySchemaUpdateForm);

  const country = await getCountry({ id: countryId });

  if (!country) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const regions = await getRegions();

  return { country, regions };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "update");

  const submission = parseWithZod(formData, {
    schema: countrySchemaUpdateForm,
  });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid form data");
  }

  if ((await getRegionById(submission.value.regionId)) === null) {
    return jsonWithError(null, "Invalid relationship");
  }

  const userId = await getUserId(request);

  invariant(userId, "userId must be set"); // TODO : make this check obsolete by refactoring getUserId function(s)

  try {
    await updateCountry(submission.value, userId);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.index,
    `${crud.singular} updated successfully`,
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: countrySchemaUpdateForm });
    },
  });

  return (
    <>
      <AdminPageTitle title={`Edit ${crud.singular}`} />

      <AdminContentCard className="p-6">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <FormInputHidden name="intent" value="update" />
          <FormInputHidden name="id" value={data.country.id} />

          <FormInputText
            label="Name"
            fieldName="name"
            fields={fields}
            defaultValue={data.country.name}
          />

          <FormInputDropdown
            label="Region"
            items={data.regions}
            fields={fields}
            defaultValue={data.country.region.id}
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
