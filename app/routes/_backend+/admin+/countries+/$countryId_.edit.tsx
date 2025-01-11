import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "prisma-client";
import { Controller } from "react-hook-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import zod from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { ComboBoxItem } from "#app/components/shared/form/combobox-item.tsx";
import { ComboBox } from "#app/components/shared/form/combobox.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { LinkButton } from "#app/components/ui/link-button.tsx";
import { SubmitButton } from "#app/components/ui/submit-button.tsx";
import { getCountry, updateCountry } from "#app/models/country.server";
import { getRegionById, getRegions } from "#app/models/region.server";
import { handle as countriesHandle } from "#app/routes/_backend+/admin+/countries+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { validatePageId } from "#app/utils/validate-page-id";
import {
  CountrySchema,
  CountrySchemaUpdate,
} from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

const intent = "update" as const;

const resolver = zodResolver(CountrySchemaUpdate);

type FormData = zod.infer<typeof CountrySchemaUpdate>;

export const handle = {
  breadcrumb: ({
    data,
  }: {
    data: { defaultValues: { country: { id: string; name: string } } };
  }): BreadcrumbHandle => [
    ...countriesHandle.breadcrumb(),
    {
      name: data.defaultValues.country.name,
      to: `${crud.routes.index}/${data.defaultValues.country.id}`,
    },
    { name: "Edit" },
  ],
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const countryId = validatePageId(params.countryId, CountrySchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const country = await getCountry({ id: countryId });

  if (!country) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const regions = await getRegions();

  return {
    defaultValues: { country, intent },
    regions,
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const { data, errors } = await getValidatedFormData<FormData>(
    request,
    resolver,
  );

  if (errors) {
    throw dataWithError({ errors }, "Form data rejected by server", {
      status: 422,
    });
  }

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any",
  });

  if ((await getRegionById(data.country.regionId)) === null) {
    return dataWithError(null, "Invalid relationship");
  }

  try {
    await updateCountry(data.country, userId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return dataWithError(null, `${humanize(crud.singular)} already exists`);
      }

      return dataWithError(null, "Unexpected error");
    }
  }

  return dataWithSuccess(
    null,
    `${humanize(crud.singular)} updated successfully`,
  );
};

export default function Component() {
  const { defaultValues, regions } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    register,
    setValue,
    getFieldState,
    formState,
  } = useRemixForm<FormData>({
    mode: "onChange",
    resolver,
    defaultValues,
  });

  return (
    <>
      <BackendPanel>
        <BackendTitle text={`Edit ${crud.singular}`} foreground />

        <Form method="POST" onSubmit={handleSubmit} autoComplete="off">
          <input type="hidden" {...register("intent")} />
          <input type="hidden" {...register("country.id")} />

          <Input
            label="Name"
            variant="ifta"
            {...register("country.name")}
            error={formState.errors.country?.name?.message}
            isValid={
              formState.isDirty &&
              getFieldState("country.name").isDirty &&
              !getFieldState("country.name").invalid
            }
          />

          <Controller
            name="country.regionId"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => {
              // https://github.com/react-hook-form/react-hook-form/issues/4597#issuecomment-1069673930
              return (
                <ComboBox
                  onSelectionChange={(id) =>
                    setValue(field.name, (id as string) || "")
                  }
                  isInvalid={invalid}
                  errorMessage={error && error.message}
                  ariaLabel="Regions"
                  menuTrigger="focus"
                  defaultItems={regions}
                  onBlur={field.onBlur}
                  defaultSelectedKey={
                    regions.find(
                      (region) => region.id === defaultValues.country.regionId,
                    )?.id
                  }
                >
                  {(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
                </ComboBox>
              );
            }}
          />

          <Flex className="mobile gap-5">
            <SubmitButton navigation={navigation} />
            <LinkButton text="Cancel" to={crud.routes.index} secondary />
          </Flex>

          <Flex className="desktop">
            <Flex.End className="hidden sm:flex">
              <LinkButton text="Cancel" to={crud.routes.index} secondary />
              <SubmitButton navigation={navigation} />
            </Flex.End>
          </Flex>
        </Form>
      </BackendPanel>
    </>
  );
}
