"use client";

import { NavMain } from "@/app/(main)/shared/sidebar/nav-main";
import { NavUser } from "@/app/(main)/shared/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { AdminSidebarItems } from "@/navigation/sidebar/admin-sidebar-items";

interface AdminAppSidebarProps {
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export function AdminAppSidebar({ variant = "sidebar", collapsible = "icon" }: AdminAppSidebarProps) {
  return (
    <Sidebar variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="text-xs font-bold">A</span>
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={AdminSidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: "Admin", email: "admin@example.com", avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
