import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { BackendPageTitle } from "#app/components/backend/page-title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { Input } from "#app/components/shared/form/input.tsx";
import { ReadOnly } from "#app/components/shared/form/inputs/readonly.tsx";
import { getRegion } from "#app/models/region.server";
import { handle as regionsHandle } from "#app/routes/_backend+/admin+/regions+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import { validatePageId } from "#app/utils/validate-page-id";
import { regionSchema } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

export const handle = {
  breadcrumb: ({
    data
  }: {
    data: { region: { id: string; name: string } };
  }): BreadcrumbHandle => [
    ...regionsHandle.breadcrumb(),
    { name: data.region.name }
  ]
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const regionId = validatePageId(params.regionId, regionSchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const region = await getRegion({ id: regionId });

  if (!region) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return {
    region
  };
}

export default function Component() {
  const { region } = useLoaderData<typeof loader>();

  const user = useUser();

  return (
    <>
      <BackendPageTitle title={`View ${humanize(crud.singular)}`} />

      <BackendContentContainer className="p-6">
        <Input>
          <Input.Label>Name</Input.Label>
          <Input.Field>
            <ReadOnly>{region.name}</ReadOnly>
          </Input.Field>
        </Input>

        <Input>
          <Input.Label>Created By</Input.Label>
          <Input.Field>
            <ReadOnly>
              {region.regionCreatedBy.username} at{" "}
              {timeStampToHuman(region.createdAt)}
            </ReadOnly>
          </Input.Field>
        </Input>

        <Input>
          <Input.Label>Updated By</Input.Label>
          <Input.Field>
            <ReadOnly>
              {region.updatedAt !== null && (
                <>
                  {region.regionupdatedBy?.username} at{" "}
                  {timeStampToHuman(region.updatedAt)}
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
              to={`${crud.routes.index}/${region.id}/edit`}
            />
          )}
        </FormFooter>
      </BackendContentContainer>
    </>
  );
}
