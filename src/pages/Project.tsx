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
  useGetMeQuery,
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "@/redux/api/baseApi";
import { Building2, Eye, Loader2, Trash } from "lucide-react";
import type { IProjects } from "@/types/types";
import CreateProjectForm from "@/components/create-project-form";
import { useNavigate } from "react-router";

export default function Projects() {
  const navigate = useNavigate();
  const [showProjectForm, setShowProjectForm] = useState(false);

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

  const [deleteProject] = useDeleteProjectMutation();

  const projects: IProjects[] = projectsData?.data?.projects || [];
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
                    <TableHead>Name</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => {
                    return (
                      <TableRow className="divide-x divide-y" key={project._id}>
                        <TableCell>
                          <p className="text-sm font-medium max-w-xs truncate">
                            {project.name}
                          </p>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium max-w-xs truncate">
                              {project.userId?.name}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">
                                {project.customerId?.name || "N/A"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="w-[150px]">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(`/projects/${project._id}`)
                              }
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteProject(project._id)}
                            >
                              <Trash className="w-3 h-3 mr-1" />
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
