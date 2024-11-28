import {
  FolderOpen,
  LayoutDashboard,
  Lock,
  Settings,
  Users,
} from "lucide-react";

export const sidebarNavItems = [
  {
    title: "Vue d'ensemble des projets",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Documents partagés",
    href: "/shared",
    icon: FolderOpen,
  },
  {
    title: "Documents privés",
    href: "/private",
    icon: Lock,
  },
  {
    title: "Gestion de l'équipe",
    href: "/team",
    icon: Users,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];
