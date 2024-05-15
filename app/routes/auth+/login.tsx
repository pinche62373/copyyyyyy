import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";

import { FormButton } from "#app/components/form-button";
import { FormInput } from "#app/components/form-input";
import { FormIntent } from "#app/components/form-intent";
import { EMAIL_PASSWORD_STRATEGY, authenticator } from "#app/utils/auth.server";
import { AUTH_LOGIN_ROUTE } from "#app/utils/constants";
import { prisma } from "#app/utils/db.server";
import { sessionCookie } from "#app/utils/session.server";
import { authLoginSchema } from "#app/validations/auth-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

const validator = withZod(authLoginSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessionId = await sessionCookie.parse(request.headers.get("Cookie"));

  // prevent orphaned client-side session cookies breaking remix-auth
  if (sessionId) {
    const databaseSessionExists = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!databaseSessionExists) {
      return json(null, {
        headers: {
          "Set-Cookie": await sessionCookie.serialize("", {
            maxAge: 0,
          }),
        },
      });
    }
  }

  // database session record found, let authenticator check if user is valid
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "login");

  const fieldValues = await validator.validate(formData);

  if (fieldValues.error) return validationError(fieldValues.error);

  return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
    successRedirect: "/",
    failureRedirect: AUTH_LOGIN_ROUTE,
    context: { formData },
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
          <FormIntent intent="login" />
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <FormInput name="email" label="Email" placeholder="Your email..." />
          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Your password..."
          />

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
