import { ChevronDown, Calendar, Home } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { WelcomeCard } from "@/components/ui/welcome-card";
import { StatusCard } from "@/components/ui/status-card";
import { DepartmentChart } from "@/components/ui/department-chart";
import { ClockInCard } from "@/components/ui/clock-in-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { metricCards, departmentData, clockInData } from "@/lib/data";

export default function AdminDashboard() {
  const statusItems = [
    { label: "Fulltime", value: 112, color: "bg-yellow-400", percentage: 48 },
    { label: "Contract", value: 28, color: "bg-slate-600", percentage: 20 },
  ];

  const handleAddProject = () => {
    console.log("Add Project clicked");
  };

  const handleAddCompanies = () => {
    console.log("Add Companies clicked");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
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
      <WelcomeCard
        userName="Admin"
        userAvatar="/avatar-1.jpg"
        pendingApprovals={21}
        leaveRequests={14}
        primaryAction={{
          label: "Add Project",
          onClick: handleAddProject,
        }}
        secondaryAction={{
          label: "Add Companies",
          onClick: handleAddCompanies,
        }}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, index) => (
          <MetricCard
            key={index}
            {...card}
            onActionClick={() => console.log(`${card.title} clicked`)}
          />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatusCard
          title="Employee Status"
          totalLabel="Total Employee"
          totalValue={154}
          badgeText="This Week"
          items={statusItems}
        />

        <StatusCard
          title="Attendance Overview"
          totalLabel="Total Attendance"
          totalValue={120}
          badgeText="Today"
          items={[]}
          showChart={false}
        />

        <DepartmentChart
          title="Employees By Department"
          badgeText="This Week"
          data={departmentData}
          maxEmployees={10}
          growthText="No of Employees increased by +20% from last Week"
        />
      </div>

      {/* Clock In/Out Section */}
      <ClockInCard
        title="Clock-In/Out"
        subtitle="All Departments"
        badgeText="Today"
        employees={clockInData}
      />
    </div>
  );
}
