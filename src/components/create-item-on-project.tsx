// import { useGetDevicesQuery } from "@/redux/api/baseApi";
// import type { IDevice } from "@/types/types";
// import { useState } from "react";

export default function CreateItemOnProject() {
  // const [deviceSearchTerm, setDeviceSearchTerm] = useState("");
  // const [showDeviceSuggestions, setShowDeviceSuggestions] = useState(false);
  // const [selectedDevices, setSelectedDevices] = useState<IDevice[]>([]);

  // const { data: deviceData } = useGetDevicesQuery(
  //   {},
  //   {
  //     pollingInterval: 30000,
  //     refetchOnMountOrArgChange: true,
  //     refetchOnReconnect: true,
  //   }
  // );

  // console.log(deviceData, "All Devices Data");
  // const allDevice: IDevice[] = deviceData?.data?.item;

  // // Handler

  // const handleDeviceRemove = (deviceId: string) => {
  //   setSelectedDevices((prev) =>
  //     prev.filter((device) => device._id !== deviceId)
  //   );

  //   // Update form value
  //   const updatedDeviceIds = selectedDevices
  //     .filter((device) => device._id !== deviceId)
  //     .map((d) => d._id);
  //   // form.setValue("availableDevices", updatedDeviceIds);
  // };

  // const handleDeviceInputChange = (value: string) => {
  //   setDeviceSearchTerm(value);
  //   setShowDeviceSuggestions(value.length > 0);
  // };

  return <div>CreateItemOnProject</div>;
}
