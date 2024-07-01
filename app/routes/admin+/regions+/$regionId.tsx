import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { FormInputTextReadOnly } from "#app/components/admin/form/form-input-text-readonly";
import { getRegion } from "#app/models/region.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { timeStampToHuman, validatePageId } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { regionSchemaFull } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, crud.routes.view);

  const regionId = validatePageId(params.regionId, regionSchemaFull);

  const region = await getRegion({ id: regionId });

  if (!region) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return { region };
}

export default function Component() {
  const { region } = useLoaderData<typeof loader>();

  return (
    <>
      <AdminPageTitle title={`View ${crud.singular}`} />

      <AdminContentCard className="p-6">
        <FormInputTextReadOnly label="Name">
          {region.name}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Created By">
          {region.regionCreatedBy.username} at{" "}
          {timeStampToHuman(region.createdAt)}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Updated By">
          {region.updatedAt !== null && (
            <>
              {region.regionupdatedBy?.username} at{" "}
              {timeStampToHuman(region.updatedAt)}
            </>
          )}
        </FormInputTextReadOnly>
      </AdminContentCard>
    </>
  );
}
