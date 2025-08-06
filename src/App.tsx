import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "./providers/theme-provider";

import AdminDashboard from "@/pages/AdminDashboard";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import Chat from "@/pages/Chat";
import Email from "@/pages/Email";
import Todo from "@/pages/Todo";
import Companies from "@/pages/Companies";
import Clients from "@/pages/Clients";
import Projects from "@/pages/Project";
import Completed from "@/pages/Completed";
import LeaveRequests from "@/pages/LeaveRequests";
import ClockInOut from "@/pages/ClockInOut";
import { DashboardLayout } from "./components/dashboard-layout";
import Login from "./pages/login";
import { PrivateRoute } from "./components/RouteProtect";
import "./index.css";
import { ToastContainer } from "react-toastify";
import NotFound from "./pages/not-found";
import Device from "./pages/Device";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Not found page */}

          {/* All other routes protected */}
          <Route
            path="*"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route
                      path="/employee-dashboard"
                      element={<EmployeeDashboard />}
                    />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/email" element={<Email />} />
                    <Route path="/todo" element={<Todo />} />
                    <Route path="/devices" element={<Device />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/completed" element={<Completed />} />
                    <Route path="/leave-requests" element={<LeaveRequests />} />
                    <Route path="/clock-in-out" element={<ClockInOut />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
