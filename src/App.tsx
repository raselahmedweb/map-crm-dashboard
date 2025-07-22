// import { Outlet } from "react-router";

// function App() {
//   return (
//     <>
//       <Outlet />
//     </>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "./providers/theme-provider";

import AdminDashboard from "@/pages/AdminDashboard";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import ItemsDashboard from "@/pages/ItemsDashboard";
import Chat from "@/pages/Chat";
import Email from "@/pages/Email";
import Todo from "@/pages/Todo";
import Companies from "@/pages/Companies";
import Clients from "@/pages/Clients";
import Projects from "@/pages/Projects";
import FloorPlan from "@/pages/FloorPlan";
import Completed from "@/pages/Completed";
import LeaveRequests from "@/pages/LeaveRequests";
import ClockInOut from "@/pages/ClockInOut";
import { DashboardLayout } from "./components/dashboard-layout";
import "./index.css";
import Login from "./pages/login";
import { PrivateRoute } from "./components/RouteProtect";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/items-dashboard" element={<ItemsDashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/email" element={<Email />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/floor-plan" element={<FloorPlan />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/leave-requests" element={<LeaveRequests />} />
            <Route path="/clock-in-out" element={<ClockInOut />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
