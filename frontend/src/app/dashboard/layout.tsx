import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { getProfile, getToken } from "@/lib/auth";
import { AuthProvider } from "./context";
import logoutAction from "./logout-action";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const token = (await getToken()) ?? "";
  const getProfileSafe = async (token: string) => {
    try {
      return (await getProfile(token)).data;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };

  return (
    <AuthProvider token={token} profile={await getProfileSafe(token)}>
      <div className="min-h-screen">
        {/* Navbar */}
        <Navbar logoutHandler={logoutAction} />

        {/* Main content */}
        <div className="flex pt-16 min-h-screen">
          {/* Sidebar - hidden on mobile */}
          <Sidebar />

          {/* Main content area */}
          <main className="flex-1 md:ml-64 p-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
