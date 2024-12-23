import { zodResolver } from "@hookform/resolvers/zod";
import { CellContext } from "@tanstack/react-table";
import { useRef } from "react";
import { Form, NavLink } from "react-router";
import { useRemixForm } from "remix-hook-form";
import zod, { z } from "zod";
import { IconContainerRound } from "#app/components/icon-container-round";
import { Confirm } from "#app/components/shared/confirm.tsx";
import { Icon } from "#app/ui/icon.tsx";
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
  // edit
  const editUrl = `${info.row.original.id}/edit`;

  // delete
  actions.delete = true; // temporarily enable for all
  const intent = "delete" as const;
  const formRef = useRef<HTMLFormElement>(null);

  const deleteSchema = z
    .object({
      intent: z.literal(intent),
    })
    .catchall(
      z.object({
        id: z.string().min(1).cuid2(),
      }),
    );

  const resolver = zodResolver(deleteSchema);

  type FormData = zod.infer<typeof deleteSchema>;

  const { register, handleSubmit } = useRemixForm<FormData>({
    mode: "onBlur",
    resolver,
    //@ts-expect-error: TODO fix if still exists with remix-hook-form RR7
    defaultValues: {
      intent,
      [crud.singular]: {
        id: info.row.original.id,
      },
    },
  });

  return (
    <>
      {/* Edit Button */}
      {actions.edit && (
        <NavLink to={editUrl} title="Edit">
          <IconContainerRound>
            <Icon name="pencil" />
          </IconContainerRound>
        </NavLink>
      )}

      {/* Optional Delete Button  */}
      {actions.delete === true && (
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

            <Confirm.Modal
              heading={`Delete ${crud.singular}`}
              formRef={formRef}
            >
              {`Are you sure you want to permanently delete "${info.row.original.name}"?`}
            </Confirm.Modal>
          </Confirm>
        </>
      )}
    </>
  );
};
