import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";

import { AdminPageTitleList } from "~/components/admin/page-title-list";
import { getLanguages } from "~/models/language.server";

export const loader = async () => {
  const languages = await getLanguages();
  return json({ languages });
};

export default function AdminLanguageIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <AdminPageTitleList model="Languages" />

      <ol>
        {data.languages.map((language) => (
          <li key={language.id}>
            <NavLink
              className={({ isActive }) =>
                `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
              }
              to="notes/{language.id}"
            >
              📝 {language.name}
            </NavLink>
          </li>
        ))}
      </ol>
    </>
  );
}
