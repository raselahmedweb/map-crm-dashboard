import type React from "react";
import { Link, useLocation } from "react-router";
import {
  Bell,
  Search,
  Mail,
  Home,
  FileText,
  Building,
  Box,
  UserRound,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    badge: "Hot",
    subItems: [
      { title: "Admin Dashboard", href: "/" },
      { title: "Employee Dashboard", href: "/employee-dashboard" },
      { title: "Items Dashboard", href: "/items-dashboard" },
    ],
  },
  {
    title: "Applications",
    icon: FileText,
    subItems: [
      { title: "Chat", href: "/chat" },
      { title: "Email", href: "/email" },
      { title: "Todo", href: "/todo" },
    ],
  },
  {
    title: "Companies",
    icon: Building,
    subItems: [
      { title: "Companies", href: "/companies" },
      { title: "Clients", href: "/clients" },
    ],
  },
  {
    title: "Projects",
    icon: Box,
    subItems: [
      { title: "Projects", href: "/projects" },
      { title: "Floor Plan", href: "/floor-plan" },
      { title: "Completed", href: "/completed" },
    ],
  },
  {
    title: "User Management",
    icon: UserRound,
    subItems: [
      { title: "Leave requests", href: "/leave-requests" },
      { title: "Clock-In/Clock-Out", href: "/clock-in-out" },
    ],
  },
  {
    title: "Admin",
    icon: Settings,
    subItems: [],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-black text-white">
                <img src="/fav-icon.png" alt="geeksblock" className="h-8 w-8" />
              </div>
              <span className="text-lg font-semibold">GEEKSBLOCK</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Main Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="destructive"
                              className="ml-auto text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </SidebarMenuButton>
                      {item.subItems.length > 0 && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuButton
                              key={subItem.title}
                              asChild
                              isActive={location.pathname === subItem.href}
                              className="text-sm"
                            >
                              <Link to={subItem.href}>{subItem.title}</Link>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground tracking-wider">
                Theme
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <div className="flex items-center gap-2">
                        <ModeToggle />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search in HRMS" className="w-80 pl-10" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  Ctrl + /
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                  1
                </Badge>
              </Button>
              <Avatar>
                <AvatarImage src="/avatar-1.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
