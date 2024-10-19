import { useForm, getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { FormInputHidden } from "#app/components/backend/form/form-input-hidden";
import { FormInputText } from "#app/components/backend/form/form-input-text";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { Button } from "#app/components/shared/button";
import { ComboBox } from "#app/components/shared/form/combobox";
import { ComboBoxItem } from "#app/components/shared/form/combobox-item";
import { FormFooter } from "#app/components/shared/form/footer";
import { Input } from "#app/components/shared/form/input";
import { Label } from "#app/components/shared/form/label";
import { getCountry, updateCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import { validateSubmission } from "#app/utils/misc";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { countrySchemaUpdateForm } from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

const intent = "update";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const countryId = countrySchemaUpdateForm
    .pick({ id: true })
    .parse({ id: params.countryId }).id;

  const country = await getCountry({ id: countryId });

  if (!country) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const regions = await getRegions();

  return { country, regions };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const submission = validateSubmission({
    intent,
    formData: await request.formData(),
    schema: countrySchemaUpdateForm
  });

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any"
  });

  if ((await getRegionById(submission.value.regionId)) === null) {
    return jsonWithError(null, "Invalid relationship");
  }

  try {
    await updateCountry(submission.value, userId);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return jsonWithSuccess(
    null,
    `${humanize(crud.singular)} updated successfully`
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: countrySchemaUpdateForm });
    }
  });

  return (
    <>
      <BackendPageTitle title={`Edit ${humanize(crud.singular)}`} />

      <BackendContentContainer className="p-6">
        <Form method="POST" {...getFormProps(form)}>
          <FormInputHidden name="intent" value={intent} />
          <FormInputHidden name="id" value={data.country.id} />

          <FormInputText
            label="Name"
            fieldName="name"
            fields={fields}
            defaultValue={data.country.name}
          />

          <Input>
            <Input.Label>
              <Label label="Region" />
            </Input.Label>

            <Input.Field>
              <ComboBox
                name="regionId"
                ariaLabel="Regions"
                menuTrigger="focus"
                defaultItems={data.regions}
                defaultSelectedKey={
                  data.regions.find(
                    (region) => region.id === data.country.region.id
                  )?.id
                }
              >
                {(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
              </ComboBox>
            </Input.Field>
          </Input>

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
