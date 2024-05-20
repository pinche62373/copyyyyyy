import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import { AdminFormFieldHidden } from "#app/components/admin/form/field-hidden";
import { AdminFormInputButton } from "#app/components/admin/form/input-button";
import {
  deleteExpiredSessions,
  getExpiredSessionCount,
} from "#app/models/session";
import { validateFormIntent } from "#app/validations/validate-form-intent";

export const loader = async () => {
  const expiredSessionCount = await getExpiredSessionCount();

  return { expiredSessionCount };
};

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

  const invalidSessionsLabel =
    data.expiredSessionCount === 0
      ? "No expired database sessions to purge"
      : `Purge expired database sessions (${data.expiredSessionCount})`;

  return (
    <>
      <AdminPageTitle title="System" />

      <AdminContentCard className="px-5 py-3">
        <Form
          method="POST"
          action="/admin/system"
          onSubmit={(event) => {
            if (!confirm("Are you sure?")) {
              event.preventDefault();
            }
          }}
        >
          <AdminFormFieldHidden name="intent" value="purge" />

          <AdminFormInputButton
            label={invalidSessionsLabel}
            buttonLabel="Purge now!"
            disabled={data.expiredSessionCount === 0}
          />
        </Form>
      </AdminContentCard>
    </>
  );
}
