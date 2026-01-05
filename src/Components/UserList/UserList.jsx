"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Shield,
  Ban,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      alert("Delete failed");
    }
  };

  /* ================= BLOCK / UNBLOCK ================= */
  const toggleBlock = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      alert("Action failed");
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👥 All Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3 flex items-center gap-2">
                  <User size={18} />
                  {user.name || "N/A"}
                </td>

                <td className="p-3 flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </td>

                <td className="p-3 flex items-center gap-2 capitalize">
                  <Shield size={16} />
                  {user.role}
                </td>

                <td className="p-3">
                  {user.isBlocked ? (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle size={16} /> Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={16} /> Active
                    </span>
                  )}
                </td>

                <td className="p-3 text-center space-x-3">
                  <button
                    onClick={() => toggleBlock(user._id)}
                    className="text-orange-600 hover:underline"
                  >
                    <Ban size={18} />
                  </button>

                  <button
                    onClick={() => deleteUser(user._id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
