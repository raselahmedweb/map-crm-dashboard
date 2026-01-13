import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteLabourMutation,
  useGetLaboursWithDetailsQuery,
} from "@/redux/api/baseApi";
import { Building2, Loader2 } from "lucide-react";
import type { ILabour } from "@/types/types";
import CreateLabour from "@/components/CreateLabour";

export default function Labour() {
  const [showLabourForm, setShowLabourForm] = useState(false);

  const { data: LabourData, isLoading } = useGetLaboursWithDetailsQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const [deleteLabour] = useDeleteLabourMutation();

  const Labours: ILabour[] = LabourData?.data?.item || [];
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading Labour...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Labour Management</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Total: {LabourData.data.total}
          </Badge>
        </div>
      </div>

      {/* Floor Plans Table */}
      <Card>
        <CardHeader className="flex items-center justify-between px-3">
          <CardTitle>All Labour</CardTitle>
          <Button onClick={() => setShowLabourForm(true)}>Add Labour</Button>
        </CardHeader>
        <CardContent>
          {LabourData.data.total === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No Labour found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="divide-x divide-y border">
                <TableHeader>
                  <TableRow className="divide-x divide-y">
                    <TableHead>Label</TableHead>
                    <TableHead>Shape</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Copies</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Labours.map((labour) => {
                    return (
                      <TableRow className="divide-x divide-y" key={labour._id}>
                        <TableCell>
                          <div>
                            <p className="max-w-xs truncate">{labour.label}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="max-w-xs truncate">{labour.shape}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="w-4 h-4">
                            <p className="max-w-xs truncate">{labour.color}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="max-w-xs truncate">{labour.price}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="max-w-xs truncate">{labour.copies}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => deleteLabour(labour._id)}
                              size="sm"
                              variant="destructive"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {showLabourForm && (
        <CreateLabour
          action={{
            onClick: () => setShowLabourForm(false),
          }}
        />
      )}
    </div>
  );
}
