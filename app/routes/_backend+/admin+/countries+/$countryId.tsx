import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { BackendPanel } from "#app/components/backend/panel";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { PairList } from "#app/components/shared/pair-list.tsx";
import { getCountry } from "#app/models/country.server";
import { handle as countriesHandle } from "#app/routes/_backend+/admin+/countries+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import { validatePageId } from "#app/utils/validate-page-id";
import { countrySchema } from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

export const handle = {
  breadcrumb: ({
    data,
  }: {
    data: { country: { id: string; name: string } };
  }): BreadcrumbHandle => [
    ...countriesHandle.breadcrumb(),
    { name: data.country.name },
  ],
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const countryId = validatePageId(params.countryId, countrySchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const country = await getCountry({ id: countryId });

  if (!country) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return {
    country,
  };
}

export default function Component() {
  const { country } = useLoaderData<typeof loader>();

  const user = useUser();

  return (
    <BackendPanel>
      <BackendPanel.Row>
        <BackendTitle text={humanize(crud.singular)} foreground />
      </BackendPanel.Row>

      <BackendPanel.Row last>
        <PairList>
          <PairList.Pair>
            <PairList.Key>Name</PairList.Key>
            <PairList.Value>{country.name}</PairList.Value>
          </PairList.Pair>

          <PairList.Pair>
            <PairList.Key>Region</PairList.Key>
            <PairList.Value>{country.region.name}</PairList.Value>
          </PairList.Pair>

          <PairList.Pair>
            <PairList.Key>Created By</PairList.Key>
            <PairList.Value>
              {country.countryCreatedBy.username} at{" "}
              {timeStampToHuman(country.createdAt)}
            </PairList.Value>
          </PairList.Pair>

          <PairList.Pair>
            <PairList.Key>Updated By</PairList.Key>
            <PairList.Value>
              {country.updatedAt !== null && (
                <>
                  {country.countryUpdatedBy?.username} at{" "}
                  {timeStampToHuman(country.updatedAt)}
                </>
              )}
            </PairList.Value>
          </PairList.Pair>
        </PairList>
      </BackendPanel.Row>

      <BackendPanel.Row last>
        <BackendPanel.Right>
          <Button
            type="button"
            text="Close"
            to={crud.routes.index}
            className="mr-2"
            secondary
          />

          {userHasRoutePermission(user, {
            resource: crud.routes.edit,
            scope: "any",
          }) && (
            <Button
              type="button"
              text="Edit"
              to={`${crud.routes.index}/${country.id}/edit`}
            />
          )}
        </BackendPanel.Right>
      </BackendPanel.Row>
    </BackendPanel>
  );
}
