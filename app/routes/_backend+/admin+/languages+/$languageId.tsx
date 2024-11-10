import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { BackendPanel } from "#app/components/backend/panel";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { PairList } from "#app/components/shared/pair-list.tsx";
import { getLanguage } from "#app/models/language.server";
import { handle as languagesHandle } from "#app/routes/_backend+/admin+/languages+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import { validatePageId } from "#app/utils/validate-page-id";
import { languageSchema } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

export const handle = {
  breadcrumb: ({
    data
  }: {
    data: { language: { id: string; name: string } };
  }): BreadcrumbHandle => [
    ...languagesHandle.breadcrumb(),
    { name: data.language.name }
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
    language
  };
}

export default function Component() {
  const { language } = useLoaderData<typeof loader>();

  const user = useUser();

  return (
    <BackendPanel>
      <BackendPanel.HeaderLeft>
        <BackendTitle text={`View ${humanize(crud.singular)}`} />
      </BackendPanel.HeaderLeft>

      <BackendPanel.Content>
        <PairList>
          <PairList.Pair>
            <PairList.Key>Name</PairList.Key>
            <PairList.Value>{language.name}</PairList.Value>
          </PairList.Pair>

          <PairList.Pair>
          <PairList.Key>Created By</PairList.Key>
          <PairList.Value>
            {language.languageCreatedBy.username} at{" "}
            {timeStampToHuman(language.createdAt)}
          </PairList.Value>
          </PairList.Pair>

          <PairList.Pair>
          <PairList.Key>Updated By</PairList.Key>
          <PairList.Value>
            {language.updatedAt !== null && (
              <>
                {language.languageUpdatedBy?.username} at{" "}
                {timeStampToHuman(language.updatedAt)}
              </>
            )}
          </PairList.Value>
          </PairList.Pair>
        </PairList>

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

      </BackendPanel.Content>
    </BackendPanel>
  );
}
