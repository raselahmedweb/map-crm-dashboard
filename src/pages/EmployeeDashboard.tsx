import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Search, Trash2, AlertTriangle, X, RefreshCcw } from "lucide-react";
import {
  useGetUserQuery,
  useUpdateUserByAdminMutation,
} from "@/redux/api/baseApi";
import type { Employee } from "@/types/types";

const UserRoles: string[] = [
  "ADMIN",
  "ASSISTANT",
  "SALES_TECHNICIAN",
  "SALES_SPECIALIST",
  "PROJECT_DESIGNER",
  "COLLABORATOR",
  "INSTALLER",
  "TECHNICIAN",
  "CUSTOMER",
];
const EmployeeDashboard: React.FC = () => {
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string>("");

  const { data, isLoading } = useGetUserQuery(
    { name: searchTerm, designation: selectedDesignation },
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const [updateUser] = useUpdateUserByAdminMutation();

  const [employees, setEmployees] = useState<Employee[]>([]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = data?.meta?.total;
    const deleted = employees.filter((emp) => emp.isDeleted === true).length;

    return [
      {
        title: "Total Employee",
        count: total,
        color: "text-gray-600",
        bgColor: "bg-gray-50 dark:bg-black",
        icon: "👥",
      },
      {
        title: "Deleted",
        count: deleted,
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: "✅",
      },
    ];
  }, [data?.meta?.total, employees]);

  useEffect(() => {
    if (data?.data && Array.isArray(data?.data)) {
      setEmployees(data?.data);
      // console.log(data?.data);
    }
  }, [data]);

  // Export to csv

  const exportToCSV = () => {
    if (employees.length === 0) return alert("No data to export!");

    const headers = Object.keys(employees[0]);
    const csvRows = [headers.join(",")];

    for (const user of employees) {
      const values = headers.map((header) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (user as any)[header];
        // handle commas, quotes, newlines safely
        const escaped =
          value === undefined || value === null
            ? ""
            : `"${String(value).replace(/"/g, '""')}"`;
        return escaped;
      });
      csvRows.push(values.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Generate avatar placeholder
  const getAvatarColor = (name: string): string => {
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-purple-400",
      "bg-pink-400",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const handleEdit = (employeeId: string) => {
    setIsOpen(true);
    setEditingEmployeeId(employeeId);
  };

  const handleDelete = () => {
    updateUser({ _id: editingEmployeeId, isDeleted: true });
    // setEmployees((prev) => prev.filter((emp) => emp._id !== editingEmployeeId));
  };
  let isLoadingRestore = false;
  const handleRestore = (employeeId: string) => {
    isLoadingRestore = loadingId === employeeId;
    setTimeout(() => {
      updateUser({ _id: employeeId, isDeleted: false });
      setLoadingId(null);
    }, 500);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Employee</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <span>🏠</span> / Employee / Employee List
          </nav>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:bg-black"
          >
            📊 Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 bg-card border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center text-lg`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex  p-4 flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Designation</option>
              {UserRoles.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees &&
                employees.map((employee) => (
                  <tr
                    key={employee._id}
                    className="hover:bg-gray-50 dark:bg-black"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${getAvatarColor(
                            employee.name
                          )} flex items-center justify-center text-white text-sm font-medium`}
                        >
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {employee.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {employee.email}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-500">
                      {format(new Date(employee.createdAt), "MMMM d, yyyy")}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.isDeleted
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {employee.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {employee.isDeleted ? (
                          <button
                            onClick={() => handleRestore(employee._id)}
                            className={`text-green-600 hover:text-green-800 p-1`}
                          >
                            <RefreshCcw
                              size={16}
                              // Apply the class directly to the icon
                              className={`${
                                isLoadingRestore ? "spin-out" : ""
                              }`}
                            />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(employee._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing 1 to {Math.min(rowsPerPage, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} entries
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 dark:bg-black">
              Previous
            </button>
            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 dark:bg-black">
              Next
            </button>
          </div>
        </div> */}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Modal Content */}
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Delete Confirmation
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this?
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
