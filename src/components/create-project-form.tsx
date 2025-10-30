/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bounce, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import {
  useCreateProjectsMutation,
  useGetAllCustomerQuery,
} from "@/redux/api/baseApi";
import type { ICompany } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ProjectFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  userId?: string;
}

export default function CreateProjectForm({
  onSubmit,
  onCancel,
  userId,
}: ProjectFormProps) {
  const [createProject, { isLoading: isCreatingProject }] =
    useCreateProjectsMutation();
  const { data } = useGetAllCustomerQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const companyData: ICompany[] = data?.data?.company;
  const form = useForm();
  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = {
      name: data.name,
      companyId: data.companyId,
      userId: userId,
    };

    try {
      await createProject(formData).unwrap();

      toast.success("Project created successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
      });

      onSubmit(formData);
      form.reset();
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 dark:bg-black rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Create Project</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isCreatingProject}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Project name"
                      {...field}
                      defaultValue={field.value || ""}
                      required
                      disabled={isCreatingProject}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value || ""}
                    disabled={isCreatingProject}
                  >
                    <FormControl className="w-full z-10">
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companyData &&
                        companyData.map((com, idx) => (
                          <SelectItem
                            key={idx}
                            value={(com._id as string) || ""}
                          >
                            {com.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                {isCreatingProject ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Project...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 bg-transparent"
                disabled={isCreatingProject}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
