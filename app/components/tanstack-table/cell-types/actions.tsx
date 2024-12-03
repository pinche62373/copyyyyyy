import { NavLink } from "@remix-run/react";
import { ValidatedForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { CellContext } from "@tanstack/react-table";
import React from "react";
import { z } from "zod";
import { IconContainerRound } from "#app/components/icon-container-round";
import { IconEdit } from "#app/components/icons/icon-edit";
import { IconTrash } from "#app/components/icons/icon-trash";
import { Confirm } from "#app/components/shared/confirm.tsx";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { Crud } from "#app/utils/admin-crud";

interface TableCellActionsFunctionArgs {
  // biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
  info: CellContext<any, string>;
  crud: Crud;
  actions: {
    edit?: boolean;
    delete?: boolean;
  };
}

export const tableCellActions = ({
  info,
  crud,
  actions,
}: TableCellActionsFunctionArgs) => {
  // edit button
  const editUrl = `${info.row.original.id}/edit`;

  actions.delete = true;

  // delete button
  const deleteFormRef = React.useRef<HTMLFormElement>(null);

  const deleteFormValidator = withZod(
    z
      .object({
        intent: z.literal("delete"),
        rvfFormId: z.string(),
      })
      .catchall(
        z.object({
          id: z.string().cuid2(),
        }),
      ),
  );

  return (
    <>
      {/* Edit Button */}
      {actions.edit && (
        <NavLink to={editUrl} title="Edit">
          <IconContainerRound>
            <IconEdit />
          </IconContainerRound>
        </NavLink>
      )}

      {/* Optional Delete Button  */}
      {actions.delete === true && (
        <>
          <ValidatedForm
            method="POST"
            action={crud.routes.index}
            validator={deleteFormValidator}
            formRef={deleteFormRef}
            className="hidden"
          >
            {(form) => (
              <>
                <InputGeneric
                  scope={form.scope("intent")}
                  type="hidden"
                  value="delete"
                />

                <InputGeneric
                  scope={form.scope(`${crud.singular}.id`)}
                  type="hidden"
                  value={info.row.original.id}
                />
              </>
            )}
          </ValidatedForm>

          <Confirm>
            <Confirm.Trigger>
              <IconContainerRound>
                <IconTrash />
              </IconContainerRound>
            </Confirm.Trigger>

            <Confirm.Modal
              heading={`Delete ${crud.singular}`}
              formRef={deleteFormRef}
            >
              {`Are you sure you want to permanently delete "${info.row.original.name}"?`}
            </Confirm.Modal>
          </Confirm>
        </>
      )}
    </>
  );
};
