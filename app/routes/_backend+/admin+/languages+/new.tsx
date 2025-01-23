import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "prisma-client";
import type { FieldPath } from "react-hook-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import type zod from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Input } from "#app/components/shared/form/input.tsx";
import { LinkButton } from "#app/components/ui/link-button.tsx";
import { SubmitButton } from "#app/components/ui/submit-button.tsx";
import { useFormHelpers } from "#app/hooks/use-form-helpers.ts";
import { createLanguage } from "#app/models/language.server";
import { handle as languagesHandle } from "#app/routes/_backend+/admin+/languages+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { getDefaultValues } from "#app/utils/lib/get-default-values.ts";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { LanguageSchemaCreate } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

const intent = "create" as const;

const resolver = zodResolver(LanguageSchemaCreate);

type FormData = zod.infer<typeof LanguageSchemaCreate>;

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [
    ...languagesHandle.breadcrumb(),
    { name: "New" },
  ],
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  return {
    defaultValues: getDefaultValues(LanguageSchemaCreate, { intent }),
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

  try {
    await createLanguage(data.language, userId);
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
    handleSubmit,
    register,
    getFieldState,
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

          <Input
            label="Name"
            variant="ifta"
            {...register("language.name")}
            error={errors.language?.name?.message}
            onBlur={(e) =>
              setFormFieldValue(
                "language.name" as FieldPath<FormData>,
                e.currentTarget.value,
              )
            }
            checkmark={isValidFormField(getFieldState("language.name"))}
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
