import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Projects() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your projects here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
