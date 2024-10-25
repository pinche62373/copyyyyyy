import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
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
import { createLanguage } from "#app/models/language.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { languageSchemaCreate } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

const intent = "create";

const validator = withZod(languageSchemaCreate);

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  return {
    language: {
      name: null as unknown as string
    }
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const validated = await validator.validate(await request.formData());

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
    await createLanguage(validated.data.language, userId);
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
    validator,
    defaultValues: { intent, ...loaderData }
  });

  return (
    <>
      <BackendPageTitle title={`New ${crud.singular}`} />

      <BackendContentContainer className="p-5">
        <form {...form.getFormProps()}>
          <InputGeneric scope={form.scope("intent")} type="hidden" />

          {/* language.name */}
          <Input>
            <Input.Label>Name</Input.Label>
            <Input.Field>
              <InputGeneric scope={form.scope("language.name")}></InputGeneric>
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
