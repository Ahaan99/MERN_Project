import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      link: "/admin/products",
      color: "bg-blue-500"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      link: "/admin/orders",
      color: "bg-green-500"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      link: "/admin/revenue",
      color: "bg-purple-500"
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      link: "/admin/orders?status=pending",
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="block p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center text-white`}>
                <span className="text-xl font-bold">{card.value.toString()[0]}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/admin/products/add" 
              className="p-4 border rounded-lg text-center hover:bg-gray-50"
            >
              Add New Product
            </Link>
            <Link 
              to="/admin/orders" 
              className="p-4 border rounded-lg text-center hover:bg-gray-50"
            >
              View Orders
            </Link>
            <Link 
              to="/admin/products" 
              className="p-4 border rounded-lg text-center hover:bg-gray-50"
            >
              Manage Products
            </Link>
            <Link 
              to="/admin/customers" 
              className="p-4 border rounded-lg text-center hover:bg-gray-50"
            >
              View Customers
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">New Order #1234</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
              <Link 
                to="/admin/orders/1234" 
                className="text-indigo-600 hover:text-indigo-800"
              >
                View
              </Link>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Product Updated: Classic T-Shirt</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
              <Link 
                to="/admin/products/edit/1" 
                className="text-indigo-600 hover:text-indigo-800"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
