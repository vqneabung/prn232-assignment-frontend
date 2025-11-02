import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
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

export const UserSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Scoring",
    items: [
      {
        title: "Grade",
        url: "/user/grade/list",
        icon: LayoutDashboard,
      },
      {
        title: "CRM",
        url: "/user/crm",
        icon: ChartBar,
      },
      {
        title: "Finance",
        url: "/user/finance",
        icon: Banknote,
      },
    ],
  },
];
