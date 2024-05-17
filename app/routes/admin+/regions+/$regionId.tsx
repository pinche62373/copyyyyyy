import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import { z } from "zod";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import {
  AdminFormButtons,
  AdminFormFieldHidden,
  AdminFormFieldText,
} from "#app/components/admin/form";
import { getRegion, updateRegion } from "#app/models/region.server";
import { getModelCrud } from "#app/utils/crud";
import { regionSchema } from "#app/validations/region-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

const { crudRegion: crud } = getModelCrud();

export async function loader({ params }: LoaderFunctionArgs) {
  const regionId = z.coerce.string().parse(params.regionId);
  const region = await getRegion({ id: regionId });

  if (!region) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ region });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "update");

  const submission = parseWithZod(formData, { schema: regionSchema });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid form data");
  }

  try {
    await updateRegion(submission.value);
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

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: regionSchema });
    },
  });

  return (
    <>
      <AdminPageTitle title={`Edit ${crud.singular}`} />

      <AdminContentCard className="p-6">
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <AdminFormFieldHidden name="intent" value="update" />
          <AdminFormFieldHidden name="id" value={data.region.id} />

          <AdminFormFieldText
            label="Name"
            fieldName="name"
            fields={fields}
            defaultValue={data.region.name}
          />

          <AdminFormButtons cancelLink={crud.target} />
        </Form>
      </AdminContentCard>
    </>
  );
}
