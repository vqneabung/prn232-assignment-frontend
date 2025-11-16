"use client";

import { ReactNode } from "react";

import { AppShell } from "@/app/(main)/shared/app-shell";
import { ManagerAppSidebar } from "./sidebar/app-sidebar";
import type {
  SidebarVariant,
  SidebarCollapsible,
  ContentLayout,
  NavbarStyle,
} from "@/types/preferences/layout";

interface ManagerLayoutClientProps {
  defaultOpen: boolean;
  sidebarVariant: SidebarVariant;
  sidebarCollapsible: SidebarCollapsible;
  layoutPreferences: {
    contentLayout: ContentLayout;
    variant: SidebarVariant;
    collapsible: SidebarCollapsible;
    navbarStyle: NavbarStyle;
  };
  children: ReactNode;
}

export function ManagerLayoutClient({
  defaultOpen,
  sidebarVariant,
  sidebarCollapsible,
  layoutPreferences,
  children,
}: ManagerLayoutClientProps) {
  return (
    <AppShell
      defaultOpen={defaultOpen}
      sidebarComponent={<ManagerAppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />}
      layoutPreferences={layoutPreferences}
    >
      {children}
    </AppShell>
  );
}
