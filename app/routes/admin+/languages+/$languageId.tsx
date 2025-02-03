import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { LinkButton } from "#app/components/ui/link-button.tsx";
import { Pairs } from "#app/components/ui/pairs.tsx";
import { getLanguage } from "#app/queries/language.server.ts";
import { handle as languagesHandle } from "#app/routes/admin+/languages+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasModelPermission } from "#app/utils/user";
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

  const renderEditButton = userHasModelPermission(user, {
    resource: crud.singular,
    action: "update",
    scope: "any",
  });

  return (
    <BackendPanel>
      <BackendTitle text={humanize(crud.singular)} foreground />

      <Pairs>
        <Pairs.Key>Name</Pairs.Key>
        <Pairs.Value>{language.name}</Pairs.Value>

        <Pairs.Key>Created By</Pairs.Key>
        <Pairs.Value>
          {language.languageCreatedBy.username} at{" "}
          {timeStampToHuman(language.createdAt)}
        </Pairs.Value>

        <Pairs.Key>Updated By</Pairs.Key>
        <Pairs.Value>
          {language.updatedAt !== null && (
            <>
              {language.languageUpdatedBy?.username} at{" "}
              {timeStampToHuman(language.updatedAt)}
            </>
          )}
        </Pairs.Value>
      </Pairs>

      <Flex className="mobile gap-5">
        {renderEditButton && (
          <LinkButton
            text="Edit"
            to={`${crud.routes.index}/${language.id}/edit`}
          />
        )}
        <LinkButton text="Cancel" to={crud.routes.index} secondary />
      </Flex>

      <Flex className="desktop">
        <Flex.End>
          <LinkButton text="Cancel" to={crud.routes.index} secondary />

          {renderEditButton && (
            <LinkButton
              text="Edit"
              to={`${crud.routes.index}/${language.id}/edit`}
            />
          )}
        </Flex.End>
      </Flex>
    </BackendPanel>
  );
}
