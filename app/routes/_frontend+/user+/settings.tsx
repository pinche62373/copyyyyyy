import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldPath } from "react-hook-form";
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
import { Input } from "#app/components/shared/form/input.tsx";
import { SubmitButton } from "#app/components/ui/submit-button.tsx";
import { useFormHelpers } from "#app/hooks/use-form-helpers.ts";
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

  const form = useRemixForm<FormData>({
    mode: "onBlur",
    resolver,
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    getFieldState,
    formState: { errors },
  } = form;

  // @ts-ignore: awaits remix-hook-form fix for type `UseRemixFormReturn`
  const { setFormFieldValue, isValidFormField } = useFormHelpers(form);

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
            onBlur={(e) =>
              setFormFieldValue(
                "user.username" as FieldPath<FormData>,
                e.currentTarget.value,
              )
            }
            isValid={isValidFormField(getFieldState("user.username"))}
          />

          <SubmitButton disabled={navigation.state === "submitting"} />
        </Form>
      </div>
      {/* End Profile Container */}
    </FrontendSection>
  );
}
