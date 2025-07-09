import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import authApi from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";

const RegisterForm = ({ from = "/" }) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const calculatePasswordStrength = (password) => {
    // Simple strength based on length
    return Math.min(100, (password.length / 10) * 100);
  };
  const validatePassword = (password) => {
    return {
      isValid: password.length >= 6,
      requirements: {
        length: password.length >= 6,
      },
    };
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } // Password validation
    const { isValid } = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isValid) {
      newErrors.password = "Password must be at least 6 characters long";
      if (!requirements.validChars)
        missingReqs.push(
          "only use letters, numbers, and allowed special characters (@$!%*?&)"
        );

      newErrors.password = `Password must ${missingReqs.join(", ")}`;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update password strength when password changes
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;

      console.log("Registering user with data:", registerData);
      const response = await authApi.post("/register", registerData);

      if (response.status === 201) {
        console.log(response.data);
        setUser(response.data.user);
        toast.success("Registration successful!");
        navigate("/"); // Use navigate function instead of returning Navigate component
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);

      // Handle specific backend validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.message
      ) {
        // Handle specific error cases
        if (error.response.data.message.includes("exists")) {
          setErrors({ email: "This email is already registered" });
        }
      }
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up to start shopping and customizing products
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              aria-invalid={!!errors.name}
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                aria-invalid={!!errors.password}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formData.password && (
              <div className="space-y-2">
                <Progress
                  value={passwordStrength}
                  className={getPasswordStrengthColor(passwordStrength)}
                />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Password requirements:</p>
                  <ul className="space-y-1 text-gray-500">
                    <li
                      className={
                        formData.password.length >= 8 ? "text-green-600" : ""
                      }
                    >
                      ✓ At least 8 characters
                    </li>
                    <li
                      className={
                        /[a-z]/.test(formData.password) ? "text-green-600" : ""
                      }
                    >
                      ✓ One lowercase letter
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(formData.password) ? "text-green-600" : ""
                      }
                    >
                      ✓ One uppercase letter
                    </li>
                    <li
                      className={
                        /\d/.test(formData.password) ? "text-green-600" : ""
                      }
                    >
                      ✓ One number
                    </li>
                    <li
                      className={
                        /[@$!%*?&]/.test(formData.password)
                          ? "text-green-600"
                          : ""
                      }
                    >
                      ✓ One special character (@$!%*?&)
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500">
                  Password strength:{" "}
                  {passwordStrength <= 20
                    ? "Very Weak"
                    : passwordStrength <= 40
                    ? "Weak"
                    : passwordStrength <= 60
                    ? "Fair"
                    : passwordStrength <= 80
                    ? "Good"
                    : "Strong"}
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                aria-invalid={!!errors.confirmPassword}
                autoComplete="new-password"
                className="mb-8"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
