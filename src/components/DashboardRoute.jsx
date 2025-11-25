import { Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import InstructorDashboard from "../pages/InstructorDashboard";
import { UserAuth } from "../context/AuthContext";

export default function DashboardRoute() {
  const { session, userRole } = UserAuth();
  const user = session?.user;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole === "instructor") {
    return <InstructorDashboard user={user} />;
  }

  return <Dashboard user={user} />;
}

