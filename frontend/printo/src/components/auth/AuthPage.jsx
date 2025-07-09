import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [token, navigate, location]);

  // Determine active tab from the current path
  const currentTab = location.pathname.includes("register")
    ? "register"
    : "login";

  // Handle tab change
  const handleTabChange = (value) => {
    navigate(`/auth/${value}`, {
      state: { from: location.state?.from },
    });
  };

  // Update URL on initial load if needed
  useEffect(() => {
    if (location.pathname === "/auth") {
      navigate("/auth/login", {
        replace: true,
        state: { from: location.state?.from },
      });
    }
  }, [location.pathname, navigate, location.state]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentTab === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-2 text-gray-600">
            {currentTab === "login"
              ? "Please log in to your account"
              : "Please fill in your details to create an account"}
          </p>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <LoginForm from={location.state?.from} />
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <RegisterForm from={location.state?.from} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
