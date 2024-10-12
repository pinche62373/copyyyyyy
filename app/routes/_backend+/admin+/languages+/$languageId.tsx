import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { FormInputTextReadOnly } from "#app/components/backend/form/form-input-text-readonly";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { getLanguage } from "#app/models/language.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { validatePageId } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { languageSchemaFull } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
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
      <BackendPageTitle
        title={`View ${humanize(crud.singular)}`}
        button={{
          title: "Edit",
          to: `${crud.routes.index}/${language.id}/edit`,
          scope: "any"
        }}
      />

      <BackendContentContainer className="p-6">
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
      </BackendContentContainer>
    </>
  );
}
