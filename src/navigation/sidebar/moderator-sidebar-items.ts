import {
  ShieldAlert,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

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

export const ModeratorSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Moderation",
    items: [
      {
        title: "Detect Violations",
        url: "/moderator/detect/violations",
        icon: ShieldAlert,
      },
      {
        title: "Dashboard",
        url: "/moderator/dashboard",
        icon: LayoutDashboard,
        comingSoon: true,
      },
    ],
  },
];
