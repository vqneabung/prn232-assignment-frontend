import { ShieldAlert, LayoutDashboard, MessageCircle, CheckCircle2, type LucideIcon } from "lucide-react";

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
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/moderator",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Monitoring",
    items: [
      {
        title: "Detect Violations",
        url: "/moderator/detect/violations",
        icon: ShieldAlert,
      },
      {
        title: "Complaint Handling",
        url: "/moderator/complaints",
        icon: MessageCircle,
      },
      {
        title: "Zero-Point Verification",
        url: "/moderator/verification",
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: 3,
    label: "Configuration",
    items: [
      {
        title: "Rules",
        url: "/moderator/rules",
        icon: ShieldAlert,
      },
    ],
  },
];
