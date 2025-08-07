// import {
//   useCreateItemOnMapMutation,
//   useGetDevicesQuery,
//   useGetMeQuery,
//   useGetSingleMapQuery,
//   useChangePositionOfItemsMutation,
//   useGetItemOnMapQuery,
// } from "@/redux/api/baseApi";
// import type { Employee, IDevice, IItemOnMap } from "@/types/types";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router";
// import {
//   Trash2,
//   X,
//   Plus,
//   MapPin,
//   Cpu,
//   ChevronDown,
//   ArrowLeft,
//   Minus,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// export default function ProjectDesign() {
//   const { mapId } = useParams();
//   const navigate = useNavigate();

//   const { data: placedItemsData } = useGetItemOnMapQuery(mapId || "", {
//     pollingInterval: 30000,
//     refetchOnMountOrArgChange: true,
//     refetchOnReconnect: true,
//   });
//   const itemOnMap = placedItemsData?.data?.itemOnMap || [];

//   const { data: mapData, isLoading: isMapDataLoading } = useGetSingleMapQuery(
//     mapId || "",
//     {
//       pollingInterval: 30000,
//       refetchOnMountOrArgChange: true,
//       refetchOnReconnect: true,
//     }
//   );
//   const map = mapData?.data || {};

//   const [createItemOnMap, { isLoading: isCreating }] =
//     useCreateItemOnMapMutation();
//   const [changePositionOfItems, { isLoading: isUpdatingPosition }] =
//     useChangePositionOfItemsMutation();

//   const { data: deviceData } = useGetDevicesQuery(
//     {},
//     {
//       pollingInterval: 30000,
//       refetchOnMountOrArgChange: true,
//       refetchOnReconnect: true,
//     }
//   );
//   const availableDevices: IDevice[] = deviceData?.data?.item || [];

//   const { data, isLoading } = useGetMeQuery(
//     {},
//     {
//       pollingInterval: 30000,
//       refetchOnMountOrArgChange: true,
//       refetchOnReconnect: true,
//     }
//   );

//   const [itemsOnMap, setItemsOnMap] = useState<IItemOnMap[]>([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
//   const [selectedDeviceId, setSelectedDeviceId] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [draggedItem, setDraggedItem] = useState<IItemOnMap | null>(null);
//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [deletePosition, setDeletePosition] = useState({ x: 0, y: 0 });
//   const [itemToDelete, setItemToDelete] = useState<IItemOnMap | null>(null);
//   const mapRef = useRef<HTMLDivElement>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 }); // Center origin as percentage
//   const MIN_ZOOM = 0.5;
//   const MAX_ZOOM = 3;

//   const user = data?.data as Employee;

//   const percentToPx = useCallback(
//     (percent: number, dimension: "width" | "height") => {
//       if (!mapRef.current) return 0;
//       const rect = mapRef.current.getBoundingClientRect();
//       const containerSize = dimension === "width" ? rect.width : rect.height;
//       return (percent / 100) * containerSize;
//     },
//     []
//   );

//   const handleZoomIn = useCallback(() => {
//     setZoomLevel((prev) => Math.min(prev + 0.25, MAX_ZOOM));
//   }, []);

//   const handleZoomOut = useCallback(() => {
//     setZoomLevel((prev) => Math.max(prev - 0.25, MIN_ZOOM));
//   }, []);

//   const handleZoomReset = useCallback(() => {
//     setZoomLevel(1);
//     setZoomOrigin({ x: 50, y: 50 });
//   }, []);

//   const getAdjustedMousePosition = useCallback(
//     (e: React.MouseEvent | MouseEvent, rect: DOMRect) => {
//       const rawX = e.clientX - rect.left;
//       const rawY = e.clientY - rect.top;

//       // Adjust for zoom and transform origin
//       const centerX = rect.width * (zoomOrigin.x / 100);
//       const centerY = rect.height * (zoomOrigin.y / 100);

//       const adjustedX = (rawX - centerX) / zoomLevel + centerX;
//       const adjustedY = (rawY - centerY) / zoomLevel + centerY;

//       return { x: adjustedX, y: adjustedY };
//     },
//     [zoomLevel, zoomOrigin]
//   );

//   useEffect(() => {
//     if (itemOnMap && Array.isArray(itemOnMap)) {
//       setItemsOnMap(itemOnMap);
//     }
//   }, [itemOnMap]);

