import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { z } from "zod";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { ActionButton } from "#app/components/shared/form/inputs/action-button";
import {
  deleteExpiredSessions,
  getExpiredSessionCount
} from "#app/models/session";
import { requireRoutePermission } from "#app/utils/permissions.server";

const intent = "purge";

const validator = withZod(
  z.object({
    intent: z.literal(intent)
  })
);

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const expiredSessionCount = await getExpiredSessionCount();

  return {
    expiredSessionCount
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const validated = await validator.validate(await request.formData());

  if (validated.error)
    return jsonWithError(validated.error, "Form data rejected by server", {
      status: 422
    });

  await requireRoutePermission(request, {
    resource: "/admin/system",
    scope: "any"
  });

  try {
    await deleteExpiredSessions();
  } catch {
    return jsonWithError(null, "Unexpected error");
  }

  return jsonWithSuccess(null, `Expired sessions deleted successfully`);
};

export default function Component() {
  const { expiredSessionCount } = useLoaderData<typeof loader>();
  const formId = "form-purge-sessions";

  const form = useForm({
    method: "post",
    validator,
    action: "/admin/system",
    id: formId
  });

  const invalidSessionsLabel =
    expiredSessionCount === 0
      ? "No expired database sessions to purge"
      : `Purge ${expiredSessionCount} expired database sessions`;

  return (
    <>
      <BackendPageTitle title="System" />

      <BackendContentContainer className="px-5 py-3">
        <form {...form.getFormProps()}>
          <InputGeneric
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />

          <ActionButton
            formId={formId}
            label={invalidSessionsLabel}
            buttonLabel="Purge"
            enabled={expiredSessionCount > 0}
          />
        </form>
      </BackendContentContainer>
    </>
  );
}
