import Sidebar from "@/components/admin/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex max-h-screen py-2">
      <Sidebar />
      <main className="m-2 flex-1 rounded-xl shadow-sm overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
