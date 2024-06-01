import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { FormInputActionButton } from "#app/components/admin/form/form-input-action-button";
import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import {
  deleteExpiredSessions,
  getExpiredSessionCount,
} from "#app/models/session";
import { requireUserWithRole } from "#app/utils/permissions.server";
import { validateFormIntent } from "#app/validations/validate-form-intent";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithRole(request, "admin");

  const expiredSessionCount = await getExpiredSessionCount();

  return { expiredSessionCount };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "purge");

  try {
    await deleteExpiredSessions();
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return jsonWithSuccess(null, `Expired sessions deleted successfully`);
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  const formId = "form-purge-sessions";

  const invalidSessionsLabel =
    data.expiredSessionCount === 0
      ? "No expired database sessions to purge"
      : `Purge ${data.expiredSessionCount} expired database sessions`;

  return (
    <>
      <AdminPageTitle title="System" />

      <AdminContentCard className="px-5 py-3">
        <Form id={formId} method="POST" action="/admin/system">
          <FormInputHidden name="intent" value="purge" />

          <FormInputActionButton
            formId={formId}
            label={invalidSessionsLabel}
            buttonLabel="Purge"
            enabled={data.expiredSessionCount > 0}
          />
        </Form>
      </AdminContentCard>
    </>
  );
}
