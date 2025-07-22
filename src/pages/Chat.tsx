import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Chat() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Chat</h1>
      <Card>
        <CardHeader>
          <CardTitle>Chat Application</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chat functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
