import { Form, NavLink } from "@remix-run/react";
import { CellContext } from "@tanstack/react-table";

import { AdminFormFieldHidden } from "#app/components/admin/form";
import { ConfirmationLauncher } from "#app/components/confirmation-launcher";
import { ConfirmationModal } from "#app/components/confirmation-modal";
import { IconEdit } from "#app/components/icons/icon-edit";
import { IconTrash } from "#app/components/icons/icon-trash";

// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
interface PropTypes {
  info: CellContext<any, string>;
  crud: {
    target: string;
    singular: string;
    plural: string;
  };
}

export const getCellActionIcons = ({ info, crud }: PropTypes) => {
  const deleteFormId = "delete-form-" + info.row.original.id;
  const confirmDeleteId = "confirm-" + deleteFormId;

  return (
    <>
      {/* Edit Button */}
      <div className="inline-flex items-center -space-x-px">
        <NavLink to={info.row.original.id}>
          <button className="size-8 inline-flex justify-center items-center gap-x-2 font-medium rounded-s-lg border border-stone-200 bg-white text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
            <IconEdit className="flex-shrink-0 size-3.5" />
          </button>
        </NavLink>
      </div>
      {/* End Edit Button */}

      {/* Delete Button */}
      <div className="inline-flex items-center -space-x-px">
        <Form method="POST" id={deleteFormId} action={crud.target}>
          <AdminFormFieldHidden name="intent" value="delete" />
          <AdminFormFieldHidden name="id" value={info.row.original.id} />

          <ConfirmationLauncher
            modalId={confirmDeleteId}
            className="size-8 inline-flex justify-center items-center gap-x-2 font-medium rounded-r-lg border border-stone-200 bg-white text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  hover:fill-red-500"
          >
            <IconTrash className="flex-shrink-0 size-3.5" />
          </ConfirmationLauncher>
        </Form>
      </div>
      {/* End Delete Button */}

      {/* Delete Confirmation */}
      <ConfirmationModal
        modalId={confirmDeleteId}
        formId={deleteFormId}
        confirmButtonText="Delete"
        caption={`Delete ${crud.singular}`}
        body={`Are you sure you want to permanently delete "${info.row.original.name}"?`}
      />
    </>
  );
};
