import { LayoutDashboard, UserCheck, AlertTriangle, type LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const ManagerSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/manager",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Operations",
    items: [
      {
        title: "Examiner Assignment",
        url: "/manager/assignment",
        icon: UserCheck,
      },
      {
        title: "Violation Management",
        url: "/manager/violations",
        icon: AlertTriangle,
      },
    ],
  },
];
