import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { FormInputActionButton } from "#app/components/backend/form/form-input-action-button";
import { FormInputHidden } from "#app/components/backend/form/form-input-hidden";
import { BackendPageTitle } from "#app/components/backend/page-title";
import {
  deleteExpiredSessions,
  getExpiredSessionCount,
} from "#app/models/session";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { validateFormIntent } from "#app/validations/form-intent";

const intent = "purge";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const expiredSessionCount = await getExpiredSessionCount();

  return { expiredSessionCount };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireRoutePermission(request, {
    resource: "/admin/system",
    scope: "any",
  });
  
  const formData = await request.formData();

  validateFormIntent({ formData, intent});

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

  const invalidSessionsLabel =
    expiredSessionCount === 0
      ? "No expired database sessions to purge"
      : `Purge ${expiredSessionCount} expired database sessions`;

  return (
    <>
      <BackendPageTitle title="System" />

      <BackendContentContainer className="px-5 py-3">
        <Form id={formId} method="POST" action="/admin/system">
          <FormInputHidden name="intent" value={intent} />

          <FormInputActionButton
            formId={formId}
            label={invalidSessionsLabel}
            buttonLabel="Purge"
            enabled={expiredSessionCount > 0}
          />
        </Form>
      </BackendContentContainer>
    </>
  );
}
