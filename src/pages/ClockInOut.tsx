import React, { useState, useMemo } from "react";
import { Search, Calendar, ChevronDown, TrendingUp } from "lucide-react";

// Types
interface AttendanceRecord {
  id: string;
  name: string;
  designation: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent" | "Late";
  breakTime: string;
  lateTime: string;
  overtime: string;
  productionHours: string;
  productionStatus: "high" | "medium" | "low";
  avatar?: string;
}

// Sample data
const attendanceData: AttendanceRecord[] = [
  {
    id: "1",
    name: "Anthony Lewis",
    designation: "Finance",
    date: "14/01/2024",
    checkIn: "09:00 AM",
    checkOut: "06:45 PM",
    status: "Present",
    breakTime: "30 Min",
    lateTime: "32 Min",
    overtime: "20 Min",
    productionHours: "8.55 Hrs",
    productionStatus: "high",
  },
  {
    id: "2",
    name: "Brian Villalobos",
    designation: "Developer",
    date: "14/01/2024",
    checkIn: "09:00 AM",
    checkOut: "06:12 PM",
    status: "Present",
    breakTime: "20 Min",
    lateTime: "-",
    overtime: "45 Min",
    productionHours: "7.54 Hrs",
    productionStatus: "low",
  },
  {
    id: "3",
    name: "Connie Waters",
    designation: "Developer",
    date: "14/01/2024",
    checkIn: "09:00 AM",
    checkOut: "08:15 PM",
    status: "Present",
    breakTime: "12 Min",
    lateTime: "-",
    overtime: "-",
    productionHours: "8.35 Hrs",
    productionStatus: "high",
  },
  {
    id: "4",
    name: "Doglas Martini",
    designation: "Manager",
    date: "14/01/2024",
    checkIn: "09:00 AM",
    checkOut: "06:43 PM",
    status: "Present",
    breakTime: "23 Min",
    lateTime: "-",
    overtime: "10 Min",
    productionHours: "8.22 Hrs",
    productionStatus: "high",
  },
  {
    id: "5",
    name: "Elliot Murray",
    designation: "Developer",
    date: "14/01/2024",
    checkIn: "09:00 AM",
    checkOut: "07:13 PM",
    status: "Present",
    breakTime: "32 Min",
    lateTime: "-",
    overtime: "-",
    productionHours: "9.15 Hrs",
    productionStatus: "medium",
  },
];

// Chart data for the line chart
const chartData = [
  { month: "Jan", present: 25, absent: 5 },
  { month: "Feb", present: 45, absent: 8 },
  { month: "Mar", present: 65, absent: 12 },
  { month: "Apr", present: 70, absent: 15 },
  { month: "May", present: 80, absent: 10 },
  { month: "Jun", present: 85, absent: 8 },
  { month: "Jul", present: 100, absent: 5 },
  { month: "Aug", present: 95, absent: 7 },
  { month: "Sep", present: 78, absent: 10 },
  { month: "Oct", present: 73, absent: 13 },
  { month: "Nov", present: 78, absent: 13 },
  { month: "Dec", present: 66, absent: 16 },
];

const AttendanceReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("Last 7 Days");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState("07/16/2025 - 07/22/2025");

  // Filter attendance data
  const filteredData = useMemo(() => {
    return attendanceData.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.designation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || record.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  // Generate avatar color
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

  // Get production hours badge color
  const getProductionBadgeColor = (status: string): string => {
    switch (status) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Attendance Report</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <span>🏠</span> / HR / Attendance Report
          </nav>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white">
            📊 Export <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-card rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold">Attendance</h3>
          </div>
          <select
            value="This Year"
            className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-black"
          >
            <option value="This Year">This Year</option>
            <option value="Last Year">Last Year</option>
          </select>
        </div>

        {/* Simple chart representation */}
        <div className="relative h-64 mb-4">
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {chartData.map((data) => (
              <div
                key={data.month}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <div
                    className="w-8 bg-green-500 rounded-t"
                    style={{ height: `${data.present}px` }}
                  ></div>
                  <div
                    className="w-8 bg-pink-500 rounded-t"
                    style={{ height: `${data.absent}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Absent</span>
          </div>
        </div>
      </div>

      {/* Employee Attendance Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Employee Attendance
            </h3>

            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} />
                <span>{dateRange}</span>
                <ChevronDown size={16} />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
              >
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
              >
                <option value="Last 7 Days">Sort By: Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
              </select>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>Row Per Page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded bg-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>Entries</span>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Name</div>
            <div>Date</div>
            <div>Clock In</div>
            <div>Status</div>
            <div>Clock Out</div>
            <div>Production Hours</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredData.slice(0, rowsPerPage).map((record) => (
            <div key={record.id} className="bg-white hover:bg-gray-50 p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${getAvatarColor(
                      record.name
                    )} flex items-center justify-center text-white text-sm font-medium`}
                  >
                    {record.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {record.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.designation}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-sm text-gray-900">{record.date}</div>

                {/* Check In */}
                <div className="text-sm text-gray-900">{record.checkIn}</div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.status === "Present"
                        ? "bg-green-100 text-green-800"
                        : record.status === "Late"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>

                {/* Check Out */}
                <div className="text-sm text-gray-900">{record.checkOut}</div>

                {/* Production Hours */}
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProductionBadgeColor(
                      record.productionStatus
                    )}`}
                  >
                    {record.productionHours}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center bg-white">
          <p className="text-sm text-gray-700">
            Showing 1 to {Math.min(rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
