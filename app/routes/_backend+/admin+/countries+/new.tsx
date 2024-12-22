import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Controller } from "react-hook-form";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import zod from "zod";
import { BackendPanel2 } from "#app/components/backend/panel2";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { Float } from "#app/components/shared/float.tsx";
import { ComboBoxItem } from "#app/components/shared/form/combobox-item.tsx";
import { ComboBox } from "#app/components/shared/form/combobox.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { createCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { handle as countriesHandle } from "#app/routes/_backend+/admin+/countries+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { getDefaultValues } from "#app/utils/lib/get-default-values.ts";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { countrySchemaCreate } from "#app/validations/country-schema";

// https://stackoverflow.com/questions/76222652/how-to-use-register-from-react-hook-forms-with-headless-ui-combobox

const { countryCrud: crud } = getAdminCrud();

const intent = "create" as const;

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

  return {
    defaultValues: {
      ...getDefaultValues(countrySchemaCreate),
      intent,
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
  console.log("DEFAULT VALUES:", defaultValues);

  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useRemixForm<FormData>({
    mode: "onBlur",
    resolver,
    defaultValues,
  });

  return (
    <>
      <BackendPanel2>
        <BackendTitle text={`New ${crud.singular}`} foreground />

        <Form method="POST" onSubmit={handleSubmit} autoComplete="off">
          <input type="hidden" {...register("intent")} />
          <input type="hidden" {...register("country.regionId")} />

          <Input
            label="Name"
            variant="ifta"
            {...register("country.name")}
            error={errors.country?.name?.message}
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

          <Float direction="end">
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
          </Float>
        </Form>
      </BackendPanel2>
    </>
  );
}
