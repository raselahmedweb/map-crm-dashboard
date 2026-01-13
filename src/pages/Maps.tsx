// export default function Maps() {
//   return (
//     <div>
//         <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Palette className="h-5 w-5" />
//             Maps ({maps.length})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {maps.length === 0 ? (
//             <div className="text-center py-12">
//               <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No maps yet
//               </h3>
//               <p className="text-gray-500 mb-6">
//                 Create your first map to start designing your project layout.
//               </p>
//               <Button
//                 onClick={() => setShowMapForm(true)}
//                 className="flex items-center gap-2"
//               >
//                 <Plus className="h-4 w-4" />
//                 Create First Map
//               </Button>
//             </div>
//           ) : (
//             <Table className="border">
//               <TableHeader>
//                 <TableRow className="divide-x divide-y">
//                   <TableHead>Map Name</TableHead>
//                   <TableHead>Designer</TableHead>
//                   <TableHead>Assigned To</TableHead>
//                   <TableHead>Background</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Devices</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {maps.map((map) => (
//                   <TableRow key={map._id} className="divide-x divide-y">
//                     <TableCell className="font-medium">{map.name}</TableCell>

//                     <TableCell>
//                       <div className="flex flex-col">
//                         <span className="text-sm font-medium">
//                           {map.mapDesigner?.name || "Unknown"}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {map.mapDesigner?.email}
//                         </span>
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex items-center gap-1">
//                         <Users className="h-3 w-3 text-gray-400" />
//                         <span className="text-sm">
//                           {Array.isArray(map.assignedTo)
//                             ? map.assignedTo.length
//                             : 0}{" "}
//                           user(s)
//                         </span>
//                       </div>
//                       {Array.isArray(map.assignedTo) &&
//                         map.assignedTo.length > 0 && (
//                           <div className="text-xs text-gray-500 mt-1">
//                             {map.assignedTo.slice(0, 2).map((user, idx) => (
//                               <div key={idx}>{user.name}</div>
//                             ))}
//                             {map.assignedTo.length > 2 && (
//                               <div>+{map.assignedTo.length - 2} more</div>
//                             )}
//                           </div>
//                         )}
//                     </TableCell>

//                     <TableCell>
//                       {map.bgImageUrl ? (
//                         <img
//                           src={map.bgImageUrl}
//                           alt="Map background"
//                           className="w-12 h-12 object-cover rounded border"
//                         />
//                       ) : (
//                         <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
//                           <span className="text-xs text-gray-400">
//                             No image
//                           </span>
//                         </div>
//                       )}
//                     </TableCell>

//                     <TableCell>
//                       <Badge variant={map.isComplete ? "default" : "secondary"}>
//                         {map.isComplete ? "Complete" : "In Progress"}
//                       </Badge>
//                     </TableCell>

//                     <TableCell>
//                       <span className="text-sm text-gray-600">
//                         {Array.isArray(map.availableDevices)
//                           ? map.availableDevices.length
//                           : 0}{" "}
//                         devices
//                       </span>
//                     </TableCell>

//                     <TableCell className="text-right">
//                       <div className="flex items-center gap-2 justify-end">
//                         <Button
//                           size="sm"
//                           onClick={() => handleStartDesign(map._id)}
//                           className="flex bg-blue-400 items-center gap-1"
//                         >
//                           <Pen className="h-3 w-3" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           onClick={() => navigate(`/map/${map._id}`)}
//                           className="flex items-center gap-1"
//                         >
//                           <Play className="h-3 w-3" />
//                         </Button>

//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               size="sm"
//                               variant="destructive"
//                               className="flex items-center gap-1"
//                             >
//                               <Trash2 className="h-3 w-3" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Delete Map</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Are you sure you want to delete "{map.name}"?
//                                 This action cannot be undone.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDeleteMap(map._id)}
//                                 disabled={isDeleting}
//                                 className="bg-red-600 hover:bg-red-700"
//                               >
//                                 {isDeleting ? "Deleting..." : "Delete"}
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* Create Map Form Modal/Overlay */}
//       {showMapForm && (
//         <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <CreateMapForm
//               onSubmit={handleMapSubmit}
//               onCancel={() => setShowMapForm(false)}
//               userId={user?.data?._id}
//               companyId={project?.data?.companyId._id}
//               bgImageUrl={project?.data?.imageUrl}
//             />
//           </div>
//         </div>
//       )}

//       <Button
//                 onClick={() => setShowMapForm(true)}
//                 className="flex items-center gap-2"
//               >
//                 <Plus className="h-4 w-4" />
//                 Create Map
//               </Button>
//     </div>
//   )
// }

function Maps() {
  return <div>Maps</div>;
}

export default Maps;
