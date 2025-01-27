import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "prisma-client";
import { useEffect } from "react";
import type { FieldPath } from "react-hook-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import type zod from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Input } from "#app/components/shared/form/input.tsx";
import { LinkButton } from "#app/components/ui/link-button.tsx";
import { SubmitButton } from "#app/components/ui/submit-button.tsx";
import { useFormHelpers } from "#app/hooks/use-form-helpers.ts";
import { getLanguage, updateLanguage } from "#app/queries/language.server.ts";
import { handle as languagesHandle } from "#app/routes/_backend+/admin+/languages+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { validatePageId } from "#app/utils/validate-page-id";
import {
  LanguageSchema,
  LanguageSchemaUpdate,
} from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

const intent = "update" as const;

const resolver = zodResolver(LanguageSchemaUpdate);

type FormData = zod.infer<typeof LanguageSchemaUpdate>;

export const handle = {
  breadcrumb: ({
    data,
  }: {
    data: { defaultValues: { language: { id: string; name: string } } };
  }): BreadcrumbHandle => [
    ...languagesHandle.breadcrumb(),
    {
      name: data.defaultValues.language.name,
      to: `${crud.routes.index}/${data.defaultValues.language.id}`,
    },
    { name: "Edit" },
  ],
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const languageId = validatePageId(params.languageId, LanguageSchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const language = await getLanguage({ id: languageId });

  if (!language) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return {
    defaultValues: { language, intent },
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

  try {
    await updateLanguage(data.language, userId);
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
  const { defaultValues } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const form = useRemixForm<FormData>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver,
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    getFieldState,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = form;

  // @ts-ignore: awaits remix-hook-form fix for type `UseRemixFormReturn`
  const { setFormFieldValue, isValidFormField } = useFormHelpers(form);

  // Reset form after successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultValues);
    }
  }, [isSubmitSuccessful, reset, defaultValues]);

  return (
    <>
      <BackendPanel>
        <BackendTitle text={`Edit ${crud.singular}`} foreground />

        <Form method="POST" onSubmit={handleSubmit} autoComplete="off">
          <input type="hidden" {...register("intent")} />
          <input type="hidden" {...register("language.id")} />

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
            <Flex.End className="hidden sm:flex">
              <LinkButton text="Cancel" to={crud.routes.index} secondary />
              <SubmitButton disabled={navigation.state === "submitting"} />
            </Flex.End>
          </Flex>
        </Form>
      </BackendPanel>
    </>
  );
}
