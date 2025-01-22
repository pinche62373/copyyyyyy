import { zodResolver } from "@hookform/resolvers/zod";
import type { Row } from "@tanstack/react-table";
import { useRef } from "react";
import { Form } from "react-router";
import { useRemixForm } from "remix-hook-form";
import type { Schema } from "zod";
import zod from "zod";
import { IconContainerRound } from "#app/components/icon-container-round";
import { Confirm } from "#app/components/shared/confirm.tsx";
import { Icon } from "#app/components/ui/icon.tsx";
import type { Crud } from "#app/utils/admin-crud";
import { useUser, userHasModelPermission } from "#app/utils/user";

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
  row: Row<any>;
  crud: Crud;
  schema: Schema;
}

/**
 * Returns a form element with confirm dialog pointing to the "delete" action for the given row.
 */
export const TableButtonDelete = ({ row, crud, schema }: Props) => {
  const user = useUser();

  const resolver = zodResolver(schema);

  type FormData = zod.infer<typeof schema>;

  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit } = useRemixForm<FormData>({
    mode: "onBlur",
    resolver,
    defaultValues: {
      intent: "delete",
      [crud.singular]: {
        id: row.original.id,
      },
    },
  });

  if (
    userHasModelPermission(user, {
      resource: crud.singular,
      action: "delete",
      scope: "any",
    }) === false
  ) {
    return null;
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        method="POST"
        ref={formRef}
        autoComplete="off"
        className="hidden"
      >
        <input type="hidden" {...register("intent")} />
        <input type="hidden" {...register(`${crud.singular}.id`)} />
      </Form>

      <Confirm ariaLabel={`Delete ${crud.singular}`}>
        <Confirm.Trigger>
          <IconContainerRound className="hover:text-red-500">
            <Icon name="trash-2" />
          </IconContainerRound>
        </Confirm.Trigger>

        <Confirm.Modal heading={`Delete ${crud.singular}`} formRef={formRef}>
          {`Are you sure you want to permanently delete "${row.original.name}"?`}
        </Confirm.Modal>
      </Confirm>
    </>
  );
};
