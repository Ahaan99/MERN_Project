import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { FaUser, FaSearch } from "react-icons/fa";
import adminApi from "@/api/adminApi";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";

const User_Admin = () => {
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | user | seller

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await adminApi("/get-all-users");
        setUsers(res.data); // set fetched users
        console.log("all registered users: ", res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteUserId) return;
    try {
      await adminApi.delete(`/delete-user/${deleteUserId}`);
      // Refetch users after delete to update the table
      const res = await adminApi("/get-all-users");
      setUsers(res.data);
    } catch (error) {
      alert("Failed to delete user.");
      console.error("Delete user error:", error);
    } finally {
      setDeleteUserId(null);
    }
  };

  // Filter users by search term (name or email)
  let filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Further filter by role
  if (roleFilter === "user") {
    filteredUsers = filteredUsers.filter((user) => !user.isSeller);
  } else if (roleFilter === "seller") {
    filteredUsers = filteredUsers.filter((user) => user.isSeller);
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-background to-muted dark:from-background dark:to-zinc-900 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tracking-tight text-center">
              Registered Users
            </CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <div className="relative w-full max-w-xs">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <FaSearch className="text-base" />
                </span>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm bg-background focus:ring-0 focus:border-primary focus:outline-none focus-visible:outline-none outline-none"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background focus:ring-0 focus:border-primary focus:outline-none focus-visible:outline-none outline-none"
              >
                <option value="all">All</option>
                <option value="user">User</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16"></TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                    >
                      <TableCell>
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            <FaUser className="text-lg text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteUserId(user._id)}
                              disabled={user.isAdmin}
                              title={
                                user.isAdmin
                                  ? "Cannot delete admin"
                                  : "Delete user"
                              }
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this user?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setDeleteUserId(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                disabled={user.isAdmin}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default User_Admin;
