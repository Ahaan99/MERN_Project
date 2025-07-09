import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/user/Sidebar";

export const UserProfileLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />
        <main className="flex-1">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
