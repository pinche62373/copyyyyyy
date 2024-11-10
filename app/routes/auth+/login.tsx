import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { AuthorizationError } from "remix-auth";
import { jsonWithError } from "remix-toast";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { SpamError } from "remix-utils/honeypot/server";

import { Button } from "#app/components/shared/button";
import { FormFooter } from "#app/components/shared/form/footer";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { PairList } from "#app/components/shared/pair-list.tsx";
import { EMAIL_PASSWORD_STRATEGY, authenticator } from "#app/utils/auth.server";
import { AUTH_REGISTER_ROUTE } from "#app/utils/constants";
import { prisma } from "#app/utils/db.server";
import { honeypot } from "#app/utils/honeypot.server";
import { returnToCookie } from "#app/utils/return-to.server";
import { sessionCookie } from "#app/utils/session.server";
import { userSchemaLogin } from "#app/validations/user-schema";

const intent = "login";

const formValidator = withZod(userSchemaLogin);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessionId = await sessionCookie.parse(request.headers.get("Cookie"));

  // prevent orphaned client-side session cookies not existing in database breaking remix-auth
  if (sessionId) {
    const databaseSessionExists = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!databaseSessionExists) {
      return json(null, {
        headers: {
          "Set-Cookie": await sessionCookie.serialize("", {
            maxAge: 0
          })
        }
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
    successRedirect: "/"
  });

  // otherwise, create redirectCookie and continue
  return json(
    {
      form: {
        user: {
          email: null as unknown as string,
          password: null as unknown as string
        }
      }
    },
    { headers }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const validated = await formValidator.validate(formData);

  if (validated.error)
    return jsonWithError(validated.error, "Form data rejected by server", {
      status: 422
    });

  // honeypot
  try {
    honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      throw new Response("Invalid form data", {
        status: 400,
        statusText: "Invalid Form Data"
      });
    }
    throw error; // rethrow
  }

  const returnTo = await returnToCookie.parse(request.headers.get("Cookie"));

  // IMPORTANT: do not use `failureRedirect` or remix-auth will crash trying to save the error to database session using empty `createData()`
  try {
    return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
      throwOnError: true,
      context: { formData },
      successRedirect: returnTo || "/"
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

export const meta: MetaFunction = () => [{ title: "TMDB - Login" }];

export default function LoginPage() {
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const form = useForm({
    method: "post",
    validator: formValidator,
    defaultValues: { intent, ...loaderData?.form }
  });

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <form {...form.getFormProps()}>
          <InputGeneric
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />

          <PairList>
            <PairList.Pair>
              <PairList.Key className="pt-2.5">Email</PairList.Key>
              <PairList.Value>
                <InputGeneric
                  scope={form.scope("user.email")}
                  placeholder="Your email..."
                />
              </PairList.Value>
            </PairList.Pair>

            <PairList.Pair>
              <PairList.Key className="pt-2.5">Password</PairList.Key>
              <PairList.Value>
                <InputGeneric
                  scope={form.scope("user.password")}
                  type="password"
                  placeholder="Your password..."
                />
              </PairList.Value>
            </PairList.Pair>
          </PairList>

          <HoneypotInputs />

          <FormFooter>
            <Button
              type="button"
              text="Register"
              to={AUTH_REGISTER_ROUTE}
              secondary
            />
            <Button
              type="submit"
              text="Log In"
              disabled={navigation.state === "submitting"}
            />
          </FormFooter>
        </form>
      </div>
    </div>
  );
}
