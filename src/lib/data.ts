import { Briefcase, Users, Target, DollarSign, TrendingUp, UserCheck } from "lucide-react"

export const metricCards = [
  {
    title: "Total No of Projects",
    value: "90/125",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: Briefcase,
    color: "bg-blue-500",
  },
  {
    title: "Total No of Clients",
    value: "69/86",
    change: "-11.2%",
    changeType: "negative" as const,
    icon: Users,
    color: "bg-blue-400",
  },
  {
    title: "Total No of Tasks",
    value: "225/28",
    change: "+11.2%",
    changeType: "positive" as const,
    icon: Target,
    color: "bg-pink-500",
  },
  {
    title: "Earnings",
    value: "$21445",
    change: "+10.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "bg-purple-500",
  },
  {
    title: "Profit This Week",
    value: "$5,544",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: TrendingUp,
    color: "bg-red-500",
  },
  {
    title: "Job Applicants",
    value: "98",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: Users,
    color: "bg-green-500",
  },
  {
    title: "New Hire",
    value: "45/48",
    change: "-11.2%",
    changeType: "negative" as const,
    icon: UserCheck,
    color: "bg-gray-800",
  },
  {
    title: "Attendance Overview",
    value: "120/154",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: UserCheck,
    color: "bg-orange-500",
  },
]

export const departmentData = [
  { name: "SALES", employees: 3, color: "bg-orange-400" },
  { name: "Development", employees: 5, color: "bg-orange-400" },
  { name: "Management", employees: 3, color: "bg-orange-400" },
  { name: "ASSISTANT", employees: 2, color: "bg-orange-400" },
  { name: "Testing", employees: 1, color: "bg-orange-400" },
  { name: "Marketing", employees: 2, color: "bg-orange-400" },
]

export const clockInData = [
  {
    name: "Daniel Esbella",
    role: "UI/UX Designer",
    time: "06:15",
    avatar: "/avatar-1.jpg",
    status: "in" as const,
  },
  {
    name: "Doglas Martini",
    role: "Project Manager",
    time: "06:30",
    avatar: "/avatar-2.jpg",
    status: "in" as const,
  },
  {
    name: "Brian Villalobos",
    role: "PHP Developer",
    time: "06:15",
    avatar: "/avatar-3.jpg",
    status: "in" as const,
  },
]
