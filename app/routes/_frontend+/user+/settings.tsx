import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigation,
} from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import zod from "zod";
import { FrontendSection } from "#app/components/frontend/section";
import { Button } from "#app/components/shared/button";
import { Float } from "#app/components/shared/float.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { updateUserAccountSettings } from "#app/models/user.server";
import { getUserOrDie, isAuthenticated } from "#app/utils/auth.server";
import { ROUTE_LOGIN } from "#app/utils/constants";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { UserSchemaUpdateAccount } from "#app/validations/user-schema";

const intent = "update" as const;

const resolver = zodResolver(UserSchemaUpdateAccount);

type FormData = zod.infer<typeof UserSchemaUpdateAccount>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  // RR7: replaced with function clone
  await isAuthenticated(request, ROUTE_LOGIN + `?returnTo=${url.pathname}`);

  await requireRoutePermission(request, {
    resource: url.pathname,
    scope: "any",
  });

  return {
    defaultValues: { user: await getUserOrDie(request), intent },
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
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
    resource: "user",
    action: intent,
    scope: "own",
    resourceId: data.user.id,
  });

  try {
    await updateUserAccountSettings(data.user);
  } catch {
    return dataWithError(data, "Server error while saving your data");
  }

  return dataWithSuccess(
    {
      defaultValues: data,
    },
    `Your settings have been updated.`,
  );
};

export default function SettingsIndexPage() {
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
    <FrontendSection>
      {/* Profile Container */}
      <div className="space-y-5 border-t border-gray-200 py-6 first:border-t-0 sm:py-8 dark:border-neutral-700">
        {/* Profile Header */}
        <h2 className="font-semibold text-gray-800 dark:text-neutral-200">
          Profile
        </h2>

        <Form method="POST" onSubmit={handleSubmit} autoComplete="off">
          <input type="hidden" {...register("intent")} />
          <input type="hidden" {...register("user.id")} />

          <Input
            label="Username"
            variant="ifta"
            {...register("user.username")}
            error={errors.user?.username?.message}
          />

          <Float direction="end">
            <Button type="button" text="Reset form" secondary />
            <Button
              type="submit"
              text="Save"
              disabled={navigation.state === "submitting"}
            />
          </Float>
        </Form>
      </div>
      {/* End Profile Container */}
    </FrontendSection>
  );
}
