import { Link } from "react-router";
import { Icon } from "#app/components/ui/icon.tsx";
import { useOptionalUser } from "#app/utils/user";

export default function IndexPage() {
  // TODO : remove when done
  // const user = useOptionalUser();
  // console.log(JSON.stringify(user, null, 2));

  return (
    <main className="relative mt-20 align-middle sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply" />
            </div>
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-yellow-500 drop-shadow-md">
                  <Icon name="home">Indie Stack</Icon>
                </span>
              </h1>

              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <Link
                  to="/movies"
                  className="mr-4 flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                >
                  View movies
                </Link>
              </div>
              <img
                src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                alt="Remix"
                className="mx-auto mt-16 w-full max-w-48 md:max-w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
