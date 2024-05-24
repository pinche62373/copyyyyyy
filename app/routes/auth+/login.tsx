import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { AuthorizationError } from "remix-auth";
import { jsonWithError } from "remix-toast";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { SpamError } from "remix-utils/honeypot/server";
import { ValidatedForm, validationError } from "remix-validated-form";

import { FormButton } from "#app/components/form-button";
import { FormInput } from "#app/components/form-input";
import { FormIntent } from "#app/components/form-intent";
import { EMAIL_PASSWORD_STRATEGY, authenticator } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { honeypot } from "#app/utils/honeypot.server";
import { returnToCookie } from "#app/utils/return-to.server";
import { sessionCookie } from "#app/utils/session.server";
import { authLoginSchema } from "#app/validations/auth-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";


const validator = withZod(authLoginSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessionId = await sessionCookie.parse(request.headers.get("Cookie"));

  // prevent orphaned client-side session cookies not existing in database breaking remix-auth
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

  // create returnTo cookie
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo");

  const headers = new Headers();
  if (returnTo) {
    headers.append("Set-Cookie", await returnToCookie.serialize(returnTo));
  }

  // send already authenticated users back to the homepage
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  // otherwise, create redirectCookie and continue
  return json(null, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "login");

  // honeypot
  try {
    honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      throw new Response("Invalid form data", { status: 400 });
    }
    throw error; // rethrow
  }

  // validate
  const fieldValues = await validator.validate(formData);

  if (fieldValues.error) return validationError(fieldValues.error);

  const returnTo = await returnToCookie.parse(request.headers.get("Cookie"));

  // IMPORTANT: do not use `failureRedirect` or remix-auth will crash trying to save the error to database session using empty `createData()`
  try {
    return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
      throwOnError: true,
      context: { formData },
      successRedirect: returnTo || "/",
    });
  } catch (error) {
    // Because redirects work by throwing a Response, you need to check if the
    // caught error is a response and return it or throw it again
    if (error instanceof Response) return error;

    // here the error is related to the authentication process
    if (error instanceof AuthorizationError) {
      return jsonWithError(null, error.message);
    }

    // here the error is a generic error that another reason may throw
    return jsonWithError(null, "Unexpected Failure");
  }
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
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

          <FormInput name="email" label="Email" placeholder="Your email..." />
          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Your password..."
          />

          <HoneypotInputs />

          <div className="flex justify-end gap-x-2 pt-2">
            <div className="w-full flex justify-end items-center gap-x-2">
              <Link to="/">
                <FormButton
                  type="button"
                  label="Cancel"
                  className="py-2 px-3 inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                />
              </Link>
              <FormButton type="submit" label="Log In" />
            </div>
          </div>
        </ValidatedForm>
        {/* </Form> */}
      </div>
    </div>
  );
}
