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
import { useGetDevicesWithDetailsQuery } from "@/redux/api/baseApi";
import { Building2, Loader2 } from "lucide-react";
import type { IDevice } from "@/types/types";
import CreateDevice from "@/components/CreateDevice";

export default function Device() {
  const [showDeviceForm, setShowDeviceForm] = useState(false);

  const { data: deviceData, isLoading } = useGetDevicesWithDetailsQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const devices: IDevice[] = deviceData?.data?.item || [];
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading Device...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Device Management</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Total: {deviceData.data.total}
          </Badge>
        </div>
      </div>

      {/* Floor Plans Table */}
      <Card>
        <CardHeader className="flex items-center justify-between px-3">
          <CardTitle>All Device</CardTitle>
          <Button onClick={() => setShowDeviceForm(true)}>Create Device</Button>
        </CardHeader>
        <CardContent>
          {deviceData.data.total === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No Device found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="divide-x divide-y border">
                <TableHeader>
                  <TableRow className="divide-x divide-y">
                    <TableHead>Label</TableHead>
                    <TableHead>Shape</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Copies</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => {
                    return (
                      <TableRow className="divide-x divide-y" key={device._id}>
                        <TableCell>
                          <div>
                            <p className="max-w-xs truncate">{device.label}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="max-w-xs truncate">{device.shape}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="max-w-xs truncate">{device.price}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="max-w-xs truncate">{device.copies}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="destructive">
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
      {showDeviceForm && (
        <CreateDevice
          action={{
            onClick: () => setShowDeviceForm(false),
          }}
        />
      )}
    </div>
  );
}
