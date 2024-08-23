import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { FormFooter } from "#app/components/backend/form/form-footer";
import { FormInputHidden } from "#app/components/backend/form/form-input-hidden";
import { FormInputText } from "#app/components/backend/form/form-input-text";
import { FrontendSection } from "#app/components/frontend/section";
import { Button } from "#app/components/shared/button";
import { updateUserAccountSettings } from "#app/models/user.server";
import { authenticator } from "#app/utils/auth.server";
import { AUTH_LOGIN_ROUTE } from "#app/utils/constants";
import { validateSubmission } from "#app/utils/misc";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { useUser } from "#app/utils/user";
import { userSchemaUpdateUsername } from "#app/validations/user-schema";

const intent = "update";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  await authenticator.isAuthenticated(request, {
    failureRedirect: AUTH_LOGIN_ROUTE + `?returnTo=${url.pathname}`,
  });

  await requireRoutePermission(request, {
    resource: url.pathname,
    scope: "any",
  });

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = validateSubmission({
    intent,
    formData: await request.formData(),
    schema: userSchemaUpdateUsername,
  });

  await requireModelPermission(request, {
    resource: "user",
    action: intent,
    scope: "own",
    resourceId: submission.value.id,
  });

  try {
    await updateUserAccountSettings(submission.value);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return jsonWithSuccess(null, `Settings updated successfully`);
};

export default function SettingsIndexPage() {
  const user = useUser();
  const navigation = useNavigation();

  const [usernameForm, usernameFields] = useForm({
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: userSchemaUpdateUsername,
      });
    },
  });

  return (
    <FrontendSection>
      {/* Profile Settings Container */}
      <div className="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
        {/* Profile Header */}
        <h2 className="font-semibold text-gray-800 dark:text-neutral-200">
          Profile
        </h2>

        {/* Profile Form */}
        <Form
          method="post"
          id={usernameForm.id}
          onSubmit={usernameForm.onSubmit}
        >
          <FormInputHidden name="intent" value={"update"} />
          <FormInputHidden name="id" value={user.id} />

          <FormInputText
            label="Username"
            fieldName="username"
            fields={usernameFields}
            defaultValue={user.username}
          />

          <FormFooter>
            <Button
              type="submit"
              text="Save Changes"
              disabled={navigation.state === "submitting"}
            />
          </FormFooter>
        </Form>
      </div>
      {/* End Profile Setting Container */}
    </FrontendSection>
  );
}
