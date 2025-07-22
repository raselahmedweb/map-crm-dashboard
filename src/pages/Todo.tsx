import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Todo() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Todo</h1>
      <Card>
        <CardHeader>
          <CardTitle>Todo Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Todo functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
