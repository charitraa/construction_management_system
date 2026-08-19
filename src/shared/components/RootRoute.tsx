import { ReactNode } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { PageSkeleton } from "@/shared/components/PageSkeleton";

/**
 * "/" serves two audiences: signed-out visitors get the marketing landing page,
 * signed-in users keep the dashboard they have always had at this URL.
 *
 * While the profile request is in flight we only show the skeleton if there is
 * a stored session to resolve — otherwise a first-time visitor would see an
 * application skeleton flash before the landing page.
 */
export function RootRoute({
  landing,
  app,
}: {
  landing: ReactNode;
  app: ReactNode;
}) {
  const { user, isLoading } = useAuth();

  const hasStoredSession =
    typeof window !== "undefined" && !!window.localStorage.getItem("access_token");

  if (isLoading && hasStoredSession) return <PageSkeleton />;
  if (user) return <>{app}</>;
  return <>{landing}</>;
}
