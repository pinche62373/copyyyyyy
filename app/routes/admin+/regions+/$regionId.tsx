import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputTextReadOnly } from "#app/components/admin/form/form-input-text-readonly";
import { getRegion } from "#app/models/region.server";
import { getCrud } from "#app/utils/crud";
import { timeStampToHuman } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { regionSchemaFull } from "#app/validations/region-schema";

const { crudRegion: crud } = getCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/view`);

  const regionId = regionSchemaFull
    .pick({ id: true })
    .parse({ id: params.regionId }).id;

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

        <FormFooter>
          <Button type="button" text="Close" to={crud.index} />
        </FormFooter>
      </AdminContentCard>
    </>
  );
}
