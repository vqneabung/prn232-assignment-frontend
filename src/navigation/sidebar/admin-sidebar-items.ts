import {
  LayoutDashboard,
  Users,
  GraduationCap,
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

export const AdminSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "System Management",
    items: [
      {
        title: "Classes",
        url: "/admin/system/classes",
        icon: Users,
      },
      {
        title: "Students",
        url: "/admin/system/students",
        icon: GraduationCap,
      },
    ],
  },
];
