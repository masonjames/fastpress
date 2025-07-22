import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { LoadingSpinner } from "./LoadingSpinner";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const AdminRouteGuard = React.memo(({ 
  children, 
  allowedRoles = ["administrator", "editor"] 
}: AdminRouteGuardProps) => {
  const navigate = useNavigate();
  const currentUser = useQuery(api.auth.currentUserFull);

  useEffect(() => {
    // Wait for user data to load
    if (currentUser === undefined) return;

    // If no user is found, let the auth flow handle it
    if (!currentUser) return;

    // Check if user has an allowed role
    const userRoleSlug = currentUser.roleSlug;
    if (userRoleSlug && !allowedRoles.includes(userRoleSlug)) {
      // User has insufficient privileges
      toast.error(`Access denied. Admin access requires ${allowedRoles.join(" or ")} role.`);
      navigate("/", { replace: true });
      return;
    }

    // If user doesn't have a role yet, default to subscriber access
    if (!userRoleSlug) {
      toast.error("Access denied. Admin access requires elevated privileges.");
      navigate("/", { replace: true });
      return;
    }
  }, [currentUser, navigate, allowedRoles]);

  // Show loading while checking permissions
  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-gray-600">Checking permissions...</span>
      </div>
    );
  }

  // If user is not authenticated, let parent handle it
  if (!currentUser) {
    return <>{children}</>;
  }

  // If user doesn't have required role, don't render children
  const userRoleSlug = currentUser.roleSlug;
  if (!userRoleSlug || !allowedRoles.includes(userRoleSlug)) {
    return null; // Already navigated away
  }

  return <>{children}</>;
});

AdminRouteGuard.displayName = "AdminRouteGuard";