import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import { z } from "zod";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputDropdown } from "#app/components/admin/form/form-input-dropdown";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { FormInputText } from "#app/components/admin/form/form-input-text";
import { getCountry, updateCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { getModelCrud } from "#app/utils/crud";
import { countrySchema } from "#app/validations/country-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

const { crudCountry: crud } = getModelCrud();

export async function loader({ params }: LoaderFunctionArgs) {
  const countryId = z.coerce.string().parse(params.countryId);
  const country = await getCountry({ id: countryId });

  if (!country) {
    throw new Response("Not Found", { status: 404 });
  }

  const regions = await getRegions();

  return json({ country, regions });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "update");

  const submission = parseWithZod(formData, { schema: countrySchema });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid form data");
  }

  if (await getRegionById(submission.value.regionId) === null) {
    return jsonWithError(null, "Invalid relationship");
  }

  try {
    await updateCountry(submission.value);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.target,
    `${crud.singular} updated successfully`,
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: countrySchema });
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
            <Button type="button" text="Cancel" secondary link={crud.target} disabled={navigation.state === "submitting"} />
            <Button type="submit" text="Save" />
          </FormFooter>
        </Form>
      </AdminContentCard>
    </>
  );
}
