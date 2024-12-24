import { Menu, MenuItem } from "@szhsin/react-menu";
import { Icon } from "#app/components/ui/icon.tsx";
import { cn } from "#app/utils/lib/cn.ts";

type Filter = "all" | "model" | "route";

interface Args {
  onClick: (e: Filter) => void;
}

export const PermissionTypeFilterComponent = ({ onClick }: Args) => {
  const menuItemClass = cn(
    "whitespace-nowrap rounded-lg text-xs",
    "text-gray-800  hover:bg-gray-100",
    "dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800",
  );

  return (
    <>
      <div className="mr-5">
        <Menu
          onItemClick={(e) => onClick(e.value)}
          defaultValue={"all"}
          menuButton={
            <button
              type="button"
              className={cn(
                "clear-both inline-flex size-[38px] items-center justify-center gap-x-2",
                "border border-transparent",
                "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                "text-secondary-foreground hover:bg-transparent hover:text-primary-foreground",
              )}
            >
              <Icon name="sliders-horizontal">Filter</Icon>
            </button>
          }
          position="anchor"
          transition
        >
          <MenuItem className={menuItemClass} value="all">
            All Permissions
          </MenuItem>

          <MenuItem className={menuItemClass} value="model">
            Model Permissions
          </MenuItem>
          <MenuItem className={menuItemClass} value={"route"}>
            Route Permissions
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};