//   const handleMapClick = useCallback(
//     (e: React.MouseEvent) => {
//       if (isDragging) return;
//       const rect = mapRef.current?.getBoundingClientRect();
//       if (!rect) return;

//       const { x: clickX, y: clickY } = getAdjustedMousePosition(e, rect);

//       // Convert to percentage for responsive positioning
//       const xPercent = (clickX / rect.width) * 100;
//       const yPercent = (clickY / rect.height) * 100;

//       setFormPosition({ x: xPercent, y: yPercent });
//       setShowAddForm(true);
//       setShowDeletePopup(false);
//       setSelectedDeviceId("");
//       setSelectedLocation("");
//     },
//     [isDragging, getAdjustedMousePosition]
//   );

//   const handleFormSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       if (!selectedDeviceId || !user?._id || !mapRef.current) return;

//       const device = availableDevices.find((d) => d._id === selectedDeviceId);
//       if (!device) return;

//       try {
//         await createItemOnMap({
//           itemId: selectedDeviceId,
//           mapId: mapId || "",
//           userId: user._id,
//           location: selectedLocation,
//           x: formPosition.x, // percentage
//           y: formPosition.y, // percentage
//         }).unwrap();

//         setShowAddForm(false);
//         setSelectedDeviceId("");
//         setSelectedLocation("");
//       } catch (error) {
//         console.error("Failed to add device:", error);
//       }
//     },
//     [
//       createItemOnMap,
//       selectedDeviceId,
//       availableDevices,
//       formPosition,
//       selectedLocation,
//       user?._id,
//       mapId,
//     ]
//   );

//   const handleDeleteItem = useCallback(() => {
//     if (!itemToDelete) return;
//     setItemsOnMap((prev) =>
//       prev.filter((item) => item._id !== itemToDelete._id)
//     );
//     setShowDeletePopup(false);
//     setItemToDelete(null);
//   }, [itemToDelete]);

//   const startDragging = useCallback(
//     (e: React.MouseEvent, item: IItemOnMap) => {
//       e.stopPropagation();
//       setIsDragging(true);
//       setDraggedItem(item);
//       const rect = mapRef.current?.getBoundingClientRect();
//       if (!rect) return;

//       const { x: mouseX, y: mouseY } = getAdjustedMousePosition(e, rect);

//       // Calculate current pixel position from percentage
//       const currentPxX = (item.x / 100) * rect.width;
//       const currentPxY = (item.y / 100) * rect.height;

//       setDragOffset({
//         x: mouseX - currentPxX,
//         y: mouseY - currentPxY,
//       });
//     },
//     [getAdjustedMousePosition]
//   );

//   const handleMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (!isDragging || !draggedItem || !mapRef.current) return;
//       const rect = mapRef.current.getBoundingClientRect();

//       const { x: mouseX, y: mouseY } = getAdjustedMousePosition(e, rect);

//       const x = mouseX - dragOffset.x;
//       const y = mouseY - dragOffset.y;

//       const constrainedX = Math.max(20, Math.min(x, rect.width - 20));
//       const constrainedY = Math.max(20, Math.min(y, rect.height - 20));

//       const xPercent = (constrainedX / rect.width) * 100;
//       const yPercent = (constrainedY / rect.height) * 100;

//       setItemsOnMap((prev) =>
//         prev.map((item) =>
//           item._id === draggedItem._id
//             ? { ...item, x: xPercent, y: yPercent }
//             : item
//         )
//       );
//     },
//     [isDragging, draggedItem, dragOffset, getAdjustedMousePosition]
//   );

//   const stopDragging = useCallback(async () => {
//     if (draggedItem && user?._id) {
//       try {
//         const res = await changePositionOfItems({
//           id: draggedItem._id,
//           x: draggedItem.x,
//           y: draggedItem.y,
//         }).unwrap();
//         console.log(res);
//       } catch (error) {
//         console.error("Failed to update position:", error);
//       }
//     }
//     setIsDragging(false);
//     setDraggedItem(null);
//   }, [draggedItem, changePositionOfItems, user?._id]);

//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", stopDragging);
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", stopDragging);
//       };
//     }
//   }, [isDragging, handleMouseMove, stopDragging]);

//   if (isLoading || isMapDataLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//           <h1 className="text-xl font-semibold text-gray-700">
//             Loading map...
//           </h1>
//         </div>
//       </div>
//     );
//   }

