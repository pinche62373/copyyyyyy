import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { FormProvider, useForm } from "@rvf/remix";
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
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { userSchemaUpdateUsername } from "#app/validations/user-schema";

const intent = "update";

const validator = withZod(userSchemaUpdateUsername);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  await authenticator.isAuthenticated(request, {
    failureRedirect: AUTH_LOGIN_ROUTE + `?returnTo=${url.pathname}`,
  });

  await requireRoutePermission(request, {
    resource: url.pathname,
    scope: "any",
  });

  const { id, username } = await getUserOrDie(request);

  return {
    intent,
    id,
    username,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const validated = await validator.validate(await request.formData());

  if (validated.error)
    return jsonWithError(validated.error, "Form data rejected by server", {
      status: 422,
    });

  await requireModelPermission(request, {
    resource: "user",
    action: intent,
    scope: "own",
    resourceId: validated.data.id,
  });

  try {
    await updateUserAccountSettings(validated.data);
  } catch (error) {
    return jsonWithError(validated.data, "Server error while saving your data");
  }

  return jsonWithSuccess(validated.data, `Settings updated successfully`);
};

export default function SettingsIndexPage() {
  const actionData = useActionData<typeof action>();

  const form = useForm({
    method: "post",
    validator,
    defaultValues: useLoaderData<typeof loader>(),
    onSubmitSuccess: async () => {
      !isValidationErrorResponse(actionData) && form.resetForm(actionData);
    },
  });

  return (
    <FrontendSection>
      {/* Profile Container */}
      <div className="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
        {/* Profile Header */}
        <h2 className="font-semibold text-gray-800 dark:text-neutral-200">
          Profile
        </h2>

        {/* Profile Form */}
        <FormProvider scope={form.scope()}>
          <form {...form.getFormProps()}>
            <InputGeneric scope={form.scope("id")} name="id" type="hidden" />
            <InputGeneric
              scope={form.scope("intent")}
              name="intent"
              type="hidden"
            />

            <InputGeneric
              name="username"
              scope={form.scope("username")}
              label={"Username"}
            />

            <FormFooter>
              <Button type="reset" text="Reset Form" secondary />

              <Button
                type="submit"
                text="Save Changes"
                disabled={form.formState.isSubmitting}
              />
            </FormFooter>
          </form>
        </FormProvider>
      </div>
      {/* End Profile Container */}
    </FrontendSection>
  );
}
