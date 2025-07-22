import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LeaveRequests() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Leave Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Leave Request Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage leave requests here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
