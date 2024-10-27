import { NavLink } from "@remix-run/react";
import { ValidatedForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { CellContext } from "@tanstack/react-table";
import { z } from "zod";

import { ConfirmationLauncher } from "#app/components/confirmation-launcher";
import { ConfirmationModal } from "#app/components/confirmation-modal";
import { IconContainerRound } from "#app/components/icon-container-round";
import { IconEdit } from "#app/components/icons/icon-edit";
import { IconTrash } from "#app/components/icons/icon-trash";
import { InputGeneric } from "#app/components/shared/form/input-generic";
import { Crud } from "#app/utils/admin-crud";

// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
interface TableCellActionsFunctionArgs {
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
  actions
}: TableCellActionsFunctionArgs) => {
  // edit button
  const editUrl = `${info.row.original.id}/edit`;

  // delete button
  const deleteFormId = "delete-form-" + info.row.original.id;
  const confirmDeleteId = "confirm-" + deleteFormId;
  const deleteFormValidator = withZod(
    z
      .object({
        intent: z.literal("delete"),
        rvfFormId: z.string()
      })
      .catchall(
        z.object({
          id: z.string().cuid2()
        })
      )
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
          <ConfirmationLauncher modalId={confirmDeleteId} title="Delete">
            <IconContainerRound>
              <ValidatedForm
                method="POST"
                id={deleteFormId}
                action={crud.routes.index}
                validator={deleteFormValidator}
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

              <IconTrash />
            </IconContainerRound>
          </ConfirmationLauncher>

          {/* Delete Confirmation */}
          <ConfirmationModal
            id={confirmDeleteId}
            formId={deleteFormId}
            confirmButtonText="Delete"
            caption={`Delete ${crud.singular}`}
            body={`Are you sure you want to permanently delete "${info.row.original.name}"?`}
          />
        </>
      )}
    </>
  );
};
