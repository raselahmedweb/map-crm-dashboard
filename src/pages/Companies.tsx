import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Companies() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Companies</h1>
      <Card>
        <CardHeader>
          <CardTitle>Company Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your companies here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
