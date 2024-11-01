import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { BackendPageTitle } from "#app/components/backend/page-title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { Input } from "#app/components/shared/form/input";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { getRegion, updateRegion } from "#app/models/region.server";
import { handle as regionsHandle } from "#app/routes/_backend+/admin+/regions+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { validatePageId } from "#app/utils/validate-page-id";
import {
  regionSchema,
  regionSchemaUpdate
} from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

const intent = "update";

const formValidator = withZod(regionSchemaUpdate);

export const handle = {
  breadcrumb: ({
    data
  }: {
    data: { form: { region: { id: string; name: string } } };
  }): BreadcrumbHandle => [
    ...regionsHandle.breadcrumb(),
    {
      name: data.form.region.name,
      to: `${crud.routes.index}/${data.form.region.id}`
    },
    { name: "Edit" }
  ]
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const regionId = validatePageId(params.regionId, regionSchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const region = await getRegion({ id: regionId });

  if (!region) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return {
    form: {
      region
    }
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const validated = await formValidator.validate(await request.formData());

  if (validated.error)
    return jsonWithError(validated.error, "Form data rejected by server", {
      status: 422
    });

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any"
  });

  try {
    await updateRegion(validated.data.region, userId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return jsonWithError(null, `${humanize(crud.singular)} already exists`);
      }

      return jsonWithError(null, "Unexpected error");
    }
  }

  return redirectWithSuccess(
    crud.routes.index,
    `${humanize(crud.singular)} updated successfully`
  );
};

export default function Component() {
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const form = useForm({
    method: "post",
    validator: formValidator,
    defaultValues: { intent, ...loaderData.form }
  });

  return (
    <>
      <BackendPageTitle title={`Edit ${humanize(crud.singular)}`} />

      <BackendContentContainer className="p-6">
        <form {...form.getFormProps()} autoComplete="off">
          <InputGeneric
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />
          <InputGeneric scope={form.scope("region.id")} type="hidden" />

          {/* region.name */}
          <Input>
            <Input.Label>Name</Input.Label>
            <Input.Field>
              <InputGeneric scope={form.scope("region.name")}></InputGeneric>
            </Input.Field>
          </Input>

          <FormFooter>
            <Button
              type="button"
              text="Close"
              to={crud.routes.index}
              secondary
            />
            <Button
              type="submit"
              text="Save"
              disabled={navigation.state === "submitting"}
            />
          </FormFooter>
        </form>
      </BackendContentContainer>
    </>
  );
}