//   if (!map || !mapData?.data) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h1 className="text-xl font-semibold text-red-600">
//             Failed to load map data
//           </h1>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Card>
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold">Project Design</h1>
//               <p className="text-sm mt-1">
//                 Interactive device placement and management
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div>
//                 <Button
//                   onClick={() => navigate(-1)}
//                   variant="outline"
//                   className="flex items-center gap-2"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Go Back
//                 </Button>
//               </div>
//               <div className="bg-blue-100 px-3 py-1.5 rounded-lg">
//                 <span className="text-blue-700 font-medium text-sm">
//                   {itemsOnMap.length} devices placed
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       <div className="flex-1 flex flex-col mt-6 gap-6">
//         <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
//           <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
//             <Button
//               onClick={handleZoomIn}
//               disabled={zoomLevel >= MAX_ZOOM}
//               size="sm"
//               variant="outline"
//               className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
//             >
//               <Plus className="w-4 h-4" />
//             </Button>
//             <Button
//               onClick={handleZoomOut}
//               disabled={zoomLevel <= MIN_ZOOM}
//               size="sm"
//               variant="outline"
//               className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
//             >
//               <Minus className="w-4 h-4" />
//             </Button>
//             <Button
//               onClick={handleZoomReset}
//               size="sm"
//               variant="outline"
//               className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white text-xs"
//             >
//               1x
//             </Button>
//           </div>

//           <div className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
//             {Math.round(zoomLevel * 100)}%
//           </div>

//           <div
//             ref={mapRef}
//             className="relative w-[900px] h-[500px] cursor-crosshair"
//             onClick={handleMapClick}
//           >
//             <div
//               className="absolute inset-0 w-full h-full origin-top-left transition-transform duration-200 ease-out"
//               style={{
//                 transform: `scale(${zoomLevel})`,
//                 transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
//               }}
//             >
//               {/* Background Image - Full coverage */}
//               <div
//                 className="absolute inset-0 w-full h-full"
//                 style={{
//                   backgroundImage: map.bgImageUrl
//                     ? `url("${map.bgImageUrl}")`
//                     : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   backgroundRepeat: "no-repeat",
//                 }}
//               />

//               <div className="absolute inset-0 opacity-10">
//                 <svg className="w-full h-full">
//                   <defs>
//                     <pattern
//                       id="grid"
//                       width="40"
//                       height="40"
//                       patternUnits="userSpaceOnUse"
//                     >
//                       <path
//                         d="M 40 0 L 0 0 0 40"
//                         fill="none"
//                         stroke="#6366f1"
//                         strokeWidth="1"
//                       />
//                     </pattern>
//                   </defs>
//                   <rect width="100%" height="100%" fill="url(#grid)" />
//                 </svg>
//               </div>

//               {itemsOnMap.map((item, idx) => {
//                 const isCompleted = item.progress === 100;
//                 const isInProgress = item.progress > 0 && item.progress < 100;
//                 return (
//                   <div
//                     key={item._id}
//                     className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 cursor-pointer group/device"
//                     style={{
//                       left: `${item.x}%`,
//                       top: `${item.y}%`,
//                       zIndex:
//                         isDragging && draggedItem?._id === item._id ? 1000 : 1,
//                     }}
//                     onMouseDown={(e) => startDragging(e, item)}
//                     onContextMenu={(e) => {
//                       e.preventDefault();
//                       const rect = mapRef.current?.getBoundingClientRect();
//                       if (!rect) return;

//                       const pixelX = (item.x / 100) * rect.width;
//                       const pixelY = (item.y / 100) * rect.height;
//                       setDeletePosition({
//                         x: pixelX,
//                         y: pixelY,
//                       });
//                       setItemToDelete(item);
//                       setShowDeletePopup(true);
//                       setShowAddForm(false);
//                     }}
//                   >
//                     <div className="relative">
//                       {/* Device Circle */}
//                       <div
//                         className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-all duration-200 ${
//                           isCompleted
//                             ? "border-green-400 bg-green-500"
//                             : isInProgress
//                             ? "border-yellow-400 bg-yellow-500"
//                             : "border-blue-400 bg-blue-500"
//                         } group-hover/device:shadow-xl`}
//                       >
//                         <span className="text-xs font-bold">{idx + 1}</span>
//                       </div>

