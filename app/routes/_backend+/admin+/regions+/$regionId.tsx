import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { Float } from "#app/components/shared/float.tsx";
import { PairList } from "#app/components/shared/pair-list.tsx";
import { getRegion } from "#app/models/region.server";
import { handle as regionsHandle } from "#app/routes/_backend+/admin+/regions+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import { validatePageId } from "#app/utils/validate-page-id";
import { RegionSchema } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

export const handle = {
  breadcrumb: ({
    data,
  }: {
    data: { region: { id: string; name: string } };
  }): BreadcrumbHandle => [
    ...regionsHandle.breadcrumb(),
    { name: data.region.name },
  ],
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const regionId = validatePageId(params.regionId, RegionSchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const region = await getRegion({ id: regionId });

  if (!region) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return {
    region,
  };
}

export default function Component() {
  const { region } = useLoaderData<typeof loader>();

  const user = useUser();

  return (
    <BackendPanel>
      <BackendTitle text={humanize(crud.singular)} foreground />

      <PairList>
        <PairList.Pair>
          <PairList.Key>Name</PairList.Key>
          <PairList.Value>{region.name}</PairList.Value>
        </PairList.Pair>

        <PairList.Pair>
          <PairList.Key>Created By</PairList.Key>
          <PairList.Value>
            {region.regionCreatedBy.username} at{" "}
            {timeStampToHuman(region.createdAt)}
          </PairList.Value>
        </PairList.Pair>

        <PairList.Pair>
          <PairList.Key>Updated By</PairList.Key>
          <PairList.Value>
            {region.updatedAt !== null && (
              <>
                {region.regionupdatedBy?.username} at{" "}
                {timeStampToHuman(region.updatedAt)}
              </>
            )}
          </PairList.Value>
        </PairList.Pair>
      </PairList>

      <Float direction="end">
        <Button
          type="button"
          text="Close"
          className="mr-2"
          to={crud.routes.index}
          secondary
        />

        {userHasRoutePermission(user, {
          resource: crud.routes.edit,
          scope: "any",
        }) && (
          <Button
            type="button"
            text="Edit"
            to={`${crud.routes.index}/${region.id}/edit`}
          />
        )}
      </Float>
    </BackendPanel>
  );
}
