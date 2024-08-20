import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { FormInputTextReadOnly } from "#app/components/backend/form/form-input-text-readonly";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { getCountry } from "#app/models/country.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize, timeStampToHuman, validatePageId } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { countrySchemaFull } from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const countryId = validatePageId(params.countryId, countrySchemaFull);

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
          scope: "any",
        }}
      />

      <BackendContentContainer className="p-6">
        <FormInputTextReadOnly label="Name">
          {country.name}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Region">
          {country.region.name}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Created By">
          {country.countryCreatedBy.username} at{" "}
          {timeStampToHuman(country.createdAt)}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Updated By">
          {country.updatedAt !== null && (
            <>
              {country.countryUpdatedBy?.username} at{" "}
              {timeStampToHuman(country.updatedAt)}
            </>
          )}
        </FormInputTextReadOnly>
      </BackendContentContainer>
    </>
  );
}
