import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { FormInputTextReadOnly } from "#app/components/backend/form/form-input-text-readonly";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { getRegion } from "#app/models/region.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { validatePageId } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { regionSchemaFull } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

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
      <BackendPageTitle
        title={`View ${humanize(crud.singular)}`}
        button={{
          title: "Edit",
          to: `${crud.routes.index}/${region.id}/edit`,
          scope: "any",
        }}
      />

      <BackendContentContainer className="p-6">
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
      </BackendContentContainer>
    </>
  );
}
