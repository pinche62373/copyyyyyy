import { NavLink } from "@remix-run/react";

interface PropTypes {
  cancelLink: string;
}

export const AdminFormButtons = ({ cancelLink }: PropTypes) => {
  return (
    <div className="flex justify-end gap-x-2 pt-2">
      <div className="w-full flex justify-end items-center gap-x-2">
        <NavLink to={cancelLink}>
          <button
            type="button"
            className="py-2 px-3 inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            Cancel
          </button>
        </NavLink>

        <button
          type="submit"
          className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  );
};
