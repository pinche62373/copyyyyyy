import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { jsonWithError, redirectWithSuccess } from "remix-toast";

import { BackendPanel } from "#app/components/backend/panel";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { PairList } from "#app/components/shared/pair-list.tsx";
import { createRegion } from "#app/models/region.server";
import { handle as regionsHandle } from "#app/routes/_backend+/admin+/regions+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { regionSchemaCreate } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

const intent = "create";

const formValidator = withZod(regionSchemaCreate);

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [
    ...regionsHandle.breadcrumb(),
    { name: "New" }
  ]
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  return {
    form: {
      region: {
        name: null as unknown as string
      }
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
    await createRegion(validated.data.region, userId);
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
    `${humanize(crud.singular)} created successfully`
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
    <BackendPanel>
      <BackendPanel.HeaderLeft>
        <BackendTitle text={`New ${crud.singular}`} />
      </BackendPanel.HeaderLeft>

      <BackendPanel.Content>
        <form {...form.getFormProps()} autoComplete="off">
          <InputGeneric
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />

          <PairList>
            <PairList.Pair>
              <PairList.Key className="pt-2.5">Name</PairList.Key>
              <PairList.Value>
                <InputGeneric scope={form.scope("region.name")}></InputGeneric>
              </PairList.Value>
            </PairList.Pair>
          </PairList>

          <FormFooter>
            <Button
              type="button"
              text="Cancel"
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
      </BackendPanel.Content>
    </BackendPanel>
  );
}
