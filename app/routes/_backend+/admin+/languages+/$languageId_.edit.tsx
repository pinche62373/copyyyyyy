import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "prisma-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import zod from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { Float } from "#app/components/shared/float.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { getLanguage, updateLanguage } from "#app/models/language.server";
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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

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
            autoFocus
            {...register("language.name")}
            error={errors.language?.name?.message}
          />

          <Float>
            <Float.Right>
              <div className="order-2 sm:order-1">
                <Button
                  type="button"
                  text="Close"
                  to={crud.routes.index}
                  secondary
                />
              </div>

              <div className="order-1 sm:order-2">
                <Button
                  type="submit"
                  text="Save"
                  disabled={navigation.state === "submitting"}
                />
              </div>
            </Float.Right>
          </Float>
        </Form>
      </BackendPanel>
    </>
  );
}
