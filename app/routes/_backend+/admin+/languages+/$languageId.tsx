import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { Float } from "#app/components/shared/float.tsx";
import { PairList } from "#app/components/shared/pair-list.tsx";
import { getLanguage } from "#app/models/language.server";
import { handle as languagesHandle } from "#app/routes/_backend+/admin+/languages+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import { validatePageId } from "#app/utils/validate-page-id";
import { LanguageSchema } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

export const handle = {
  breadcrumb: ({
    data,
  }: {
    data: { language: { id: string; name: string } };
  }): BreadcrumbHandle => [
    ...languagesHandle.breadcrumb(),
    { name: data.language.name },
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
    language,
  };
}

export default function Component() {
  const { language } = useLoaderData<typeof loader>();

  const user = useUser();

  return (
    <BackendPanel>
      <BackendTitle text={humanize(crud.singular)} foreground />

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

          {userHasRoutePermission(user, {
            resource: crud.routes.edit,
            scope: "any",
          }) && (
            <div className="order-1 sm:order-2">
              <Button
                type="button"
                text="Edit"
                to={`${crud.routes.index}/${language.id}/edit`}
              />
            </div>
          )}
        </Float.Right>
      </Float>
    </BackendPanel>
  );
}
