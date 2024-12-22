import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useForm, validationError } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { AuthorizationError } from "remix-auth";
import { jsonWithError } from "remix-toast";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { SpamError } from "remix-utils/honeypot/server";
import { Button } from "#app/components/shared/button";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { PairList } from "#app/components/shared/pair-list.tsx";
import { createUser, isEmailAddressAvailable } from "#app/models/user.server";
import {
  EMAIL_PASSWORD_STRATEGY,
  authenticator,
  getUserId,
} from "#app/utils/auth.server";
import { honeypot } from "#app/utils/honeypot.server";
import { userSchemaRegister } from "#app/validations/user-schema";

const intent = "register" as const;

const clientFormValidator = withZod(userSchemaRegister);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);

  if (userId) return redirect("/");

  return {
    form: {
      user: {
        email: null as unknown as string,
        username: null as unknown as string,
        password: null as unknown as string,
      },
    },
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formValidatorServer = withZod(
    userSchemaRegister.refine(
      async (data) => {
        return isEmailAddressAvailable({ email: data.user.email });
      },
      {
        message: "Whoops! That email is already taken.",
        path: ["user.email"],
      },
    ),
  );

  const formData = await request.clone().formData();

  const validated = await formValidatorServer.validate(formData);

  if (validated.error) {
    return validationError(validated.error, validated.submittedData);
  }

  // honeypot
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

  await createUser(
    validated.data.user.email,
    validated.data.user.username,
    validated.data.user.password,
  );

  // IMPORTANT: do not use `failureRedirect` or remix-auth will crash trying to save the error to database session using empty `createData()`
  try {
    return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
      throwOnError: true,
      context: { formData },
      successRedirect: "/",
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

export const meta: MetaFunction = () => [{ title: "TZDB - Register" }];

export default function RegisterPage() {
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  // const submit = useDebounceSubmit();

  const form = useForm({
    method: "post",
    validator: clientFormValidator,
    defaultValues: { intent, ...loaderData.form },
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
              <PairList.Key>Email</PairList.Key>
              <PairList.Value>
                <InputGeneric
                  scope={form.scope("user.email")}
                  placeholder="Your email..."
                />
              </PairList.Value>
            </PairList.Pair>

            <PairList.Pair>
              <PairList.Key>Username</PairList.Key>
              <PairList.Value>
                <InputGeneric
                  scope={form.scope("user.username")}
                  placeholder="Your username..."
                />
              </PairList.Value>
            </PairList.Pair>

            <PairList.Pair>
              <PairList.Key>Password</PairList.Key>
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

          <Button type="button" text="Cancel" to="/" secondary />
          <Button
            type="submit"
            text="Register"
            disabled={navigation.state === "submitting"}
          />
        </form>
      </div>
    </div>
  );
}