//                       <div
//                         className={`absolute -top-1 right-0 w-2 h-2 rounded-full border border-white ${
//                           isCompleted
//                             ? "bg-green-400"
//                             : isInProgress
//                             ? "bg-yellow-400 animate-pulse"
//                             : "bg-gray-400"
//                         }`}
//                       ></div>

//                       <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/device:opacity-100 transition-opacity duration-200">
//                         {item.label} {item.location && `• ${item.location}`}
//                       </div>

//                       {isDragging &&
//                         draggedItem?._id === item._id &&
//                         isUpdatingPosition && (
//                           <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
//                             Updating...
//                           </div>
//                         )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {showAddForm && (
//               <div
//                 className="absolute bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[320px]"
//                 style={{
//                   left: `${Math.min(
//                     percentToPx(formPosition.x, "width") * zoomLevel,
//                     window.innerWidth - 350
//                   )}px`,
//                   top: `${Math.min(
//                     percentToPx(formPosition.y, "height") * zoomLevel,
//                     window.innerHeight - 300
//                   )}px`,
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <form onSubmit={handleFormSubmit}>
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <Plus className="w-5 h-5 text-blue-500" />
//                       Add Device
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setShowAddForm(false);
//                       }}
//                       className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>

//                   {isCreating && (
//                     <div className="mb-4 flex items-center space-x-2 text-blue-600">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                       <span className="text-sm">Adding device...</span>
//                     </div>
//                   )}

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Select Device *
//                       </label>
//                       <div className="relative">
//                         <select
//                           value={selectedDeviceId}
//                           onChange={(e) => {
//                             e.stopPropagation();
//                             setSelectedDeviceId(e.target.value);
//                           }}
//                           onClick={(e) => e.stopPropagation()}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white appearance-none pr-8"
//                           required
//                         >
//                           <option value="">Choose a device...</option>
//                           {availableDevices.map((device) => (
//                             <option key={device._id} value={device._id}>
//                               {device.label} - ${device.price} ({device.copies}{" "}
//                               available)
//                             </option>
//                           ))}
//                         </select>
//                         <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Location (Optional)
//                       </label>
//                       <div className="relative">
//                         <input
//                           type="text"
//                           value={selectedLocation}
//                           onChange={(e) => {
//                             e.stopPropagation();
//                             setSelectedLocation(e.target.value);
//                           }}
//                           onClick={(e) => e.stopPropagation()}
//                           placeholder="Enter location..."
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pl-9"
//                         />
//                         <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                     </div>

//                     <div className="flex space-x-3 pt-2">
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setShowAddForm(false);
//                         }}
//                         className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={!selectedDeviceId || isCreating}
//                         className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
//                       >
//                         {isCreating ? "Adding..." : "Add Device"}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {showDeletePopup && itemToDelete && (
//               <div
//                 className="absolute bg-white rounded-lg shadow-xl border border-red-200 p-4 z-50 min-w-[200px]"
//                 style={{
//                   left: `${Math.min(
//                     deletePosition.x * zoomLevel,
//                     window.innerWidth - 220
//                   )}px`,
//                   top: `${Math.min(
//                     deletePosition.y * zoomLevel,
//                     window.innerHeight - 150
//                   )}px`,
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-red-600">
//                     Remove Device
//                   </h3>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setShowDeletePopup(false);
//                     }}
//                     className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {itemToDelete.label}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {itemToDelete.location || "No location assigned"}
//                     </p>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDeleteItem();
//                     }}
//                     className="flex items-center space-x-2 w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     <span>Remove Device</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <Card className="px-5 py-4">
//           <div className="flex items-center gap-2 mb-4">
//             <Cpu className="w-5 h-5 text-blue-500" />
//             <h2 className="text-lg font-semibold">Type of Devices</h2>
//             <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
//               {availableDevices.length}
//             </span>
//           </div>

//           {availableDevices.length === 0 ? (
//             <div className="text-center py-8">
//               <Cpu className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//               <p className="text-gray-500">No devices available</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
//               {availableDevices.map((device) => (
//                 <div
//                   key={device._id}
//                   className="rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
//                       style={{
//                         backgroundColor: "#6366f1",
//                       }}
//                     >
//                       {device.shape === "square"
//                         ? "■"
//                         : device.shape === "circle"
//                         ? "●"
//                         : "▲"}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="text-sm font-medium truncate">
//                         {device.label}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         ${device.price} • {device.copies} available
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client";

