import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { FrontendSection } from "#app/components/frontend/section";
import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { updateUserAccountSettings } from "#app/models/user.server";
import { authenticator, getUserOrDie } from "#app/utils/auth.server";
import { AUTH_LOGIN_ROUTE } from "#app/utils/constants";
import { isValidationErrorResponse } from "#app/utils/lib/is-validation-error-response";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { userSchemaUpdateAccount } from "#app/validations/user-schema";

const intent = "update";

const validator = withZod(userSchemaUpdateAccount);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  await authenticator.isAuthenticated(request, {
    failureRedirect: AUTH_LOGIN_ROUTE + `?returnTo=${url.pathname}`
  });

  await requireRoutePermission(request, {
    resource: url.pathname,
    scope: "any"
  });

  return {
    intent,
    user: await getUserOrDie(request)
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const validated = await validator.validate(await request.formData());

  if (validated.error)
    return jsonWithError(validated.error, "Form data rejected by server", {
      status: 422
    });

  await requireModelPermission(request, {
    resource: "user",
    action: intent,
    scope: "own",
    resourceId: validated.data.user.id
  });

  try {
    await updateUserAccountSettings(validated.data.user);
  } catch {
    return jsonWithError(validated.data, "Server error while saving your data");
  }

  return jsonWithSuccess(validated.data, `Settings updated successfully`);
};

export default function SettingsIndexPage() {
  const loaderData = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const form = useForm({
    method: "POST",
    validator,
    defaultValues: loaderData,
    onSubmitSuccess: async () => {
      if (!isValidationErrorResponse(actionData)) {
        form.resetForm(actionData);
      }
    }
  });

  return (
    <FrontendSection>
      {/* Profile Container */}
      <div className="space-y-5 border-t border-gray-200 py-6 first:border-t-0 sm:py-8 dark:border-neutral-700">
        {/* Profile Header */}
        <h2 className="font-semibold text-gray-800 dark:text-neutral-200">
          Profile
        </h2>

        {/* Profile Form */}
        <form {...form.getFormProps()}>
          <InputGeneric
            name="intent"
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />

          <InputGeneric
            name="id"
            scope={form.scope("user.id")}
            type="hidden"
            value={loaderData.user.id}
          />

          <InputGeneric name="username" scope={form.scope("user.username")} />

          <FormFooter>
            <Button type="reset" text="Reset Form" secondary />

            <Button
              type="submit"
              text="Save Changes"
              disabled={form.formState.isSubmitting}
            />
          </FormFooter>
        </form>
      </div>
      {/* End Profile Container */}
    </FrontendSection>
  );
}
