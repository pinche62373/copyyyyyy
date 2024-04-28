import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getNoteListItems } from "#app/models/note.server";
import { requireUserId } from "#app/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
};

export default function NotesLayout() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div
        className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between"
        aria-label="Global"
      >
        <main className="flex h-full bg-white">
          <div className="h-full w-80 border-r bg-gray-50">
            <Link to="new" className="block p-4 text-xl text-blue-500">
              + New Note
            </Link>

            <hr />

            {data.noteListItems.length === 0 ? (
              <p className="p-4">No notes yet</p>
            ) : (
              <ol>
                {data.noteListItems.map((note) => (
                  <li key={note.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                      }
                      to={note.id}
                    >
                      📝 {note.title}
                    </NavLink>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
