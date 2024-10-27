import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { Input } from "#app/components/shared/form/input.tsx";
import { ReadOnly } from "#app/components/shared/form/inputs/readonly.tsx";
import { getLanguage } from "#app/models/language.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import { validatePageId } from "#app/utils/validate-page-id";
import { languageSchema } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

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

  return { language };
}

export default function Component() {
  const { language } = useLoaderData<typeof loader>();

  const user = useUser();

  return (
    <>
      <BackendPageTitle title={`View ${humanize(crud.singular)}`} />

      <BackendContentContainer className="p-6">
        <Input>
          <Input.Label>Name</Input.Label>
          <Input.Field>
            <ReadOnly>{language.name}</ReadOnly>
          </Input.Field>
        </Input>

        <Input>
          <Input.Label>Created By</Input.Label>
          <Input.Field>
            <ReadOnly>
              {language.languageCreatedBy.username} at{" "}
              {timeStampToHuman(language.createdAt)}
            </ReadOnly>
          </Input.Field>
        </Input>

        <Input>
          <Input.Label>Updated By</Input.Label>
          <Input.Field>
            <ReadOnly>
              {language.updatedAt !== null && (
                <>
                  {language.languageUpdatedBy?.username} at{" "}
                  {timeStampToHuman(language.updatedAt)}
                </>
              )}
            </ReadOnly>
          </Input.Field>
        </Input>

        <FormFooter>
          <Button type="button" text="Close" to={crud.routes.index} secondary />

          {userHasRoutePermission(user, {
            resource: crud.routes.edit,
            scope: "any"
          }) && (
            <Button
              type="button"
              text="Edit"
              to={`${crud.routes.index}/${language.id}/edit`}
            />
          )}
        </FormFooter>
      </BackendContentContainer>
    </>
  );
}
