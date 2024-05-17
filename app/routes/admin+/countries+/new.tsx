import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import {
  AdminFormButtons,
  AdminFormFieldDropdown,
  AdminFormFieldHidden,
  AdminFormFieldText,
} from "#app/components/admin/form";
import { createCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { getModelCrud } from "#app/utils/crud";
import { countrySchema } from "#app/validations/country-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

const { crudCountry: crud } = getModelCrud();

export const loader = async () => {
  const regions = await getRegions();

  return { regions };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "create");

  const submission = parseWithZod(formData, {
    schema: countrySchema.omit({ id: true }),
  });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid form data");
  }

  if (await getRegionById(submission.value.regionId) === null) {
    return jsonWithError(null, "Invalid relationship");
  }

  try {
    await createCountry(submission.value);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.target,
    `${crud.singular} created successfully`,
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: countrySchema.omit({ id: true }),
      });
    },
  });

  return (
    <>
      <AdminPageTitle title={`New ${crud.singular}`} />

      <AdminContentCard className="p-5">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <AdminFormFieldHidden name="intent" value="create" />

          <AdminFormFieldText label="Name" fieldName="name" fields={fields} />

          <AdminFormFieldDropdown
            label="Region"
            items={data.regions}
            fields={fields}
          />

          <AdminFormButtons cancelLink={crud.target} />
        </Form>
      </AdminContentCard>
    </>
  );
}
