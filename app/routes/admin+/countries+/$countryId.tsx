import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputTextReadOnly } from "#app/components/admin/form/form-input-text-readonly";
import { getCountry } from "#app/models/country.server";
import { getCrud } from "#app/utils/crud";
import { timeStampToHuman } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";

const { crudCountry: crud } = getCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/view`);

  const countryId = z.coerce.string().parse(params.countryId);
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
      <AdminPageTitle title={`View ${crud.singular}`} />

      <AdminContentCard className="p-6">
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

        <FormFooter>
          <Button type="button" text="Close" to={crud.index} />
        </FormFooter>
      </AdminContentCard>
    </>
  );
}
