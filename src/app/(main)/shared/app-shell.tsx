import { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { SidebarVariant, SidebarCollapsible, ContentLayout, NavbarStyle } from "@/types/preferences/layout";

import { LayoutControls } from "./sidebar/layout-controls";
import { SearchDialog } from "./sidebar/search-dialog";
import { ThemeSwitcher } from "./sidebar/theme-switcher";

interface AppShellProps {
  readonly defaultOpen: boolean;
  readonly sidebarComponent: React.ReactNode;
  readonly layoutPreferences: {
    contentLayout: ContentLayout;
    variant: SidebarVariant;
    collapsible: SidebarCollapsible;
    navbarStyle: NavbarStyle;
  };
  readonly children: React.ReactNode;
}

export function AppShell({ defaultOpen, sidebarComponent, layoutPreferences, children }: AppShellProps) {
  const { contentLayout, variant, collapsible, navbarStyle } = layoutPreferences;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {sidebarComponent}
      <SidebarInset
        data-content-layout={contentLayout}
        className={cn(
          "data-[content-layout=centered]:mx-auto! data-[content-layout=centered]:max-w-screen-2xl",
          "max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!",
        )}
      >
        <header
          data-navbar-style={navbarStyle}
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            "data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
              <SearchDialog />
            </div>
            <div className="flex items-center gap-2">
              <LayoutControls
                variant={variant}
                collapsible={collapsible}
                contentLayout={contentLayout}
                navbarStyle={navbarStyle}
              />
              <ThemeSwitcher />
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
