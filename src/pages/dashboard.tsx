import {
  Bell,
  ChevronDown,
  Clock,
  DollarSign,
  FileText,
  Home,
  Mail,
  Search,
  Settings,
  Users,
  Briefcase,
  Target,
  TrendingUp,
  UserCheck,
  Plus,
  Calendar,
  UserRound,
  Box,
  Building,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    isActive: true,
    subItems: [
      { title: "Admin Dashboard", isActive: true },
      { title: "Employee Dashboard" },
      { title: "Items Dashboard" },
    ],
  },
  {
    title: "Applications",
    icon: FileText,
    subItems: [
      { title: "Chat", isActive: true },
      { title: "Email" },
      { title: "Todo" },
    ],
  },
  {
    title: "Companies",
    icon: Building,
    subItems: [{ title: "Companies", isActive: true }, { title: "Clients" }],
  },

  {
    title: "Projects",
    icon: Box,
    subItems: [
      { title: "Projects", isActive: true },
      { title: "Floor Plan" },
      { title: "Completed" },
    ],
  },

  {
    title: "User Management",
    icon: UserRound,
    subItems: [
      { title: "Leave requests", isActive: true },
      { title: "Clock-In/Clock-Out" },
    ],
  },
  {
    title: "Admin",
    icon: Settings,
    subItems: [],
  },
];

const metricCards = [
  {
    title: "Total No of Projects",
    value: "90/125",
    change: "-2.1%",
    changeType: "negative",
    icon: Briefcase,
    color: "bg-blue-500",
  },
  {
    title: "Total No of Clients",
    value: "69/86",
    change: "-11.2%",
    changeType: "negative",
    icon: Users,
    color: "bg-blue-400",
  },
  {
    title: "Total No of Tasks",
    value: "225/28",
    change: "+11.2%",
    changeType: "positive",
    icon: Target,
    color: "bg-pink-500",
  },
  {
    title: "Earnings",
    value: "$21445",
    change: "+10.2%",
    changeType: "positive",
    icon: DollarSign,
    color: "bg-purple-500",
  },
  {
    title: "Profit This Week",
    value: "$5,544",
    change: "-2.1%",
    changeType: "negative",
    icon: TrendingUp,
    color: "bg-red-500",
  },
  {
    title: "Job Applicants",
    value: "98",
    change: "-2.1%",
    changeType: "negative",
    icon: Users,
    color: "bg-green-500",
  },
  {
    title: "New Hire",
    value: "45/48",
    change: "-11.2%",
    changeType: "negative",
    icon: UserCheck,
    color: "bg-gray-800",
  },
  {
    title: "Attendance Overview",
    value: "120/154",
    change: "+2.1%",
    changeType: "positive",
    icon: UserCheck,
    color: "bg-orange-500",
  },
];

const departmentData = [
  { name: "SALES", employees: 3, color: "bg-orange-400" },
  { name: "Development", employees: 5, color: "bg-orange-400" },
  { name: "Management", employees: 3, color: "bg-orange-400" },
  { name: "ASSISTANT", employees: 2, color: "bg-orange-400" },
  { name: "Testing", employees: 1, color: "bg-orange-400" },
  { name: "Marketing", employees: 2, color: "bg-orange-400" },
];

const clockInData = [
  {
    name: "Daniel Esbella",
    role: "UI/UX Designer",
    time: "06:15",
    avatar: "/avatar-1.jpg",
    status: "in",
  },
  {
    name: "Doglas Martini",
    role: "Project Manager",
    time: "06:30",
    avatar: "/avatar-2.jpg",
    status: "in",
  },
  {
    name: "Brian Villalobos",
    role: "PHP Developer",
    time: "06:15",
    avatar: "/avatar-3.jpg",
    status: "in",
  },
];

export function DashboardLayout() {
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
                      <SidebarMenuButton asChild isActive={item.isActive}>
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
                              isActive={subItem.isActive}
                              className="text-sm"
                            >
                              <div>{subItem.title}</div>
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
                        {/* <item.icon className="h-4 w-4" />
                          <span>{item.title}</span> */}
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
          <main className="flex-1 p-6">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="h-4 w-4" />
                  <span>/</span>
                  <span>Dashboard</span>
                  <span>/</span>
                  <span>Admin Dashboard</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      This week
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>This week</DropdownMenuItem>
                    <DropdownMenuItem>This month</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Welcome Section */}
            <Card className="mb-6">
              <CardContent className="flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/avatar-1.jpg" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Welcome Back, Admin
                    </h2>
                    <p className="text-muted-foreground">
                      You have{" "}
                      <span className="font-medium text-orange-500">21</span>{" "}
                      Pending Approvals &{" "}
                      <span className="font-medium text-orange-500">14</span>{" "}
                      Leave Requests
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                  <Button variant="destructive">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Companies
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((card, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-full p-3 ${card.color}`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        {card.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{card.value}</p>
                        <span
                          className={`text-sm ${
                            card.changeType === "positive"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {card.change}
                        </span>
                      </div>
                      <Button
                        variant="link"
                        className="mt-2 h-auto p-0 text-sm"
                      >
                        View {card.title.includes("Total") ? "All" : "Details"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Employee Status */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Employee Status</CardTitle>
                  <Badge variant="outline">This Week</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Total Employee
                      </p>
                      <p className="text-3xl font-bold">154</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex h-5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="bg-yellow-400"
                          style={{ width: "48%" }}
                        />
                        <div
                          className="bg-slate-600"
                          style={{ width: "20%" }}
                        />
                        <div className="bg-red-500" style={{ width: "20%" }} />
                        <div className="bg-pink-500" style={{ width: "12%" }} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-400" />
                          <span>Fulltime (48%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-slate-600" />
                          <span>Contract (20%)</span>
                        </div>
                        <div className="text-2xl font-bold">112</div>
                        <div className="text-2xl font-bold">112</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Attendance Overview</CardTitle>
                  <Badge variant="outline">Today</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <svg className="h-32 w-32 -rotate-90 transform">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * 0.25}`}
                          className="text-green-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            Total Attendance
                          </p>
                          <p className="text-xl font-bold">120</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employees By Department */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Employees By Department</CardTitle>
                  <Badge variant="outline">This Week</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentData.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{dept.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${dept.color}`}
                              style={{
                                width: `${(dept.employees / 10) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {dept.employees}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 text-xs text-muted-foreground">
                      <span className="text-orange-500">●</span> No of Employees
                      increased by{" "}
                      <span className="font-medium text-orange-500">+20%</span>{" "}
                      from last Week
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clock In/Out Section */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Clock-In/Out</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    All Departments
                  </span>
                  <Badge variant="outline">Today</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clockInData.map((employee, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={employee.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {employee.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          {employee.time}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
