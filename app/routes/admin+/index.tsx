import { NavLink } from "@remix-run/react";

export default function AdminIndexPage() {
  return (
    <>
      <p>Admin index/dashboard.</p>
      <br />

      <ul className="list-disc">
        <li>
          <NavLink
            to="/admin/notes"
            className="text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 selected:text-blue-500"
          >
            Notes
          </NavLink>
        </li>
      </ul>
    </>
  );
}
