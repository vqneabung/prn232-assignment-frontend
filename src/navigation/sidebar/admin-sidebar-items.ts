import {
  LayoutDashboard,
  Settings,
  BookOpen,
  Calendar,
  ClipboardList,
  CheckCircle2,
  Download,
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
        title: "Subjects",
        url: "/admin/system/subjects",
        icon: BookOpen,
      },
      {
        title: "Semesters",
        url: "/admin/system/semesters",
        icon: Calendar,
      },
      {
        title: "Exams",
        url: "/admin/system/exams",
        icon: ClipboardList,
      },
    ],
  },
  {
    id: 3,
    label: "Operations",
    items: [
      {
        title: "Results Approval",
        url: "/admin/approval",
        icon: CheckCircle2,
      },
      {
        title: "Report Export",
        url: "/admin/reports",
        icon: Download,
      },
    ],
  },
];
