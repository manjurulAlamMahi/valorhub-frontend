import { navigationMenu } from "@/data/navigation-menu";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

export default function NavBar() {
  return (
    <nav className="bg-muted flex justify-center max-md:hidden">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between py-6 max-lg:px-4">
        {navigationMenu.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            className={({ isActive }) =>
              cn("text-accent text-base leading-6 font-medium", {
                "text-primary": isActive,
              })
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
