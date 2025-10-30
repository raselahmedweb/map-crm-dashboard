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
import {
  X,
  Loader2,
  Search,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCreateMapMutation, useGetUserQuery } from "@/redux/api/baseApi";
import type { Employee } from "@/types/types";
import { useState, useMemo } from "react";

interface MapFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  projectId: string;
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

export default function CreateMapForm({
  onSubmit,
  onCancel,
  projectId,
}: MapFormProps) {
  const [selectedUsers, setSelectedUsers] = useState<Employee[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);

  const { data: usersData } = useGetUserQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const allUsers: Employee[] = usersData?.data || [];

  const [createMap, { isLoading: isCreatingMap }] = useCreateMapMutation();
  const form = useForm();

  const [image, setImage] = useState<ImageUploadState | null>(null); // Changed to single image

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear any existing image
    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    const newImage: ImageUploadState = {
      file,
      preview: URL.createObjectURL(file),
      isUploading: true,
      isUploaded: false,
    };

    setImage(newImage);

    try {
      const url = await uploadToCloudinary(file);

      setImage({
        ...newImage,
        url,
        isUploading: false,
        isUploaded: true,
      });

      // Set the form value with the uploaded image URL
      form.setValue("mapImage", url);

      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Upload error:", error);

      setImage({
        ...newImage,
        isUploading: false,
        isUploaded: false,
        error: "Upload failed",
      });

      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // Reset input
    e.target.value = "";
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image.preview);
      setImage(null);
      form.setValue("mapImage", "");
    }
  };

  const retryUpload = async () => {
    if (!image || image.isUploading) return;

    setImage({
      ...image,
      isUploading: true,
      error: undefined,
    });

    try {
      const url = await uploadToCloudinary(image.file);

      setImage({
        ...image,
        url,
        isUploading: false,
        isUploaded: true,
      });

      // Set the form value with the uploaded image URL
      form.setValue("mapImage", url);

      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Retry upload error:", error);

      setImage({
        ...image,
        isUploading: false,
        error: "Upload failed",
      });

      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Filter users based on search term and exclude already selected ones
  const filteredUsers = useMemo(() => {
    const selectedUserIds = selectedUsers.map((user) => user._id);
    return allUsers
      .filter(
        (user) =>
          !selectedUserIds.includes(user._id) &&
          user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
      )
      .slice(0, 5); // Limit suggestions to 5 items
  }, [allUsers, selectedUsers, userSearchTerm]);

  const handleUserSelect = (user: Employee) => {
    setSelectedUsers((prev) => [...prev, user]);
    setUserSearchTerm("");
    setShowUserSuggestions(false);

    // Update form value with array of user IDs
    const userIds = [...selectedUsers, user].map((u) => u._id);
    form.setValue("assignedTo", userIds);
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));

    // Update form value
    const updatedUserIds = selectedUsers
      .filter((user) => user._id !== userId)
      .map((u) => u._id);
    form.setValue("assignedTo", updatedUserIds);
  };

  const handleUserInputChange = (value: string) => {
    setUserSearchTerm(value);
    setShowUserSuggestions(value.length > 0);
  };

  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = {
      name: data.name,
      projectId,
      assignedTo: selectedUsers.map((user) => user._id),
      bgImageUrl: data.mapImage, // This will now be a single string
    };

    try {
      await createMap(formData).unwrap();

      toast.success("Map created successfully!", {
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
      setSelectedUsers([]);
      setImage(null);
    } catch (error) {
      console.error("Failed to create map:", error);
      toast.error("Failed to create map. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 dark:bg-black border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Create map</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isCreatingMap}
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
                  <FormLabel>Map Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter map name"
                      {...field}
                      defaultValue={field.value || ""}
                      required
                      disabled={isCreatingMap}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTo"
              render={() => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {/* Selected Users Display */}
                      {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50 min-h-[40px]">
                          {selectedUsers.map((user) => (
                            <div
                              key={user._id}
                              className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                            >
                              <span>{user.name}</span>
                              <span className="text-xs text-green-600">
                                ({user.role})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUserRemove(user._id)}
                                className="text-green-600 hover:text-green-800 ml-1"
                                disabled={isCreatingMap}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Search Input with Suggestions */}
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search and assign users..."
                            value={userSearchTerm}
                            onChange={(e) =>
                              handleUserInputChange(e.target.value)
                            }
                            onFocus={() =>
                              setShowUserSuggestions(userSearchTerm.length > 0)
                            }
                            className="pl-9"
                            disabled={isCreatingMap}
                          />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showUserSuggestions && filteredUsers.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                            {filteredUsers.map((user) => (
                              <button
                                key={user._id}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between group"
                                disabled={isCreatingMap}
                              >
                                <div>
                                  <span className="text-sm font-medium">
                                    {user.name}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({user.role})
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400 group-hover:text-gray-600">
                                  Click to assign
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* No Results Message */}
                        {showUserSuggestions &&
                          userSearchTerm &&
                          filteredUsers.length === 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1">
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No users found matching "{userSearchTerm}"
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Map Image
              </label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors rounded-lg">
                <div className="text-center">
                  <div className="py-4">
                    <label htmlFor="image" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload Map Image
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </span>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isCreatingMap}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {image && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      Map Image
                    </h3>
                  </div>

                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
                      <img
                        src={image.preview}
                        alt="Map preview"
                        className="w-full h-48 object-contain"
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
                              onClick={retryUpload}
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
                        onClick={removeImage}
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
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1" disabled={isCreatingMap}>
                {isCreatingMap ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating map...
                  </>
                ) : (
                  "Create map"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 bg-transparent"
                disabled={isCreatingMap}
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
