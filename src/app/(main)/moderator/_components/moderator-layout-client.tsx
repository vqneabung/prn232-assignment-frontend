"use client";

import { ReactNode } from "react";

import { AppShell } from "@/app/(main)/shared/app-shell";
import { ModeratorAppSidebar } from "./sidebar/app-sidebar";
import type {
  SidebarVariant,
  SidebarCollapsible,
  ContentLayout,
  NavbarStyle,
} from "@/types/preferences/layout";

interface ModeratorLayoutClientProps {
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

export function ModeratorLayoutClient({
  defaultOpen,
  sidebarVariant,
  sidebarCollapsible,
  layoutPreferences,
  children,
}: ModeratorLayoutClientProps) {
  return (
    <AppShell
      defaultOpen={defaultOpen}
      sidebarComponent={<ModeratorAppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />}
      layoutPreferences={layoutPreferences}
    >
      {children}
    </AppShell>
  );
}
