import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Completed() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Completed Projects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Completed Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p>View completed projects here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
