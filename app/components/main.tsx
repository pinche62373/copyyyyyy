import { Outlet } from "@remix-run/react";

export function Main() {
  return (
    <main className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
      <div className="flex-1 pt-6">
        <Outlet />
      </div>
    </main>
  );
}
