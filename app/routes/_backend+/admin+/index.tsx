import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { DashboardCounterCard } from "#app/components/backend/dashboard/counter-card";
import { Icon } from "#app/components/ui/icon.tsx";
import { prisma } from "#app/utils/db.server";
import { requireRoutePermission } from "#app/utils/permissions.server.ts";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const userCount = await prisma.user.count();

  return { userCount };
};

export default function AdminIndexPage() {
  const { userCount } = useLoaderData<typeof loader>();

  return (
    <>
      {/* CounterCard Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-4 lg:gap-5">
        <DashboardCounterCard
          title="Movies"
          count={1214}
          icon={<Icon name="settings" />}
        />
        <DashboardCounterCard
          title="Actors"
          count={29}
          icon={<Icon name="settings" />}
        />
        <DashboardCounterCard
          title="Directors"
          count={123}
          icon={<Icon name="settings" />}
        />
        <DashboardCounterCard
          title="Users"
          count={userCount}
          icon={<Icon name="settings" />}
        />
      </div>
      {/* End CounterCard Grid */}
    </>
  );
}
