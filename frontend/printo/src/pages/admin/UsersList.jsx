import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/users");
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, isBlocked) => {
    try {
      await axios.put(`/api/users/${userId}`, { isBlocked: !isBlocked });
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const toggleAdminRole = async (userId, isAdmin) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { isAdmin: !isAdmin });
      toast.success(
        `Admin role ${isAdmin ? "removed" : "granted"} successfully`
      );
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Admin" : "User"}</td>
                <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => toggleUserStatus(user._id, user.isBlocked)}
                    className={`btn btn-sm ${
                      user.isBlocked ? "btn-success" : "btn-error"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => toggleAdminRole(user._id, user.isAdmin)}
                    className="btn btn-sm btn-primary"
                  >
                    {user.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
