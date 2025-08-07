import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMeQuery, useGetProjectsQuery } from "@/redux/api/baseApi";
import { Building2, Calendar, Eye, Loader2, ExternalLink } from "lucide-react";
import type { IProjects } from "@/types/types";
import CreateProjectForm from "@/components/create-project-form";
import { useNavigate } from "react-router";

export default function Projects() {
  const navigate = useNavigate();
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleProjectSubmit = () => {
    setShowProjectForm(false);
  };

  const { data: projectsData, isLoading } = useGetProjectsQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const { data: user } = useGetMeQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const projects: IProjects[] = projectsData?.data?.projects || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openImageGallery = (images: string[]) => {
    setSelectedImages(images);
    setImageDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading Projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects Management</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Total: {projects.length}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between px-3">
          <CardTitle>All Projects</CardTitle>
          <Button onClick={() => setShowProjectForm(true)}>
            Create Project
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No project found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="divide-x divide-y border">
                <TableHeader>
                  <TableRow className="divide-x divide-y">
                    <TableHead>Project</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => {
                    return (
                      <TableRow className="divide-x divide-y" key={project._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                              onClick={() => openImageGallery(project.imageUrl)}
                            >
                              {project.imageUrl &&
                              project.imageUrl.length > 0 ? (
                                <img
                                  src={project.imageUrl[0]}
                                  alt="Floor Plan Image"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Building2 className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium max-w-xs truncate">
                                {project.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={project.userId?.picture} />
                              <AvatarFallback>
                                {project.userId?.name?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {project.userId?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {project.userId?.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">
                                {project.companyId?.name || "N/A"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(project.createdAt)}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(`/projects/${project._id}`)
                              }
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Maps
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

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Images</DialogTitle>
            <DialogDescription>
              {selectedImages.length} image(s) available
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Floor plan ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(imageUrl, "_blank")}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {showProjectForm && (
        <CreateProjectForm
          onSubmit={handleProjectSubmit}
          onCancel={() => setShowProjectForm(false)}
          userId={user?.data?._id}
        />
      )}
    </div>
  );
}
