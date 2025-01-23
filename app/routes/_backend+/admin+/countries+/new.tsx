import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "prisma-client";
import type { FieldPath } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router";
import {
  Form,
  type LoaderFunctionArgs,
  useLoaderData,
  useNavigation,
} from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import type zod from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { ComboBoxItem } from "#app/components/shared/form/combobox-item.tsx";
import { ComboBox } from "#app/components/shared/form/combobox.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { LinkButton } from "#app/components/ui/link-button.tsx";
import { SubmitButton } from "#app/components/ui/submit-button.tsx";
import { useFormHelpers } from "#app/hooks/use-form-helpers.ts";
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
import { CountrySchemaCreate } from "#app/validations/country-schema";

// https://stackoverflow.com/questions/76222652/how-to-use-register-from-react-hook-forms-with-headless-ui-combobox

const { countryCrud: crud } = getAdminCrud();

const intent = "create" as const;

const resolver = zodResolver(CountrySchemaCreate);

type FormData = zod.infer<typeof CountrySchemaCreate>;

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
      ...getDefaultValues(CountrySchemaCreate),
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
    return dataWithError({ errors }, "Form data rejected by server", {
      // status: 422, // TODO re-enable when remix-toast fixes this
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
    await createCountry(data.country, userId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return dataWithError(null, `${humanize(crud.singular)} already exists`);
      }

      return dataWithError(null, "Unexpected error");
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

  const form = useRemixForm<FormData>({
    mode: "onBlur",
    resolver,
    defaultValues,
  });

  const {
    register,
    control,
    getFieldState,
    handleSubmit,
    formState: { errors },
  } = form;

  // @ts-ignore: awaits remix-hook-form fix for type `UseRemixFormReturn`
  const { setFormFieldValue, isValidFormField } = useFormHelpers(form);

  return (
    <>
      <BackendPanel>
        <BackendTitle text={`New ${crud.singular}`} foreground />

        <Form method="POST" onSubmit={handleSubmit} autoComplete="off">
          <input type="hidden" {...register("intent")} />
          <input type="hidden" {...register("country.regionId")} />

          <Input
            label="Name"
            variant="ifta"
            {...register("country.name")}
            optional={CountrySchemaCreate.shape.country.shape.name.isOptional()}
            error={errors.country?.name?.message}
            onBlur={(e) =>
              setFormFieldValue(
                "country.name" as FieldPath<FormData>,
                e.currentTarget.value,
              )
            }
            checkmark={isValidFormField(getFieldState("country.name"))}
          />

          <Controller
            name="country.regionId"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => {
              return (
                <ComboBox
                  onSelectionChange={(id) =>
                    setFormFieldValue(
                      "country.regionId" as FieldPath<FormData>,
                      (id as string) || "",
                    )
                  }
                  optional={CountrySchemaCreate.shape.country.shape.regionId.isOptional()}
                  isInvalid={invalid}
                  checkmark={isValidFormField(
                    getFieldState("country.regionId"),
                  )}
                  errorMessage={error && error.message}
                  label="Region"
                  menuTrigger="focus"
                  onBlur={field.onBlur}
                  defaultItems={defaultValues.regions}
                >
                  {(item) => <ComboBoxItem>{item.name}</ComboBoxItem>}
                </ComboBox>
              );
            }}
          />

          <Flex className="mobile gap-5">
            <SubmitButton disabled={navigation.state === "submitting"} />
            <LinkButton text="Cancel" to={crud.routes.index} secondary />
          </Flex>

          <Flex className="desktop">
            <Flex.End>
              <LinkButton text="Cancel" to={crud.routes.index} secondary />
              <SubmitButton disabled={navigation.state === "submitting"} />
            </Flex.End>
          </Flex>
        </Form>
      </BackendPanel>
    </>
  );
}
