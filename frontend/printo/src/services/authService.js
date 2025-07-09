import authApi from "@/api/authApi";

export const fetchUser = async () => {
  try {
    const response = await authApi.post("/me");
    if (response.data.user) {
      return response.data.user;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Unauthorized");
    }
    console.error("Error fetching user:", error);
    throw error;
  }
};


export const logout = async () => {
  try {
    const response = await authApi.post("/logout");
    if (response.status === 200) {
      return true;
    }
    throw new Error("Logout failed");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}