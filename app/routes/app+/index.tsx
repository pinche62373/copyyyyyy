import { Link } from "react-router";
import { UpstreamLogo } from "#app/ui/upstream/logo.tsx";
import { useOptionalUser } from "#app/utils/user";

export default function IndexPage() {
  // TODO : remove when done
  // const user = useOptionalUser();
  // console.log(JSON.stringify(user, null, 2));

  return (
    <div className="w-4/5 mx-auto flex flex-col mt-28 ">
      <div className="flex items-center justify-center ">
        <Link
          to="/movies"
          className="mr-4 rounded-md border border-transparent px-4 py-3 text-base font-medium bg-yellow-400 shadow-sm hover:bg-yellow-300 sm:px-8"
        >
          Private app page
        </Link>
      </div>
    </div>
  );
}
