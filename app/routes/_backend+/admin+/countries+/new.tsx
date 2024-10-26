import type { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { Input } from "#app/components/shared/form/input";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { ComboBox } from "#app/components/shared/form/inputs/combobox";
import { ComboBoxItem } from "#app/components/shared/form/inputs/combobox-item";
import { createCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { countrySchemaCreate } from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

const intent = "create";

const formValidator = withZod(countrySchemaCreate);

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const regions = await getRegions();

  return {
    form: {
      country: {
        name: null as unknown as string,
        regionId: null as unknown as string
      },
    },
    regions
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const validated = await formValidator.validate(await request.formData());

  if (validated.error)
    return jsonWithError(validated.error, "Form data rejected by server", {
      status: 422
    });

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any"
  });

  if ((await getRegionById(validated.data.country.regionId)) === null) {
    return jsonWithError(null, "Invalid relationship");
  }

  try {
    await createCountry(validated.data.country, userId);
  } catch {
    return jsonWithError(null, "Unexpected error");
  }

  return redirectWithSuccess(
    crud.routes.index,
    `${humanize(crud.singular)} created successfully`
  );
};

export default function Component() {
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const form = useForm({
    method: "post",
    validator: formValidator,
    defaultValues: { intent, ...loaderData.form }
  });

  return (
    <>
      <BackendPageTitle title={`New ${crud.singular}`} />

      <BackendContentContainer className="p-5">
        <form {...form.getFormProps()}>
          <InputGeneric
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />

          {/* country.name */}
          <Input>
            <Input.Label>Name</Input.Label>
            <Input.Field>
              <InputGeneric scope={form.scope("country.name")}></InputGeneric>
            </Input.Field>
          </Input>

          {/* country.regionId  */}
          <Input>
            <Input.Label>Region</Input.Label>
            <Input.Field>
              <ComboBox
                {...form.getControlProps("country.regionId")}
                ariaLabel="Regions"
                menuTrigger="focus"
                defaultItems={loaderData.regions}
              >
                {/* @ts-expect-error: Property 'name' does not exist on type 'object'.ts(2339) due to Spectrum ListBox Collection */}
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
        </form>
      </BackendContentContainer>
    </>
  );
}
