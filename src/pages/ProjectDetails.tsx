import CreateMapForm from "@/components/create-map-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useGetMeQuery,
  useGetSingleProjectQuery,
  useDeleteMapMutation,
  useGetProjectMapQuery,
} from "@/redux/api/baseApi";
import type { IMap } from "@/types/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Trash2, Plus, ArrowLeft, Palette, Map, Eye, Edit } from "lucide-react";
import { toast } from "react-toastify";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showMapForm, setShowMapForm] = useState(false);
  const [activeTab, setActiveTab] = useState("maps");

  const showMapHandler = () => {
    setShowMapForm((p) => !p);
  };

  // API hooks
  const { data: project, isLoading: projectLoading } = useGetSingleProjectQuery(
    id || ""
  );
  const { data: user } = useGetMeQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const { data: mapData, refetch: refetchMaps } = useGetProjectMapQuery(
    id as string,
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const [deleteMap] = useDeleteMapMutation();

  const handleMapSubmit = () => {
    setShowMapForm(false);
    refetchMaps(); // Refresh the maps list
    toast.success("Map created successfully!");
  };

  const handleDeleteMap = async (mapId: string) => {
    try {
      await deleteMap(mapId).unwrap();
      toast.success("Map deleted successfully!");
      refetchMaps();
    } catch (error) {
      toast.error("Failed to delete map");
      console.error("Delete map error:", error);
    }
  };

  const handleStartDesign = (mapId: string) => {
    navigate(`/maps/${mapId}/design`);
  };

  console.log(mapData);

  const maps: IMap[] = mapData?.map || [];

  // Sample data for demonstration
  const devices = [
    {
      id: 1,
      name: "Drone A1",
      type: "Aerial",
      status: "Active",
      lastMaintenance: "2023-10-15",
    },
    {
      id: 2,
      name: "Sensor S2",
      type: "Ground",
      status: "Inactive",
      lastMaintenance: "2023-09-22",
    },
    {
      id: 3,
      name: "GPS Unit",
      type: "Navigation",
      status: "Maintenance",
      lastMaintenance: "2023-11-05",
    },
  ];

  const labours = [
    {
      id: 1,
      name: "John Smith",
      role: "Surveyor",
      hours: 40,
      status: "Active",
    },
    {
      id: 2,
      name: "Emma Johnson",
      role: "Technician",
      hours: 35,
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Operator",
      hours: 20,
      status: "On Leave",
    },
  ];

  const finances = [
    {
      id: 1,
      category: "Equipment",
      budget: 15000,
      spent: 12000,
      remaining: 3000,
    },
    { id: 2, category: "Labor", budget: 25000, spent: 18000, remaining: 7000 },
    { id: 3, category: "Software", budget: 5000, spent: 4500, remaining: 500 },
  ];

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Navigation tabs data
  const tabs = [
    {
      id: "maps",
      title: "Maps",
    },
    {
      id: "devices",
      title: "Devices",
    },
    {
      id: "labours",
      title: "Labours",
    },
    {
      id: "finance",
      title: "Finance",
    },
  ];

  const renderTable = () => {
    switch (activeTab) {
      case "maps":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Project Maps</h3>
              <Button
                onClick={() => setShowMapForm(true)}
                className="flex items-center gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Create Map
              </Button>
            </div>
            {maps.length !== 0 ? (
              <div className="text-center py-8 border rounded-md">
                <Map className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No maps yet</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating your first map.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maps.map((map) => (
                    <TableRow key={map._id}>
                      <TableCell className="font-medium">{map.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(map.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStartDesign(map._id)}
                            className="flex items-center gap-1"
                          >
                            <Palette className="h-4 w-4" />
                            Design
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the map and remove all
                                  associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteMap(map._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        );

      case "devices":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Project Devices</h3>
              <Button className="flex items-center gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          device.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : device.status === "Maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {device.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{device.lastMaintenance}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );

      case "labours":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Project Labours</h3>
              <Button className="flex items-center gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Add Labour
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labours.map((labour) => (
                  <TableRow key={labour.id}>
                    <TableCell className="font-medium">{labour.name}</TableCell>
                    <TableCell>{labour.role}</TableCell>
                    <TableCell>{labour.hours}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          labour.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {labour.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );

      case "finance":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Project Finance</h3>
              <Button className="flex items-center gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Add Budget
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finances.map((finance) => (
                  <TableRow key={finance.id}>
                    <TableCell className="font-medium">
                      {finance.category}
                    </TableCell>
                    <TableCell>${finance.budget.toLocaleString()}</TableCell>
                    <TableCell>${finance.spent.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={
                          finance.remaining / finance.budget < 0.2
                            ? "text-red-600 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        ${finance.remaining.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell>
                    $
                    {finances
                      .reduce((sum, item) => sum + item.budget, 0)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell>
                    $
                    {finances
                      .reduce((sum, item) => sum + item.spent, 0)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell>
                    $
                    {finances
                      .reduce((sum, item) => sum + item.remaining, 0)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">
                {project?.data?.name}{" "}
                <span className="text-gray-500 text-lg">
                  {project?.data?.companyId?.name}
                </span>
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Project ID: {project?.data?._id}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/projects")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.title}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>{renderTable()}</CardContent>
      </Card>

      {/* Create Map Form Dialog */}
      {showMapForm && (
        <CreateMapForm
          onCancel={showMapHandler}
          onSubmit={handleMapSubmit}
          projectId={id || ""}
        />
      )}
    </div>
  );
}
