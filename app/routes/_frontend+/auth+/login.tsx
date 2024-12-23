import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import {
  Form,
  data,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError } from "remix-toast";
import { SpamError } from "remix-utils/honeypot/server";
import zod from "zod";
import { Button } from "#app/components/shared/button.tsx";
import { Float } from "#app/components/shared/float.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { authenticate } from "#app/utils/auth.server";
import { ROUTE_LOGIN } from "#app/utils/constants";
import { prisma } from "#app/utils/db.server";
import { honeypot } from "#app/utils/honeypot.server";
import { getDefaultValues } from "#app/utils/lib/get-default-values.ts";
import { returnToCookie } from "#app/utils/return-to.server";
import { getSession, sessionCookie } from "#app/utils/session.server";
import { userSchemaLogin } from "#app/validations/user-schema";

const intent = "login" as const;

const resolver = zodResolver(userSchemaLogin);

type FormData = zod.infer<typeof userSchemaLogin>;

// TODO replace whenRemix fixes https://github.com/remix-run/remix/issues/9826#issuecomment-2491878937
type LoaderData = Omit<Awaited<ReturnType<typeof loader>>, "defaultValues"> & {
  defaultValues: {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessionId = await sessionCookie.parse(request.headers.get("Cookie"));

  const headers = new Headers();

  // delete orphaned session cookies without matching database record (or prisma will break)
  if (sessionId) {
    const databaseSessionExists = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!databaseSessionExists) {
      headers.append(
        "Set-Cookie",
        await sessionCookie.serialize("", {
          maxAge: 0,
        }),
      );

      redirect(ROUTE_LOGIN, { headers });
    }
  }

  // create returnTo cookie
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo");

  if (returnTo) {
    headers.append("Set-Cookie", await returnToCookie.serialize(returnTo));
  }

  // RR7: send already authenticated users back to the homepage
  let session = await getSession(request.headers.get("cookie"));
  let user = session.get("user");

  if (user) throw redirect("/");

  // continue to login (using headers to create redirectCookie)
  return data(
    {
      defaultValues: getDefaultValues(userSchemaLogin, { intent }),
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
    return dataWithError({ errors }, "Form data rejected by server", {
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

  // authenticate
  try {
    await authenticate(
      request,
      await returnToCookie.parse(request.headers.get("Cookie")),
    );
  } catch (error) {
    if (error instanceof Response) throw error;

    if (error instanceof Error) {
      return dataWithError(null, error.message);
    }

    return dataWithError(null, "Unexpected Failure");
  }
};

export const meta: MetaFunction = () => [{ title: "TZDB - Login" }];

export default function LoginPage() {
  const { defaultValues } = useLoaderData<LoaderData>();

  const navigation = useNavigation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRemixForm<FormData>({
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
          <input type="hidden" {...register("intent")} />

          <Input
            label="Email address"
            variant="ifta"
            {...register("user.email")}
            error={errors.user?.email?.message}
          />

          <Input
            label="Password"
            type="password"
            variant="ifta"
            {...register("user.password")}
            error={errors.user?.password?.message}
          />

          <Float direction="end">
            <Button type="button" text="Cancel" to="/" secondary />
            <Button
              type="submit"
              text="Login"
              disabled={navigation.state === "submitting"}
            />
          </Float>
        </Form>
      </div>
    </div>
  );
}
