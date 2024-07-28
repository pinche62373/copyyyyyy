import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { FormInputTextReadOnly } from "#app/components/admin/form/form-input-text-readonly";
import { getLanguage } from "#app/models/language.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { timeStampToHuman, validatePageId } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { languageSchemaFull } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    entity: crud.routes.view,
    scope: "any",
  });

  const languageId = validatePageId(params.languageId, languageSchemaFull);

  const language = await getLanguage({ id: languageId });

  if (!language) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return { language };
}

export default function Component() {
  const { language } = useLoaderData<typeof loader>();

  return (
    <>
      <AdminPageTitle title={`View ${crud.singular}`} />

      <AdminContentCard className="p-6">
        <FormInputTextReadOnly label="Name">
          {language.name}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Created By">
          {language.languageCreatedBy.username} at{" "}
          {timeStampToHuman(language.createdAt)}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Updated By">
          {language.updatedAt !== null && (
            <>
              {language.languageUpdatedBy?.username} at{" "}
              {timeStampToHuman(language.updatedAt)}
            </>
          )}
        </FormInputTextReadOnly>
      </AdminContentCard>
    </>
  );
}
