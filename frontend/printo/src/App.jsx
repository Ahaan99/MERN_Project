import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { ProtectedRoute, AdminRoute } from "@/routes/ProtectedRoute";
import { Home } from "@/pages/Home";
import { Profile } from "@/pages/Profile";
import { UserProfileLayout } from "@/layouts/UserProfileLayout";
import Account from "@/components/user/Account";
import AuthPage from "@/components/auth/AuthPage";
import AdminLayout from "./layouts/AdminLayout";
import Admin_Products from "./components/admin/Admin_Products";
import { Products } from "./pages/Products";
import UserCart from "./components/user/UserCart";
import User_Admin from "./components/auth/User_Admin";
import ProductDetail from "./components/product/ProductDetail";
import Orders_Admin from "./components/admin/Orders_Admin";
import Payment from "./components/user/Payment";
import Orders_User from "@/components/user/Orders_User";
import Dashboard_Admin from "./components/admin/Dashboard_Admin";
import Customizable_Products_Admin from "./components/admin/Customizable_Products_Admin";
import Customizable_Products from "./pages/Customizable_Products";
import Customize from "./pages/Customize";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AuthProvider>
              <RootLayout />
            </AuthProvider>
          }
        >
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="customize/:id?" element={<Customize />} />
          <Route path="auth/*" element={<AuthPage />} />
          <Route path="customizable" element={<Customizable_Products />} />
          <Route path="customizable/:id" element={<Customize />} />

          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute>
                <UserProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route path="account" element={<Account />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="orders" element={<Orders_User />} />
            <Route path="payment" element={<Payment />} />
            <Route path="settings" element={<Profile />} />
          </Route>
        </Route>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </AuthProvider>
          }
        >
          <Route path="dashboard" element={<Dashboard_Admin />} />
          <Route path="users" element={<User_Admin />} />
          <Route path="products" element={<Admin_Products />} />
          <Route
            path="customizable-products"
            element={<Customizable_Products_Admin />}
          />
          <Route path="orders" element={<Orders_Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}
