import App from "@/App";
// import { DashboardLayout } from "@/pages/dashboard";
import ErrorPage from "@/pages/error-page";
// import Home from "@/pages/home";
import Login from "@/pages/login";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    Component: App,
    children: [
      {
        path: "/",
        Component: Login,
      },
      // {
      //   path: "/dashboard",
      //   Component: DashboardLayout,
      // },
    ],
  },
]);
