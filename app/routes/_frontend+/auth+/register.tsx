import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldPath } from "react-hook-form";
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
import { Flex } from "#app/components/flex.tsx";
import { Input } from "#app/components/shared/form/input.tsx";
import { LinkButton } from "#app/components/ui/link-button.tsx";
import { SubmitButton } from "#app/components/ui/submit-button.tsx";
import { useFormHelpers } from "#app/hooks/use-form-helpers.ts";
import {
  assignRoleToUser,
  createUser,
  isEmailAddressAvailable,
} from "#app/models/user.server";
import { authenticate, blockAuthenticated } from "#app/utils/auth.server";
import { ROUTE_HOME, ROUTE_REGISTER } from "#app/utils/constants.ts";
import { honeypot } from "#app/utils/honeypot.server";
import { getDefaultValues } from "#app/utils/lib/get-default-values.ts";
import { UserSchemaRegister } from "#app/validations/user-schema";

const intent = "register" as const;

const resolver = zodResolver(UserSchemaRegister);

type FormData = zod.infer<typeof UserSchemaRegister>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await blockAuthenticated(request, ROUTE_REGISTER);

  return {
    defaultValues: getDefaultValues(UserSchemaRegister, { intent }),
    intent,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { data, errors } = await getValidatedFormData<FormData>(
    request.clone(),
    zodResolver(
      UserSchemaRegister.refine(
        async (data) => {
          return isEmailAddressAvailable(data.user.email);
        },
        {
          message: "That email address is already taken.",
          path: ["user.email"],
        },
      ),
    ),
  );

  if (errors) {
    return dataWithError({ errors }, "Form data rejected by server", {
      // status: 422
    });
  }

  // honeypot
  const formData = await request.clone().formData();

  try {
    await honeypot.check(formData);
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
  const user = await createUser(
    data.user.email,
    data.user.username,
    data.user.password,
  );

  // assign role
  await assignRoleToUser(user.id, "user");

  // auto login
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

  const form = useRemixForm<FormData>({
    mode: "onBlur",
    resolver,
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    getFieldState,
    formState: { errors },
  } = form;

  // @ts-ignore: awaits remix-hook-form fix for type `UseRemixFormReturn`
  const { setFormFieldValue, isValidFormField } = useFormHelpers(form);

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
            onBlur={(e) =>
              setFormFieldValue(
                "user.email" as FieldPath<FormData>,
                e.currentTarget.value,
              )
            }
            checkmark={isValidFormField(getFieldState("user.email"))}
          />

          <Input
            label="Username"
            variant="ifta"
            {...register("user.username")}
            error={errors.user?.username?.message}
            onBlur={(e) =>
              setFormFieldValue(
                "user.username" as FieldPath<FormData>,
                e.currentTarget.value,
              )
            }
            checkmark={isValidFormField(getFieldState("user.username"))}
          />

          <Input
            label="Password"
            type="password"
            variant="ifta"
            {...register("user.password")}
            error={errors.user?.password?.message}
          />

          <Flex className="mobile gap-5">
            <SubmitButton disabled={navigation.state === "submitting"} />
            <LinkButton text="Cancel" to={ROUTE_HOME} secondary />
          </Flex>

          <Flex className="desktop">
            <Flex.End>
              <LinkButton text="Cancel" to={ROUTE_HOME} secondary />
              <SubmitButton disabled={navigation.state === "submitting"} />
            </Flex.End>
          </Flex>
        </Form>
      </div>
    </div>
  );
}
