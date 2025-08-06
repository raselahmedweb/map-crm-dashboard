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
  useGetAllMapQuery,
  useGetMeQuery,
  useGetSingleProjectQuery,
  useDeleteMapMutation,
} from "@/redux/api/baseApi";
import type { IMap } from "@/types/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Trash2, Play, Plus, ArrowLeft, Users, Palette } from "lucide-react";
import { toast } from "react-toastify";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showMapForm, setShowMapForm] = useState(false);
  const [deleteMapId, setDeleteMapId] = useState<string | null>(null);

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
  const { data: mapData, refetch: refetchMaps } = useGetAllMapQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const [deleteMap, { isLoading: isDeleting }] = useDeleteMapMutation();

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
    } finally {
      setDeleteMapId(null);
    }
  };

  const handleStartDesign = (mapId: string) => {
    // Navigate to map design page
    navigate(`/maps/${mapId}/design`);
  };

  // Extract maps from the response structure based on your console log
  const maps: IMap[] = mapData?.data?.map || [];

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {project?.data?.name}
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
              <Button
                onClick={() => setShowMapForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Map
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Project Images */}
        {project?.data?.imageUrl && project.data.imageUrl.length > 0 && (
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {project.data.imageUrl.map((image: string, index: number) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={image}
                    alt={`Project Image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-green-300 shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Maps Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Maps ({maps.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {maps.length === 0 ? (
            <div className="text-center py-12">
              <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No maps yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first map to start designing your project layout.
              </p>
              <Button
                onClick={() => setShowMapForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Map
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Map Name</TableHead>
                  <TableHead>Designer</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Background</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maps.map((map) => (
                  <TableRow key={map._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{map.name}</TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {map.mapDesigner?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {map.mapDesigner?.email}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {Array.isArray(map.assignedTo)
                            ? map.assignedTo.length
                            : 0}{" "}
                          user(s)
                        </span>
                      </div>
                      {Array.isArray(map.assignedTo) &&
                        map.assignedTo.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {map.assignedTo.slice(0, 2).map((user, idx) => (
                              <div key={idx}>{user.name}</div>
                            ))}
                            {map.assignedTo.length > 2 && (
                              <div>+{map.assignedTo.length - 2} more</div>
                            )}
                          </div>
                        )}
                    </TableCell>

                    <TableCell>
                      {map.bgImageUrl ? (
                        <img
                          src={map.bgImageUrl}
                          alt="Map background"
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant={map.isComplete ? "default" : "secondary"}>
                        {map.isComplete ? "Complete" : "In Progress"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {Array.isArray(map.availableDevices)
                          ? map.availableDevices.length
                          : 0}{" "}
                        devices
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleStartDesign(map._id)}
                          className="flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Design
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Map</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{map.name}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMap(map._id)}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
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
        </CardContent>
      </Card>

      {/* Create Map Form Modal/Overlay */}
      {showMapForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CreateMapForm
              onSubmit={handleMapSubmit}
              onCancel={() => setShowMapForm(false)}
              userId={user?.data?._id}
              companyId={project?.data?.companyId._id}
              bgImageUrl={project?.data?.imageUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}
