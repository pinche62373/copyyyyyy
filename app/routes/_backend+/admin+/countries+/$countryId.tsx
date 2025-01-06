import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { LinkButton } from "#app/components/ui/link-button.tsx";
import { Pairs } from "#app/components/ui/pairs.tsx";
import { getCountry } from "#app/models/country.server";
import { handle as countriesHandle } from "#app/routes/_backend+/admin+/countries+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { humanize } from "#app/utils/lib/humanize";
import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import { validatePageId } from "#app/utils/validate-page-id";
import { CountrySchema } from "#app/validations/country-schema";

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
  const countryId = validatePageId(params.countryId, CountrySchema);

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

  const userHasEditPermission = userHasRoutePermission(user, {
    resource: crud.routes.edit,
    scope: "any",
  });

  return (
    <BackendPanel>
      <BackendTitle text={humanize(crud.singular)} foreground />

      <Pairs>
        <Pairs.Key>Name</Pairs.Key>
        <Pairs.Value>{country.name}</Pairs.Value>

        <Pairs.Key>Region</Pairs.Key>
        <Pairs.Value>{country.region.name}</Pairs.Value>

        <Pairs.Key>Created By</Pairs.Key>
        <Pairs.Value>
          {country.countryCreatedBy.username} at{" "}
          {timeStampToHuman(country.createdAt)}
        </Pairs.Value>

        <Pairs.Key>Updated By</Pairs.Key>
        <Pairs.Value>
          {country.updatedAt !== null && (
            <>
              {country.countryUpdatedBy?.username} at{" "}
              {timeStampToHuman(country.updatedAt)}
            </>
          )}
        </Pairs.Value>
      </Pairs>

      <Flex className="mobile gap-5">
        {userHasEditPermission && (
          <LinkButton
            text="Edit"
            to={`${crud.routes.index}/${country.id}/edit`}
          />
        )}
        <LinkButton text="Cancel" to={crud.routes.index} secondary />
      </Flex>

      <Flex className="desktop">
        <Flex.End>
          <LinkButton text="Cancel" to={crud.routes.index} secondary />

          {userHasEditPermission && (
            <LinkButton
              text="Edit"
              to={`${crud.routes.index}/${country.id}/edit`}
            />
          )}
        </Flex.End>
      </Flex>
    </BackendPanel>
  );
}
