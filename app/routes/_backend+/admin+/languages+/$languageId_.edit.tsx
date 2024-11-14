import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { BackendPanel } from "#app/components/backend/panel";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { PairList } from "#app/components/shared/pair-list.tsx";
import { getLanguage, updateLanguage } from "#app/models/language.server";
import { handle as languagesHandle } from "#app/routes/_backend+/admin+/languages+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { validatePageId } from "#app/utils/validate-page-id";
import {
  languageSchema,
  languageSchemaUpdate
} from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

const intent = "update";

const formValidator = withZod(languageSchemaUpdate);

export const handle = {
  breadcrumb: ({
    data
  }: {
    data: { form: { language: { id: string; name: string } } };
  }): BreadcrumbHandle => [
    ...languagesHandle.breadcrumb(),
    {
      name: data.form.language.name,
      to: `${crud.routes.index}/${data.form.language.id}`
    },
    { name: "Edit" }
  ]
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const languageId = validatePageId(params.languageId, languageSchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const language = await getLanguage({ id: languageId });

  if (!language) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return {
    form: {
      language
    }
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

  try {
    await updateLanguage(validated.data.language, userId);
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
    <BackendPanel>
      <BackendPanel.Row>
        <BackendTitle text={`Edit ${humanize(crud.singular)}`} foreground />
      </BackendPanel.Row>

      <BackendPanel.Row last>
        <form {...form.getFormProps()} autoComplete="off">
          <InputGeneric
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />
          <InputGeneric scope={form.scope("language.id")} type="hidden" />

          <PairList>
            <PairList.Pair>
              <PairList.Key>Name</PairList.Key>
              <PairList.Value>
                <InputGeneric scope={form.scope("language.name")} />
              </PairList.Value>
            </PairList.Pair>
          </PairList>
        </form>
      </BackendPanel.Row>

      <BackendPanel.Row last>
        <BackendPanel.Right>
          <Button
            type="button"
            text="Close"
            to={crud.routes.index}
            className="mr-2"
            secondary
          />
          <Button
            type="submit"
            form={form.formOptions.formId}
            text="Save"
            disabled={navigation.state === "submitting"}
          />
        </BackendPanel.Right>
      </BackendPanel.Row>
    </BackendPanel>
  );
}
