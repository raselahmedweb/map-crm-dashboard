import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FloorPlan() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Floor Plan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Floor Plan Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Floor plan functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
