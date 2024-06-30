import { Form, NavLink } from "@remix-run/react";
import { CellContext } from "@tanstack/react-table";

import { FormInputHidden } from "#app/components/admin/form/form-input-hidden";
import { ConfirmationLauncher } from "#app/components/confirmation-launcher";
import { ConfirmationModal } from "#app/components/confirmation-modal";
import { IconContainerRound } from "#app/components/icon-container-round";
import { IconEdit } from "#app/components/icons/icon-edit";
import { IconTrash } from "#app/components/icons/icon-trash";
import { Crud } from "#app/utils/crud";

// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
interface PropTypes {
  info: CellContext<any, string>;
  crud: Crud;
  actions: {
    edit: boolean;
    delete: boolean;
  };
}

export const getCellActionIcons = ({ info, crud, actions }: PropTypes) => {
  const editUrl = `${info.row.original.id}/edit`;
  const deleteFormId = "delete-form-" + info.row.original.id;
  const confirmDeleteId = "confirm-" + deleteFormId;

  return (
    <>
      {/* Edit Button */}
      {actions.edit && (
        <IconContainerRound>
          <NavLink to={editUrl} title="Edit">
            <IconEdit />
          </NavLink>
        </IconContainerRound>
      )}

      {/* Optional Delete Button  */}
      {actions.delete === true && (
        <>
          <IconContainerRound>
            <Form method="POST" id={deleteFormId} action={crud.routes.index}>
              <FormInputHidden name="intent" value="delete" />
              <FormInputHidden name="id" value={info.row.original.id} />

              <ConfirmationLauncher modalId={confirmDeleteId} title="Delete">
                <IconTrash />
              </ConfirmationLauncher>
            </Form>
          </IconContainerRound>

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
