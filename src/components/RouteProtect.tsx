import { Navigate } from "react-router";
import type { JSX } from "react";
import { useGetMeQuery } from "@/redux/api/baseApi";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { data, isLoading } = useGetMeQuery(
    {},
    {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isAuthenticated = data?.data?.role === "ADMIN";

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
