import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { Input } from "#app/components/shared/form/input.tsx";
import { ReadOnly } from "#app/components/shared/form/inputs/readonly.tsx";
import { getCountry } from "#app/models/country.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { validatePageId } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { countrySchema } from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const countryId = validatePageId(params.countryId, countrySchema);

  const country = await getCountry({ id: countryId });

  if (!country) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return { country };
}

export default function Component() {
  const { country } = useLoaderData<typeof loader>();

  return (
    <>
      <BackendPageTitle
        title={`View ${humanize(crud.singular)}`}
        button={{
          title: "Edit",
          to: `${crud.routes.index}/${country.id}/edit`,
          scope: "any"
        }}
      />

      <BackendContentContainer className="p-6">
        <Input>
          <Input.Label>Name</Input.Label>
          <Input.Field>
            <ReadOnly>{country.name}</ReadOnly>
          </Input.Field>
        </Input>

        <Input>
          <Input.Label>Region</Input.Label>
          <Input.Field>
            <ReadOnly>{country.region.name}</ReadOnly>
          </Input.Field>
        </Input>

        <Input>
          <Input.Label>Created By</Input.Label>
          <Input.Field>
            <ReadOnly>
              {country.countryCreatedBy.username} at {" "}
              {timeStampToHuman(country.createdAt)}
            </ReadOnly>
          </Input.Field>
        </Input>

        <Input>
          <Input.Label>Updated By</Input.Label>
          <Input.Field>
            <ReadOnly>
              {country.updatedAt !== null && (
                <>
                  {country.countryUpdatedBy?.username} at{" "}
                  {timeStampToHuman(country.updatedAt)}
                </>
              )}
            </ReadOnly>
          </Input.Field>
        </Input>
      </BackendContentContainer>
    </>
  );
}
