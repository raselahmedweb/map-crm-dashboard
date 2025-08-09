/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useState } from "react";
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
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
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

interface ImageUploadState {
  file: File;
  preview: string;
  url?: string;
  isUploading: boolean;
  isUploaded: boolean;
  error?: string;
}

// Cloudinary upload function
const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();

  const CLOUDINARY_UPLOAD_PRESET = "map_images";
  const CLOUDINARY_CLOUD_NAME = "dprilczgm";

  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return data.secure_url;
};

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
  const [images, setImages] = useState<ImageUploadState[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImages: ImageUploadState[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isUploading: true,
      isUploaded: false,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Upload each image to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageIndex = images.length + i;

      try {
        const url = await uploadToCloudinary(file);

        setImages((prev) =>
          prev.map((img, idx) =>
            idx === imageIndex
              ? { ...img, url, isUploading: false, isUploaded: true }
              : img
          )
        );

        toast.success(`Image ${i + 1} uploaded successfully!`, {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Upload error:", error);

        setImages((prev) =>
          prev.map((img, idx) =>
            idx === imageIndex
              ? {
                  ...img,
                  isUploading: false,
                  isUploaded: false,
                  error: "Upload failed",
                }
              : img
          )
        );

        toast.error(`Failed to upload image ${i + 1}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }

    // Reset input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const retryUpload = async (index: number) => {
    const image = images[index];
    if (!image || image.isUploading) return;

    setImages((prev) =>
      prev.map((img, idx) =>
        idx === index ? { ...img, isUploading: true, error: undefined } : img
      )
    );

    try {
      const url = await uploadToCloudinary(image.file);

      setImages((prev) =>
        prev.map((img, idx) =>
          idx === index
            ? { ...img, url, isUploading: false, isUploaded: true }
            : img
        )
      );

      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Retry upload error:", error);

      setImages((prev) =>
        prev.map((img, idx) =>
          idx === index
            ? { ...img, isUploading: false, error: "Upload failed" }
            : img
        )
      );

      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    // Check if all images are uploaded
    const pendingUploads = images.filter((img) => img.isUploading);
    const failedUploads = images.filter((img) => img.error);

    if (pendingUploads.length > 0) {
      toast.warning("Please wait for all images to finish uploading", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (failedUploads.length > 0) {
      toast.error("Please retry failed uploads or remove failed images", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const imageUrls = images
      .filter((img) => img.isUploaded && img.url)
      .map((img) => img.url!);

    const formData = {
      name: data.name,
      imageUrl: imageUrls,
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
      setImages([]);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Check if form can be submitted
  const canSubmit =
    images.length > 0 &&
    images.every((img) => img.isUploaded) &&
    !isCreatingProject;

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
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value || ""}
                    disabled={isCreatingProject}
                  >
                    <FormControl className="w-full z-10">
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Project Images
              </label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors rounded-lg">
                <div className="text-center">
                  <div className="py-4">
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload Project images
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </span>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isCreatingProject}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      Uploaded Images (
                      {images.filter((img) => img.isUploaded).length}/
                      {images.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />

                          {/* Upload Status Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            {image.isUploading && (
                              <div className="text-white text-center">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1" />
                                <span className="text-xs">Uploading...</span>
                              </div>
                            )}

                            {image.isUploaded && (
                              <div className="text-white text-center">
                                <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-400" />
                                <span className="text-xs">Uploaded</span>
                              </div>
                            )}

                            {image.error && (
                              <div className="text-white text-center">
                                <AlertCircle className="w-6 h-6 mx-auto mb-1 text-red-400" />
                                <span className="text-xs">Failed</span>
                                <button
                                  type="button"
                                  onClick={() => retryUpload(index)}
                                  className="mt-1 text-xs underline hover:no-underline"
                                >
                                  Retry
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={image.isUploading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Image Name */}
                        <p className="mt-1 text-xs text-gray-500 truncate">
                          {image.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1" disabled={!canSubmit}>
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
