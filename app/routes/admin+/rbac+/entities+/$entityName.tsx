import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputTextReadOnly } from "#app/components/admin/form/form-input-text-readonly";
import { getPermission } from "#app/models/permission.server";
import { getCrud } from "#app/utils/crud";
import { requireRoutePermission } from "#app/utils/permissions.server";

const { crudEntity: crud } = getCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/view`);

  const entityName = z.coerce.string().parse(params.entityName);
  console.log(`Lookup entity: ${entityName}`)

  const permission = await getPermission({ id: permissionId });

  if (!permission) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return json({ permission });
}

export default function Component() {
  const { permission } = useLoaderData<typeof loader>();

  return (
    <>
      <AdminPageTitle title={`View ${crud.singular}`} />

      <AdminContentCard className="p-6">
        <FormInputTextReadOnly label="Entity">
          {permission.entity}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Action">
          {permission.action}
        </FormInputTextReadOnly>

        <FormInputTextReadOnly label="Scope">
          {permission.scope}
        </FormInputTextReadOnly>

        {permission.description && (
          <FormInputTextReadOnly label="Description">
            {permission.description}
          </FormInputTextReadOnly>
        )}

        <FormInputTextReadOnly label="Roles">
          <ul>
            {permission.roles.map((role, i) => (
              <li key={i}>{role.name.toUpperCase()}</li>
            ))}
          </ul>
        </FormInputTextReadOnly>

        <FormFooter>
          <Button type="button" text="Close" to={crud.index} />
        </FormFooter>
      </AdminContentCard>
    </>
  );
}
