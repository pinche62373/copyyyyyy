import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { data } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Controller } from "react-hook-form";
import { AuthorizationError } from "remix-auth";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { jsonWithError } from "remix-toast";
import { SpamError } from "remix-utils/honeypot/server";
import zod from "zod";
import { getDefaultsForSchema } from "zod-defaults";
import { Button } from "#app/components/shared/button.tsx";
import { TextField } from "#app/components/shared/form/text-field.tsx";
import { EMAIL_PASSWORD_STRATEGY, authenticator } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { honeypot } from "#app/utils/honeypot.server";
import { returnToCookie } from "#app/utils/return-to.server";
import { sessionCookie } from "#app/utils/session.server";
import { userSchemaLogin } from "#app/validations/user-schema";

const intent = "login";

const resolver = zodResolver(userSchemaLogin);

type FormData = zod.infer<typeof userSchemaLogin>;

// TODO replace whenRemix fixes https://github.com/remix-run/remix/issues/9826#issuecomment-2491878937
type LoaderData = Omit<Awaited<ReturnType<typeof loader>>, "defaultValues"> & {
  defaultValues: {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessionId = await sessionCookie.parse(request.headers.get("Cookie"));

  // prevent orphaned client-side session cookies not existing in database breaking remix-auth
  if (sessionId) {
    const databaseSessionExists = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!databaseSessionExists) {
      return data(null, {
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

  // continue to login (using headers to create redirectCookie)
  // const defaultValues = getDefaultsForSchema(userSchemaLogin)
  // defaultValues.intent = intent
  return data(
    {
      defaultValues: getDefaultsForSchema(userSchemaLogin),
    },
    { headers },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { errors } = await getValidatedFormData<FormData>(
    request.clone(),
    resolver,
  );

  if (errors) {
    return jsonWithError({ errors }, "Form data rejected by server", {
      status: 422,
    });
  }

  // honeypot
  const formData = await request.clone().formData();

  try {
    honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      throw new Response("Invalid form data", {
        status: 400,
        statusText: "Invalid Form Data",
      });
    }
    throw error; // rethrow
  }

  // returnTo
  const returnTo = await returnToCookie.parse(request.headers.get("Cookie"));

  // IMPORTANT: do not use `failureRedirect` or remix-auth will crash trying to save the error to database session using empty `createData()`
  try {
    return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
      throwOnError: true,
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

export const meta: MetaFunction = () => [{ title: "TZDB - Login" }];

export default function LoginPage() {
  const { defaultValues } = useLoaderData<LoaderData>();

  const { handleSubmit, control, register } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className="max-w-prose mx-auto my-40 shadow-md space-y-4 bg-white rounded-lg p-4"
        >
          <input type="hidden" {...register("intent")} value={intent} />

          <Controller
            name="user.email"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} isInvalid={invalid} variant="stacked">
                <TextField.Label>Email address</TextField.Label>
                <TextField.Input type="text" {...register(field.name)} />
                <TextField.FieldError>{error?.message} </TextField.FieldError>
              </TextField>
            )}
          />

          <Controller
            name="user.password"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} isInvalid={invalid} variant="stacked">
                <TextField.Label>Password</TextField.Label>
                <TextField.Input type="password" {...register(field.name)} />
                <TextField.FieldError>{error?.message} </TextField.FieldError>
              </TextField>
            )}
          />
          <div className="flow-root w-full pt-2">
            <Button type="submit" text="Login" className="float-right" />
            <Link to="/">
              <Button
                as="div"
                text="Cancel"
                secondary
                className="float-right mr-2"
              />
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
