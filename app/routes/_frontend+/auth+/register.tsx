import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError } from "remix-toast";
import { SpamError } from "remix-utils/honeypot/server";
import zod from "zod";
import { Button } from "#app/components/shared/button";
import { Float } from "#app/components/shared/float.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { createUser, isEmailAddressAvailable } from "#app/models/user.server";
import { authenticate, blockAuthenticated } from "#app/utils/auth.server";
import { ROUTE_REGISTER } from "#app/utils/constants.ts";
import { honeypot } from "#app/utils/honeypot.server";
import { getDefaultValues } from "#app/utils/lib/get-default-values.ts";
import { userSchemaRegister } from "#app/validations/user-schema";

const intent = "register" as const;

const resolver = zodResolver(userSchemaRegister);

type FormData = zod.infer<typeof userSchemaRegister>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await blockAuthenticated(request, ROUTE_REGISTER);

  return {
    defaultValues: getDefaultValues(userSchemaRegister, { intent }),
    intent,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { data, errors } = await getValidatedFormData<FormData>(
    request.clone(),
    zodResolver(
      userSchemaRegister.refine(
        async (data) => {
          return isEmailAddressAvailable(data.user.email);
        },
        {
          message: "Whoops! That email is already taken.",
          path: ["user.email"],
        },
      ),
    ),
  );

  if (errors) {
    return dataWithError(errors, "Form data rejected by server", {
      // status: 422, // TODO re-enable when remix-toast fixes this
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

  // create the user
  await createUser(data.user.email, data.user.username, data.user.password);

  try {
    await authenticate(request);
  } catch (error) {
    if (error instanceof Response) throw error;

    if (error instanceof Error) {
      return dataWithError(null, error.message);
    }

    return dataWithError(null, "Unexpected Failure");
  }
};

export const meta: MetaFunction = () => [{ title: "TZDB - Register" }];

export default function RegisterPage() {
  const { defaultValues } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRemixForm<FormData>({
    mode: "onBlur",
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
            label="Username"
            variant="ifta"
            {...register("user.username")}
            error={errors.user?.username?.message}
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
              text="Save"
              disabled={navigation.state === "submitting"}
            />
          </Float>
        </Form>
      </div>
    </div>
  );
}
