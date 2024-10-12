import { useLoaderData } from "@remix-run/react";

import { DashboardCounterCard } from "#app/components/backend/dashboard/counter-card";
import { IconCog } from "#app/components/icons/icon-cog";
import { prisma } from "#app/utils/db.server";

export const loader = async () => {
  const userCount = await prisma.user.count();

  return { userCount };
};

export default function AdminIndexPage() {
  const { userCount } = useLoaderData<typeof loader>();

  return (
    <>
      {/* CounterCard Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-4 lg:gap-5">
        <DashboardCounterCard title="Movies" count={1214} icon={<IconCog />} />
        <DashboardCounterCard title="Actors" count={29} icon={<IconCog />} />
        <DashboardCounterCard
          title="Directors"
          count={123}
          icon={<IconCog />}
        />
        <DashboardCounterCard
          title="Users"
          count={userCount}
          icon={<IconCog />}
        />
      </div>
      {/* End CounterCard Grid */}
    </>
  );
}
