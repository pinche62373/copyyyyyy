import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useRef } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData } from "react-router";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import zod, { z } from "zod";
import { BackendPanel } from "#app/components/backend/panel";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { ActionButton } from "#app/components/shared/form/action-button.tsx";
import { PairList } from "#app/components/shared/pair-list.tsx";
import {
  deleteExpiredSessions,
  getExpiredSessionCount,
} from "#app/models/session";
import { requireRoutePermission } from "#app/utils/permissions.server";

const intent = "purge" as const;

const purgeSchema = z.object({
  intent: z.literal(intent),
});

const resolver = zodResolver(purgeSchema);

type FormData = zod.infer<typeof purgeSchema>;

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [{ name: "System", to: "admin/system" }],
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const expiredSessionCount = await getExpiredSessionCount();

  return {
    expiredSessionCount,
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { errors } = await getValidatedFormData<FormData>(request, resolver);

  if (errors) {
    return dataWithError({ errors }, "Form data rejected by server", {
      status: 422,
    });
  }

  await requireRoutePermission(request, {
    resource: "/admin/system",
    scope: "any",
  });

  try {
    await deleteExpiredSessions();
  } catch {
    return dataWithError(null, "Unexpected error");
  }

  return dataWithSuccess(null, "Sessions deleted succesfully");
};

export default function Component() {
  const formRef = useRef<HTMLFormElement>(null);

  const { expiredSessionCount } = useLoaderData<typeof loader>();

  const invalidSessionsLabel =
    expiredSessionCount === 0
      ? "No expired database sessions to purge"
      : `Purge ${expiredSessionCount} expired database sessions`;

  const { handleSubmit, register } = useRemixForm<FormData>({
    mode: "onBlur",
    resolver,
    defaultValues: { intent },
  });

  return (
    <BackendPanel>
      <BackendPanel.Row>
        <BackendTitle text={`System`} foreground />
      </BackendPanel.Row>

      <BackendPanel.Row last>
        <Form
          ref={formRef}
          method="POST"
          action="/admin/system"
          onSubmit={handleSubmit}
        >
          <input type="hidden" {...register("intent")} />
        </Form>

        <PairList>
          <PairList.Pair>
            <PairList.Key className="align-middle" last>
              Sessions
            </PairList.Key>
            <PairList.Value last>
              <ActionButton
                formRef={formRef}
                label={invalidSessionsLabel}
                buttonLabel="Purge"
                disabled={expiredSessionCount === 0}
                modalHeading="Delete expired sessions"
                modalBody="Are you sure you want to permanently delete these expired sessions?"
              />
            </PairList.Value>
          </PairList.Pair>
        </PairList>
        {/* </form> */}
      </BackendPanel.Row>
    </BackendPanel>
  );
}
