import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { safeRedirect } from "remix-utils/safe-redirect";
import { ValidatedForm, validationError } from "remix-validated-form";

import { FormButton } from "#app/components/form-button";
import { FormInput } from "#app/components/form-input";
import { verifyLogin } from "#app/models/user.server";
import { validateEmail } from "#app/utils";
import { createUserSession, getUserId } from "#app/utils/auth.server";
import { authLoginSchema } from "#app/validations/auth-schema";

const validator = withZod(authLoginSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <ValidatedForm
          method="POST"
          validator={validator}
          className="space-y-6"
          noValidate // disable native HTML validations
        >
          <div>
            <FormInput name="email" label="Email" placeholder="Your email..." />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Your password..."
            />
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="flex justify-end gap-x-2 pt-2">
            <div className="w-full flex justify-end items-center gap-x-2">
              <FormButton
                type="button"
                label="Cancel"
                className="py-2 px-3 inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              />
              <FormButton type="submit" label="Log In" />
            </div>
          </div>
        </ValidatedForm>
        {/* </Form> */}
      </div>
    </div>
  );
}
