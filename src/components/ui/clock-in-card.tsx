import { Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClockInEmployee {
  name: string
  role: string
  time: string
  avatar: string
  status: "in" | "out"
}

interface ClockInCardProps {
  title: string
  subtitle: string
  badgeText: string
  employees: ClockInEmployee[]
}

export function ClockInCard({ title, subtitle, badgeText, employees }: ClockInCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{subtitle}</span>
          <Badge variant="outline">{badgeText}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Badge
                  variant="secondary"
                  className={employee.status === "in" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                >
                  {employee.time}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
