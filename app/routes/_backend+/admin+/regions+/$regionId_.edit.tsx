import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "prisma-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import zod from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import { Input } from "#app/components/shared/form/input.tsx";
import { getRegion, updateRegion } from "#app/models/region.server";
import { handle as regionsHandle } from "#app/routes/_backend+/admin+/regions+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { validatePageId } from "#app/utils/validate-page-id";
import {
  RegionSchema,
  RegionSchemaUpdate,
} from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

const intent = "update" as const;

const resolver = zodResolver(RegionSchemaUpdate);

type FormData = zod.infer<typeof RegionSchemaUpdate>;

export const handle = {
  breadcrumb: ({
    data,
  }: {
    data: { defaultValues: { region: { id: string; name: string } } };
  }): BreadcrumbHandle => [
    ...regionsHandle.breadcrumb(),
    {
      name: data.defaultValues.region.name,
      to: `${crud.routes.index}/${data.defaultValues.region.id}`,
    },
    { name: "Edit" },
  ],
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const regionId = validatePageId(params.regionId, RegionSchema);

  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const region = await getRegion({ id: regionId });

  if (!region) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return {
    defaultValues: { region, intent },
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const { data, errors } = await getValidatedFormData<FormData>(
    request,
    resolver,
  );

  if (errors) {
    throw dataWithError({ errors }, "Form data rejected by server", {
      status: 422,
    });
  }

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any",
  });

  try {
    await updateRegion(data.region, userId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return dataWithError(null, `${humanize(crud.singular)} already exists`);
      }

      return dataWithError(null, "Unexpected error");
    }
  }

  return dataWithSuccess(
    null,
    `${humanize(crud.singular)} updated successfully`,
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
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  return (
    <BackendPanel>
      <BackendTitle text={`Edit ${crud.singular}`} foreground />

      <Form method="POST" onSubmit={handleSubmit} autoComplete="off">
        <input type="hidden" {...register("intent")} />
        <input type="hidden" {...register("region.id")} />

        <Input
          label="Name"
          variant="ifta"
          {...register("region.name")}
          error={errors.region?.name?.message}
        />

        <Flex direction="end">
          <Button type="button" text="Close" to={crud.routes.index} secondary />
          <Button
            type="submit"
            text="Save"
            disabled={navigation.state === "submitting"}
          />
        </Flex>
      </Form>
    </BackendPanel>
  );
}
