"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Lock,
  Settings,
  Menu,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/authContext/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarNavItems } from "@/data/utilis/navbar";

export default function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Gestion de la réactivité
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Rendu du contenu de la sidebar
  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <span className="text-lg font-semibold">DocCollab</span>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-1 p-2">
          {sidebarNavItems.map((item) => {
            const buttonContent = (
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && !isMobile && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5" />
                {(!isCollapsed || isMobile) && (
                  <span className="ml-2">{item.title}</span>
                )}
              </Button>
            );

            return isMobile ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSheetOpen(false)}
              >
                {buttonContent}
              </Link>
            ) : (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>{buttonContent}</Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Themes */}
        <div className="flex gap-2 items-center justify-center mt-4">
          {(!isCollapsed || isMobile) && (
            <div className="bg-secondary px-6 py-2 rounded-full">
              Mode{" "}
              <span className="font-bold">
                {theme === "dark" ? "Sombre" : "Clair"}
              </span>
            </div>
          )}
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Passer en mode {theme === "dark" ? "clair" : "sombre"}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* User menu */}
        {user && (
          <div className="flex gap-2 items-center justify-center mt-4">
            <div className="flex items-center gap-2">
              <img
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
                src={user.photoURL}
                alt={user.displayName}
              />
              {(!isCollapsed || isMobile) && (
                <span className="text-sm">{user.displayName}</span>
              )}
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </ScrollArea>
    </>
  );

  // Rendu conditionnel pour mobile et desktop
  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-opacity-80 dark:bg-slate-700"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-full">{SidebarContent()}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Rendu pour desktop
  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative border-r bg-background transition-all duration-300 hidden md:block",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {SidebarContent()}
      </div>
    </TooltipProvider>
  );
}