import {
  useCreateItemOnMapMutation,
  useGetDevicesQuery,
  useGetMeQuery,
  useGetSingleMapQuery,
  useChangePositionOfItemsMutation,
  useGetItemOnMapQuery,
  useDeleteItemFromMapMutation,
} from "@/redux/api/baseApi";
import type { Employee, IDevice, IItemOnMap } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Trash2,
  X,
  Plus,
  MapPin,
  Cpu,
  ChevronDown,
  ArrowLeft,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProjectDesign() {
  const { mapId } = useParams();
  const navigate = useNavigate();

  const { data: placedItemsData } = useGetItemOnMapQuery(mapId || "", {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const itemOnMap = placedItemsData?.data?.itemOnMap || [];

  const { data: mapData, isLoading: isMapDataLoading } = useGetSingleMapQuery(
    mapId || "",
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const map = mapData?.data || {};

  const [createItemOnMap, { isLoading: isCreating }] =
    useCreateItemOnMapMutation();
  const [changePositionOfItems, { isLoading: isUpdatingPosition }] =
    useChangePositionOfItemsMutation();

  const { data: deviceData } = useGetDevicesQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const availableDevices: IDevice[] = deviceData?.data?.item || [];

  const { data, isLoading } = useGetMeQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const [itemsOnMap, setItemsOnMap] = useState<IItemOnMap[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [draggedItem, setDraggedItem] = useState<IItemOnMap | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePosition, setDeletePosition] = useState({ x: 0, y: 0 });
  const [itemToDelete, setItemToDelete] = useState<IItemOnMap | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [containerHeight, setContainerHeight] = useState(500); // Default height
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;

  const user = data?.data as Employee;

  // Calculate container height based on image aspect ratio
  useEffect(() => {
    if (map.bgImageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        const calculatedHeight = 900 * aspectRatio;
        setContainerHeight(calculatedHeight);
      };
      img.onerror = () => {
        console.error("Failed to load background image");
        setContainerHeight(500);
      };
      img.src = map.bgImageUrl;
    } else {
      setContainerHeight(500);
    }
  }, [map.bgImageUrl]);

  const percentToPx = useCallback(
    (percent: number, dimension: "width" | "height") => {
      if (!mapRef.current) return 0;
      const rect = mapRef.current.getBoundingClientRect();
      const containerSize = dimension === "width" ? rect.width : rect.height;
      return (percent / 100) * containerSize;
    },
    []
  );

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.25, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.25, MIN_ZOOM));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
    setZoomOrigin({ x: 50, y: 50 });
  }, []);

  const getAdjustedMousePosition = useCallback(
    (e: React.MouseEvent | MouseEvent, rect: DOMRect) => {
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      const centerX = rect.width * (zoomOrigin.x / 100);
      const centerY = rect.height * (zoomOrigin.y / 100);

      const adjustedX = (rawX - centerX) / zoomLevel + centerX;
      const adjustedY = (rawY - centerY) / zoomLevel + centerY;

      return { x: adjustedX, y: adjustedY };
    },
    [zoomLevel, zoomOrigin]
  );

  useEffect(() => {
    if (itemOnMap && Array.isArray(itemOnMap)) {
      setItemsOnMap(itemOnMap);
    }
  }, [itemOnMap]);

  const handleMapClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const { x: clickX, y: clickY } = getAdjustedMousePosition(e, rect);

      const xPercent = (clickX / rect.width) * 100;
      const yPercent = (clickY / rect.height) * 100;

      setFormPosition({ x: xPercent, y: yPercent });
      setShowAddForm(true);
      setShowDeletePopup(false);
      setSelectedDeviceId("");
      setSelectedLocation("");
    },
    [isDragging, getAdjustedMousePosition]
  );

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!selectedDeviceId || !user?._id || !mapRef.current) return;

      const device = availableDevices.find((d) => d._id === selectedDeviceId);
      if (!device) return;

      try {
        await createItemOnMap({
          itemId: selectedDeviceId,
          mapId: mapId || "",
          userId: user._id,
          location: selectedLocation,
          x: formPosition.x,
          y: formPosition.y,
        }).unwrap();

        setShowAddForm(false);
        setSelectedDeviceId("");
        setSelectedLocation("");
      } catch (error) {
        console.error("Failed to add device:", error);
      }
    },
    [
      createItemOnMap,
      selectedDeviceId,
      availableDevices,
      formPosition,
      selectedLocation,
      user?._id,
      mapId,
    ]
  );

  const [deleteItemFromMap] = useDeleteItemFromMapMutation();

  const handleDeleteItem = useCallback(async () => {
    if (!itemToDelete) return;
    setItemsOnMap((prev) =>
      prev.filter((item) => item._id !== itemToDelete._id)
    );
    await deleteItemFromMap(itemToDelete._id);
    setShowDeletePopup(false);
    setItemToDelete(null);
  }, [itemToDelete, deleteItemFromMap]);

  const startDragging = useCallback(
    (e: React.MouseEvent, item: IItemOnMap) => {
      e.stopPropagation();
      setIsDragging(true);
      setDraggedItem(item);
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const { x: mouseX, y: mouseY } = getAdjustedMousePosition(e, rect);

      const currentPxX = (item.x / 100) * rect.width;
      const currentPxY = (item.y / 100) * rect.height;

      setDragOffset({
        x: mouseX - currentPxX,
        y: mouseY - currentPxY,
      });
    },
    [getAdjustedMousePosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !draggedItem || !mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();

      const { x: mouseX, y: mouseY } = getAdjustedMousePosition(e, rect);

      const x = mouseX - dragOffset.x;
      const y = mouseY - dragOffset.y;

      const constrainedX = Math.max(20, Math.min(x, rect.width - 20));
      const constrainedY = Math.max(20, Math.min(y, rect.height - 20));

      const xPercent = (constrainedX / rect.width) * 100;
      const yPercent = (constrainedY / rect.height) * 100;

      setItemsOnMap((prev) =>
        prev.map((item) =>
          item._id === draggedItem._id
            ? { ...item, x: xPercent, y: yPercent }
            : item
        )
      );
    },
    [isDragging, draggedItem, dragOffset, getAdjustedMousePosition]
  );

  const stopDragging = useCallback(async () => {
    if (draggedItem && user?._id) {
      try {
        await changePositionOfItems({
          id: draggedItem._id,
          x: draggedItem.x, // percentage
          y: draggedItem.y, // percentage
        }).unwrap();
      } catch (error) {
        console.error("Failed to update position:", error);
      }
    }
    setIsDragging(false);
    setDraggedItem(null);
  }, [draggedItem, changePositionOfItems, user?._id]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", stopDragging);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", stopDragging);
      };
    }
  }, [isDragging, handleMouseMove, stopDragging]);

  if (isLoading || isMapDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-700">
            Loading map...
          </h1>
        </div>
      </div>
    );
  }

  if (!map || !mapData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-red-600">
            Failed to load map data
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Card>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Project Design</h1>
              <p className="text-sm mt-1">
                Interactive device placement and management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              </div>
              <div className="bg-blue-100 px-3 py-1.5 rounded-lg">
                <span className="text-blue-700 font-medium text-sm">
                  {itemsOnMap.length} devices placed
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex-1 flex flex-col mt-6 gap-6">
        <div className="flex-1 bg-card rounded-xl shadow-lg border relative">
          <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
            <Button
              onClick={handleZoomIn}
              disabled={zoomLevel >= MAX_ZOOM}
              size="sm"
              variant="outline"
              className="w-10 h-10 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleZoomOut}
              disabled={zoomLevel <= MIN_ZOOM}
              size="sm"
              variant="outline"
              className="w-10 h-10 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleZoomReset}
              size="sm"
              variant="outline"
              className="w-10 h-10 p-0 text-xs"
            >
              1x
            </Button>
          </div>

          <div className="absolute top-4 left-4 z-50 bg-card backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
            {Math.round(zoomLevel * 100)}%
          </div>

          <div className="absolute bottom-4 left-4 z-50 bg-black/80 text-white px-3 py-1 rounded-lg text-xs">
            Size: 900×{containerHeight}px | Image:{" "}
            {map.bgImageUrl ? "Loaded" : "None"}
          </div>

          <div
            ref={mapRef}
            className="relative z-40 cursor-crosshair border rounded-lg mx-auto"
            style={{
              width: "900px",
              height: `${containerHeight}px`,
            }}
            onClick={handleMapClick}
          >
            <div
              className="absolute inset-0 w-full h-full origin-top-left transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: map.bgImageUrl
                    ? `url("${map.bgImageUrl}")`
                    : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  backgroundSize: map.bgImageUrl ? "contain" : "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />

              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full">
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {itemsOnMap.map((item, idx) => {
                const isCompleted = item.progress === 100;
                const isInProgress = item.progress > 0 && item.progress < 100;
                return (
                  <div
                    key={item._id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 cursor-pointer group/device"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      zIndex:
                        isDragging && draggedItem?._id === item._id ? 1000 : 1,
                    }}
                    onMouseDown={(e) => startDragging(e, item)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const rect = mapRef.current?.getBoundingClientRect();
                      if (!rect) return;
                      const pixelX = (item.x / 100) * rect.width;
                      const pixelY = (item.y / 100) * rect.height;
                      setDeletePosition({
                        x: pixelX,
                        y: pixelY,
                      });
                      setItemToDelete(item);
                      setShowDeletePopup(true);
                      setShowAddForm(false);
                    }}
                  >
                    <div className="relative">
                      {/* Device Circle */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-all duration-200 ${
                          isCompleted
                            ? "border-green-400 bg-green-500"
                            : isInProgress
                            ? "border-yellow-400 bg-yellow-500"
                            : "border-blue-400 bg-blue-500"
                        } group-hover/device:shadow-xl`}
                      >
                        <span className="text-xs font-bold">{idx + 1}</span>
                      </div>
                      <div
                        className={`absolute -top-1 right-0 w-2 h-2 rounded-full border border-white ${
                          isCompleted
                            ? "bg-green-400"
                            : isInProgress
                            ? "bg-yellow-400 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/device:opacity-100 transition-opacity duration-200">
                        {item.label} {item.location && `• ${item.location}`}
                      </div>
                      {isDragging &&
                        draggedItem?._id === item._id &&
                        isUpdatingPosition && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Updating...
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>

            {showAddForm && (
              <div
                className="absolute bg-white dark:bg-black rounded-lg shadow-xl border p-4 z-50 min-w-[320px]"
                style={{
                  left: `${Math.min(
                    percentToPx(formPosition.x, "width") * zoomLevel,
                    window.innerWidth - 350
                  )}px`,
                  top: `${Math.min(
                    percentToPx(formPosition.y, "height") * zoomLevel,
                    window.innerHeight - 300
                  )}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <form onSubmit={handleFormSubmit}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-500" />
                      Add Device
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddForm(false);
                      }}
                      className="p-1 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {isCreating && (
                    <div className="mb-4 flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Adding device...</span>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Device *
                      </label>
                      <div className="relative">
                        <select
                          value={selectedDeviceId}
                          onChange={(e) => {
                            e.stopPropagation();
                            setSelectedDeviceId(e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-black appearance-none pr-8"
                          required
                        >
                          <option value="">Choose a device...</option>
                          {availableDevices.map((device) => (
                            <option key={device._id} value={device._id}>
                              {device.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={selectedLocation}
                          onChange={(e) => {
                            e.stopPropagation();
                            setSelectedLocation(e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Enter location..."
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pl-9"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddForm(false);
                        }}
                        className="flex-1 bg-white dark:bg-gray-900 px-3 py-2 border rounded-lg transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!selectedDeviceId || isCreating}
                        className="flex-1 px-3 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {isCreating ? "Adding..." : "Add Device"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {showDeletePopup && itemToDelete && (
              <div
                className="absolute bg-white dark:bg-black rounded-lg shadow-xl border p-4 z-50 min-w-[200px]"
                style={{
                  left: `${Math.min(
                    deletePosition.x * zoomLevel,
                    window.innerWidth - 220
                  )}px`,
                  top: `${Math.min(
                    deletePosition.y * zoomLevel,
                    window.innerHeight - 150
                  )}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-red-600">
                    Remove Device
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeletePopup(false);
                    }}
                    className="p-1 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">{itemToDelete.label}</p>
                    <p className="text-xs">
                      {itemToDelete.location || "No location assigned"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem();
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Device</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Card className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Type of Devices</h2>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {availableDevices.length}
            </span>
          </div>

          {availableDevices.length === 0 ? (
            <div className="text-center py-8">
              <Cpu className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No devices available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {availableDevices.map((device) => (
                <div
                  key={device._id}
                  className="rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        backgroundColor: "#6366f1",
                      }}
                    >
                      {device.shape === "square"
                        ? "■"
                        : device.shape === "circle"
                        ? "●"
                        : "▲"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {device.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="px-5 py-4">
          <h4>The place for table with devices</h4>
        </Card>
      </div>
    </div>
  );
}
