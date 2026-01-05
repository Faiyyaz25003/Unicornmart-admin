
"use client";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Ban,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [token, setToken] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Get token from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = window.localStorage.getItem("token");
      setToken(storedToken || "");
    }
  }, []);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((user) =>
        filterStatus === "blocked" ? user.isBlocked : !user.isBlocked
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, filterStatus, users]);

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      alert("Delete failed");
    }
  };

  /* ================= BLOCK / UNBLOCK ================= */
  const toggleBlock = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/block/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => !u.isBlocked).length,
    blocked: users.filter((u) => u.isBlocked).length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <User className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
            User Management
          </h1>
          <p className="text-slate-600">Manage and monitor all system users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">
                  {stats.total}
                </p>
              </div>
              <User className="w-8 h-8 text-indigo-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Blocked</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.blocked}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.admins}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table/Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* List View (Table) */}
          {viewMode === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-slate-800">
                            {user.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleBlock(user._id)}
                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors group"
                            title={
                              user.isBlocked ? "Unblock user" : "Block user"
                            }
                          >
                            <Ban className="w-4 h-4 text-orange-600 group-hover:text-orange-700" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View (Cards) */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* User Avatar & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-lg truncate">
                        {user.name || "N/A"}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Role & Status Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" />
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBlock(user._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm border border-orange-200"
                    >
                      <Ban className="w-4 h-4" />
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No users found
              </h3>
              <p className="text-slate-500">
                {searchTerm || filterRole !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "No users available in the system"}
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 text-center text-sm text-slate-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}