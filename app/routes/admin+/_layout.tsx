import { AdminSidebar } from "~/components/admin/sidebar";
import { Main } from "~/components/main";
import { Navbar } from "~/components/navbar";

export default function MoviesPage() {
  return (
    <>
      <Navbar />
      <AdminSidebar />

      <Main />
    </>
  );
}
