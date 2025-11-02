"use client";

import { NavMain } from "@/app/(main)/shared/sidebar/nav-main";
import { NavUser } from "@/app/(main)/shared/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { ManagerSidebarItems } from "@/navigation/sidebar/manager-sidebar-items";

interface ManagerAppSidebarProps {
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export function ManagerAppSidebar({
  variant = "sidebar",
  collapsible = "icon",
}: ManagerAppSidebarProps) {
  return (
    <Sidebar variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="text-xs font-bold">M</span>
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Manager</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ManagerSidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: "Manager", email: "manager@example.com", avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
