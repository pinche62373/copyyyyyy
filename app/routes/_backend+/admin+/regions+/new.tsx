import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { jsonWithError, redirectWithSuccess } from "remix-toast";
import zod from "zod";
import { BackendPanel2 } from "#app/components/backend/panel2";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { Float } from "#app/components/shared/float.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { createRegion } from "#app/models/region.server";
import { handle as regionsHandle } from "#app/routes/_backend+/admin+/regions+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { getDefaultValues } from "#app/utils/lib/get-default-values.ts";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { regionSchemaCreate } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

const intent = "create" as const;

const resolver = zodResolver(regionSchemaCreate);

type FormData = zod.infer<typeof regionSchemaCreate>;

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [
    ...regionsHandle.breadcrumb(),
    { name: "New" },
  ],
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  return {
    defaultValues: getDefaultValues(regionSchemaCreate, { intent }),
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const { data, errors } = await getValidatedFormData<FormData>(
    request,
    resolver,
  );

  if (errors) {
    return jsonWithError({ errors }, "Form data rejected by server", {
      status: 422,
    });
  }

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any",
  });

  try {
    await createRegion(data.region, userId);
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
    `${humanize(crud.singular)} created successfully`,
  );
};

export default function Component() {
  const { defaultValues } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRemixForm<FormData>({
    mode: "onBlur",
    resolver,
    defaultValues,
  });

  return (
    <>
      <BackendPanel2>
        <BackendTitle text={`New ${crud.singular}`} foreground />

        <Form method="POST" onSubmit={handleSubmit} autoComplete="off">
          <input type="hidden" {...register("intent")} />

          <Input
            label="Name"
            variant="ifta"
            {...register("region.name")}
            error={errors.region?.name?.message}
          />

          <Float direction="end">
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
          </Float>
        </Form>
      </BackendPanel2>
    </>
  );
}
