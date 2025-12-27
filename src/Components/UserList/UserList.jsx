"use client";
import { useEffect, useState } from "react";
import {
  User,
  Store,
  Trash2,
  Edit,
  Ban,
  LayoutGrid,
  List,
  Search,
  Filter,
  UserX,
} from "lucide-react";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      const userData = Array.isArray(data) ? data : [];
      setUsers(userData);
      setFilteredUsers(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users]);

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleBlock = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/block/${id}`, {
        method: "PUT",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage and monitor all users in your platform
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* CONTROLS */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* SEARCH */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {/* FILTER */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="buyer">Buyers</option>
                <option value="seller">Sellers</option>
              </select>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex gap-2">
              <button
                onClick={() => setView("list")}
                className={`p-3 rounded-lg transition-all ${
                  view === "list"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List size={20} />
              </button>

              <button
                onClick={() => setView("grid")}
                className={`p-3 rounded-lg transition-all ${
                  view === "grid"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>

          {/* RESULTS COUNT */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {users.length}
              </span>{" "}
              users
            </p>
          </div>

          {/* ================= LIST VIEW (TABLE) ================= */}
          {view === "list" && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-600">{user.phone}</td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                          ${
                            user.role === "seller"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role === "seller" ? (
                            <Store size={14} />
                          ) : (
                            <User size={14} />
                          )}
                          {user.role?.charAt(0).toUpperCase() +
                            user.role?.slice(1)}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => toggleBlock(user._id)}
                            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                            title="Block/Unblock"
                          >
                            <Ban size={18} />
                          </button>

                          <button
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= GRID VIEW ================= */}
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                      ${
                        user.role === "seller"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role === "seller" ? (
                        <Store size={14} />
                      ) : (
                        <User size={14} />
                      )}
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <span className="text-indigo-600">✉</span> {user.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    <span className="text-indigo-600">📱</span> {user.phone}
                  </p>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => toggleBlock(user._id)}
                      className="flex-1 p-2.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-medium text-sm"
                      title="Block/Unblock"
                    >
                      <Ban size={16} className="mx-auto" />
                    </button>

                    <button
                      className="flex-1 p-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                      title="Edit"
                    >
                      <Edit size={16} className="mx-auto" />
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="flex-1 p-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                      title="Delete"
                    >
                      <Trash2 size={16} className="mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NO RESULTS */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserX size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No users found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
