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
import { X, Loader2, Search } from "lucide-react";
import {
  useCreateMapMutation,
  useGetDevicesQuery,
  useGetUserQuery,
} from "@/redux/api/baseApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Employee, IDevice } from "@/types/types";
import { useState, useMemo } from "react";

interface MapFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  companyId: string;
  userId: string;
  bgImageUrl: string[];
}

export default function CreateMapForm({
  onSubmit,
  onCancel,
  companyId,
  userId,
  bgImageUrl,
}: MapFormProps) {
  const [selectedDevices, setSelectedDevices] = useState<IDevice[]>([]);
  const [deviceSearchTerm, setDeviceSearchTerm] = useState("");
  const [showDeviceSuggestions, setShowDeviceSuggestions] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<Employee[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);

  const { data: deviceData } = useGetDevicesQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  console.log(deviceData, "All Devices Data");
  const allDevice: IDevice[] = deviceData?.data?.item || [];

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

  // Filter devices based on search term and exclude already selected ones
  const filteredDevices = useMemo(() => {
    const selectedDeviceIds = selectedDevices.map((device) => device._id);
    return allDevice
      .filter(
        (device) =>
          !selectedDeviceIds.includes(device._id) &&
          device.label.toLowerCase().includes(deviceSearchTerm.toLowerCase())
      )
      .slice(0, 5); // Limit suggestions to 5 items
  }, [allDevice, selectedDevices, deviceSearchTerm]);

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

  const handleDeviceSelect = (device: IDevice) => {
    setSelectedDevices((prev) => [...prev, device]);
    setDeviceSearchTerm("");
    setShowDeviceSuggestions(false);

    // Update form value with array of device IDs
    const deviceIds = [...selectedDevices, device].map((d) => d._id);
    form.setValue("availableDevices", deviceIds);
  };

  const handleDeviceRemove = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.filter((device) => device._id !== deviceId)
    );

    // Update form value
    const updatedDeviceIds = selectedDevices
      .filter((device) => device._id !== deviceId)
      .map((d) => d._id);
    form.setValue("availableDevices", updatedDeviceIds);
  };

  const handleDeviceInputChange = (value: string) => {
    setDeviceSearchTerm(value);
    setShowDeviceSuggestions(value.length > 0);
  };

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
      companyId,
      mapDesigner: userId,
      assignedTo: selectedUsers.map((user) => user._id), // Send array of user IDs
      bgImageUrl: data.mapImage,
      availableDevices: selectedDevices.map((device) => device._id), // Send array of device IDs
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
      setSelectedDevices([]);
      setSelectedUsers([]);
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
              name="mapImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Map</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value || ""}
                    disabled={isCreatingMap}
                  >
                    <FormControl className="w-full z-10">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Map" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bgImageUrl &&
                        bgImageUrl.map((img, idx) => (
                          <SelectItem key={idx} value={(img as string) || ""}>
                            <div className="flex items-center space-x-2">
                              <img
                                src={img}
                                alt={`Map ${idx + 1}`}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <span>Map {idx + 1}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Enhanced Multi-Select Device Field */}
            <FormField
              control={form.control}
              name="availableDevices"
              render={() => (
                <FormItem>
                  <FormLabel>Add Devices</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {/* Selected Devices Display */}
                      {selectedDevices.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50 min-h-[40px]">
                          {selectedDevices.map((device) => (
                            <div
                              key={device._id}
                              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                            >
                              <span>{device.label}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeviceRemove(device._id as string)
                                }
                                className="text-blue-600 hover:text-blue-800 ml-1"
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
                            placeholder="Search and add devices..."
                            value={deviceSearchTerm}
                            onChange={(e) =>
                              handleDeviceInputChange(e.target.value)
                            }
                            onFocus={() =>
                              setShowDeviceSuggestions(
                                deviceSearchTerm.length > 0
                              )
                            }
                            className="pl-9"
                            disabled={isCreatingMap}
                          />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showDeviceSuggestions &&
                          filteredDevices.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                              {filteredDevices.map((device) => (
                                <button
                                  key={device._id}
                                  type="button"
                                  onClick={() => handleDeviceSelect(device)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between group"
                                  disabled={isCreatingMap}
                                >
                                  <span className="text-sm">
                                    {device.label}
                                  </span>
                                  <span className="text-xs text-gray-400 group-hover:text-gray-600">
                                    Click to add
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                        {/* No Results Message */}
                        {showDeviceSuggestions &&
                          deviceSearchTerm &&
                          filteredDevices.length === 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1">
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No devices found matching "{deviceSearchTerm}"
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
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
