import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Controller } from "react-hook-form";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import zod from "zod";
import { getDefaultsForSchema } from "zod-defaults";
import { BackendPanel2 } from "#app/components/backend/panel2";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { ComboBoxItem } from "#app/components/shared/form/combobox-item.tsx";
import { ComboBox } from "#app/components/shared/form/combobox.tsx";
import { TextField } from "#app/components/shared/form/text-field.tsx";
import { createCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { handle as countriesHandle } from "#app/routes/_backend+/admin+/countries+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { countrySchemaCreate } from "#app/validations/country-schema";

// https://stackoverflow.com/questions/76222652/how-to-use-register-from-react-hook-forms-with-headless-ui-combobox

const { countryCrud: crud } = getAdminCrud();

const intent = "create";

const resolver = zodResolver(countrySchemaCreate);

type FormData = zod.infer<typeof countrySchemaCreate>;

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [
    ...countriesHandle.breadcrumb(),
    { name: "New" },
  ],
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  // const regions = await getRegions();

  return {
    defaultValues: {
      ...getDefaultsForSchema(countrySchemaCreate),
      regions: await getRegions(),
    },
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const { data, errors } = await getValidatedFormData<FormData>(
    request,
    resolver,
  );

  if (errors) {
    return jsonWithError({ errors }, "Form data rejected by server", {
      status: 422,
    });
  }

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any",
  });

  if ((await getRegionById(data.country.regionId)) === null) {
    return jsonWithError(null, "Invalid relationship");
  }

  try {
    await createCountry(data.country, userId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return jsonWithError(null, `${humanize(crud.singular)} already exists`);
      }

      return jsonWithError(null, "Unexpected error");
    }
  }

  return redirectWithSuccess(
    crud.routes.index,
    `${humanize(crud.singular)} created successfully`,
  );
};

export default function Component() {
  const { defaultValues } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const { handleSubmit, control, register, setValue } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  return (
    <>
      <BackendPanel2>
        <BackendTitle text={`New ${crud.singular}`} foreground />

        <Form method="POST" onSubmit={handleSubmit} autoComplete="off">
          <input type="hidden" {...register("intent")} value={intent} />
          <input type="hidden" {...register("country.regionId")} />

          <Controller
            name="country.name"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} isInvalid={invalid} variant="ifta">
                <TextField.Label>Name</TextField.Label>
                <TextField.Input type="text" {...register(field.name)} />
                <TextField.FieldError>{error?.message} </TextField.FieldError>
              </TextField>
            )}
          />

          <Controller
            name="country.regionId"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => {
              return (
                <ComboBox
                  onSelectionChange={(id) => setValue(field.name, id as string)}
                  isInvalid={invalid}
                  errorMessage={error && error.message}
                  ariaLabel="Regions"
                  menuTrigger="focus"
                  defaultItems={defaultValues.regions}
                >
                  {(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
                </ComboBox>
              );
            }}
          />

          {/* Put buttons inside flex so we can use order */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end">
            <div className="order-2 sm:order-1 sm:mr-2">
              <Button
                type="button"
                text="Cancel"
                to={crud.routes.index}
                secondary
              />
            </div>
            <div className="order-1 sm:order-2 mb-3 sm:mb-0">
              <Button
                type="submit"
                text="Save"
                disabled={navigation.state === "submitting"}
              />
            </div>
          </div>
        </Form>
      </BackendPanel2>
    </>
  );
}
