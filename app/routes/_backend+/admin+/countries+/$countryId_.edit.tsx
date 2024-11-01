import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { BackendPageTitle } from "#app/components/backend/page-title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { Input } from "#app/components/shared/form/input";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { ComboBox } from "#app/components/shared/form/inputs/combobox";
import { ComboBoxItem } from "#app/components/shared/form/inputs/combobox-item";
import { getCountry, updateCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { handle as countriesHandle } from "#app/routes/_backend+/admin+/countries+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { validatePageId } from "#app/utils/validate-page-id";
import {
  countrySchema,
  countrySchemaUpdate
} from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

const intent = "update";

const formValidator = withZod(countrySchemaUpdate);

export const handle = {
  breadcrumb: ({
    data
  }: {
    data: { form: { country: { id: string; name: string } } };
  }): BreadcrumbHandle => [
    ...countriesHandle.breadcrumb(),
    {
      name: data.form.country.name,
      to: `${crud.routes.index}/${data.form.country.id}`
    },
    { name: "Edit" }
  ]
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const countryId = validatePageId(params.countryId, countrySchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const country = await getCountry({ id: countryId });

  if (!country) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const regions = await getRegions();

  return {
    form: {
      country
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
    await updateCountry(validated.data.country, userId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return jsonWithError(null, `${humanize(crud.singular)} already exists`);
      }

      return jsonWithError(null, "Unexpected error");
    }
  }

  return jsonWithSuccess(
    null,
    `${humanize(crud.singular)} updated successfully`
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
      <BackendPageTitle title={`Edit ${humanize(crud.singular)}`} />

      <BackendContentContainer className="p-6">
        <form {...form.getFormProps()} autoComplete="off">
          <InputGeneric
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />
          <InputGeneric scope={form.scope("country.id")} type="hidden" />

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
                defaultSelectedKey={
                  loaderData.regions.find(
                    (region) => region.id === loaderData.form.country.regionId
                  )?.id
                }
              >
                {/* @ts-expect-error: Property 'name' does not exist on type 'object'.ts(2339) due to Spectrum ListBox Collection */}
                {(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
              </ComboBox>
            </Input.Field>
          </Input>

          <FormFooter>
            <Button
              type="button"
              text="Close"
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
