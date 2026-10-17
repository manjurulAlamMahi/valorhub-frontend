import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationMenu } from "@/data/navigation-menu";
import { cn } from "@/lib/utils";
import { TextAlignJustify } from "lucide-react";
import { NavLink } from "react-router";
import CallToAction from "./call-to-action";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger>
        <TextAlignJustify />
      </SheetTrigger>
      <SheetContent className="items-center justify-between p-2">
        <div className="flex w-full flex-col items-start gap-5 p-8">
          {navigationMenu.map((item) => (
            <SheetClose key={item.id}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn("relative py-1 text-2xl font-semibold", {
                    "text-primary before:bg-primary/50 before:absolute before:bottom-0 before:h-1 before:w-full":
                      isActive,
                  })
                }
              >
                {item.label}
              </NavLink>
            </SheetClose>
          ))}
        </div>

        <CallToAction />
      </SheetContent>
    </Sheet>
  );
}
