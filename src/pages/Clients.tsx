import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Clients() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Clients</h1>
      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your clients here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
