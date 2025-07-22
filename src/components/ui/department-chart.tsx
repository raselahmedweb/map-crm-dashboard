import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DepartmentData {
  name: string
  employees: number
  color: string
}

interface DepartmentChartProps {
  title: string
  badgeText: string
  data: DepartmentData[]
  maxEmployees?: number
  growthText?: string
}

export function DepartmentChart({ title, badgeText, data, maxEmployees = 10, growthText }: DepartmentChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="outline">{badgeText}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((dept, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{dept.name}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 rounded-full bg-muted">
                  <div
                    className={`h-2 rounded-full ${dept.color}`}
                    style={{
                      width: `${(dept.employees / maxEmployees) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{dept.employees}</span>
              </div>
            </div>
          ))}
          {growthText && (
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-orange-500">●</span> {growthText}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
