import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { namedAction } from "remix-utils/named-action";
import { z } from "zod";

import { BackendPanel } from "#app/components/backend/panel";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { ActionButton } from "#app/components/shared/form/inputs/action-button.tsx";
import { PairList } from "#app/components/shared/pair-list.tsx";
import {
  deleteExpiredSessions,
  getExpiredSessionCount
} from "#app/models/session";
import { requireRoutePermission } from "#app/utils/permissions.server";

const intent = "purge";

const formValidator = withZod(
  z.object({
    intent: z.literal(intent)
  })
);

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [{ name: "System", to: "admin/system" }]
};

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
  return namedAction(request, {
    async purge() {
      const validated = await formValidator.validate(await request.formData());

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
    }
  });
};

export default function Component() {
  const { expiredSessionCount } = useLoaderData<typeof loader>();
  const formId = "form-purge-sessions";

  const form = useForm({
    method: "post",
    validator: formValidator,
    action: "/admin/system",
    id: formId
  });

  const invalidSessionsLabel =
    expiredSessionCount === 0
      ? "No expired database sessions to purge"
      : `Purge ${expiredSessionCount} expired database sessions`;

  return (
    <BackendPanel>
      <BackendPanel.HeaderLeft>
        <BackendTitle text={`System`} foreground />
      </BackendPanel.HeaderLeft>

      <BackendPanel.Content>
        <form {...form.getFormProps()} autoComplete="off">
          <InputGeneric
            scope={form.scope("intent")}
            type="hidden"
            value={intent}
          />

          <PairList>
            <PairList.Pair>
              <PairList.Key className="align-middle">Sessions</PairList.Key>
              <PairList.Value>
                <ActionButton
                  formId={formId}
                  label={invalidSessionsLabel}
                  buttonLabel="Purge"
                  enabled={expiredSessionCount > 0}
                />
              </PairList.Value>
            </PairList.Pair>
          </PairList>
        </form>
      </BackendPanel.Content>
    </BackendPanel>
  );
}
