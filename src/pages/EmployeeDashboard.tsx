import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

// Types
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  joiningDate: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

interface StatsCard {
  title: string;
  count: number;
  change: string;
  color: string;
  bgColor: string;
  icon: string;
}

// Sample data
const sampleEmployees: Employee[] = [
  {
    id: "Emp-001",
    name: "Anthony Lewis",
    email: "anthony@example.com",
    phone: "(123) 4567 890",
    designation: "Finance",
    joiningDate: "12/09/2024",
    status: "Active",
  },
  {
    id: "Emp-002",
    name: "Brian Villalobos",
    email: "brian@example.com",
    phone: "(179) 7382 829",
    designation: "Developer",
    joiningDate: "24/10/2024",
    status: "Active",
  },
  {
    id: "Emp-003",
    name: "Harvey Smith",
    email: "harvey@example.com",
    phone: "(184) 2719 738",
    designation: "Executive",
    joiningDate: "18/02/2024",
    status: "Active",
  },
  {
    id: "Emp-004",
    name: "Stephan Peralt",
    email: "peral@example.com",
    phone: "(193) 7839 748",
    designation: "Executive",
    joiningDate: "17/10/2024",
    status: "Active",
  },
  {
    id: "Emp-005",
    name: "Doglas Martini",
    email: "martiniwr@example.com",
    phone: "(183) 9302 890",
    designation: "Manager",
    joiningDate: "20/07/2024",
    status: "Active",
  },
  {
    id: "Emp-006",
    name: "Linda Ray",
    email: "ray456@example.com",
    phone: "(120) 3728 039",
    designation: "Finance",
    joiningDate: "10/04/2024",
    status: "Active",
  },
  {
    id: "Emp-007",
    name: "Elliot Murray",
    email: "murray@example.com",
    phone: "(102) 8480 832",
    designation: "Developer",
    joiningDate: "29/08/2024",
    status: "Active",
  },
  {
    id: "Emp-008",
    name: "Rebecca Smith",
    email: "smith@example.com",
    phone: "(162) 8920 713",
    designation: "Executive",
    joiningDate: "22/02/2024",
    status: "Inactive",
  },
];

const EmployeeDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("Last 7 Days");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate stats
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((emp) => emp.status === "Active").length;
    const inactive = employees.filter(
      (emp) => emp.status === "Inactive"
    ).length;
    const newJoiners = employees.filter((emp) => {
      const joinDate = new Date(emp.joiningDate.split("/").reverse().join("-"));
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return joinDate >= sevenDaysAgo;
    }).length;

    return [
      {
        title: "Total Employee",
        count: total,
        change: "+19.01%",
        color: "text-gray-600",
        bgColor: "bg-gray-50 dark:bg-black",
        icon: "👥",
      },
      {
        title: "Active",
        count: active,
        change: "+19.01%",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: "✅",
      },
      {
        title: "Inactive",
        count: inactive,
        change: "+19.01%",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: "❌",
      },
      {
        title: "New Joiners",
        count: newJoiners,
        change: "+19.01%",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: "👋",
      },
    ];
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDesignation =
        !selectedDesignation || emp.designation === selectedDesignation;
      const matchesStatus = !selectedStatus || emp.status === selectedStatus;

      return matchesSearch && matchesDesignation && matchesStatus;
    });
  }, [employees, searchTerm, selectedDesignation, selectedStatus]);

  // Get unique designations
  const designations = useMemo(() => {
    return [...new Set(employees.map((emp) => emp.designation))];
  }, [employees]);

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
    console.log("Edit employee:", employeeId);
  };

  const handleDelete = (employeeId: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    }
  };

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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:bg-black">
            📊 Export <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            <Plus size={16} /> Add Employee
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
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} />
              <span>07/16/2025 - 07/22/2025</span>
              <ChevronDown size={16} />
            </div>

            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Designation</option>
              {designations.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="Last 7 Days">Sort By: Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
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
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm">
            <span>Row Per Page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>Entries</span>
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
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
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
              {filteredEmployees.slice(0, rowsPerPage).map((employee) => (
                <tr
                  key={employee.id}
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
                          {employee.designation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {employee.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {employee.phone}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                      {employee.designation}
                      <ChevronDown size={12} />
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {employee.joiningDate}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(employee.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
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
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
