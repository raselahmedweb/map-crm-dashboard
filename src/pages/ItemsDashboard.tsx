import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ItemsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Items Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Items Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the items dashboard page.</p>
        </CardContent>
      </Card>
    </div>
  )
}
