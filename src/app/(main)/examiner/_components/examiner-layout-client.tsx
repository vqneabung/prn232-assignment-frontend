"use client";

import { ReactNode } from "react";

import { AppShell } from "@/app/(main)/shared/app-shell";
import { UserAppSidebar } from "./sidebar/app-sidebar";
import type {
  SidebarVariant,
  SidebarCollapsible,
  ContentLayout,
  NavbarStyle,
} from "@/types/preferences/layout";

interface ExaminerLayoutClientProps {
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

export function ExaminerLayoutClient({
  defaultOpen,
  sidebarVariant,
  sidebarCollapsible,
  layoutPreferences,
  children,
}: ExaminerLayoutClientProps) {
  return (
    <AppShell
      defaultOpen={defaultOpen}
      sidebarComponent={<UserAppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />}
      layoutPreferences={layoutPreferences}
    >
      {children}
    </AppShell>
  );
}
