// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function ComplaintsList() {
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/complaints")
//       .then((res) => setComplaints(res.data));
//   }, []);

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>All Complaints</h2>
//       {complaints.map((c) => (
//         <div
//           key={c._id}
//           style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
//         >
//           <h4>{c.subject}</h4>
//           <p>{c.message}</p>
//           <small>
//             {c.name} | {c.email}
//           </small>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  List,
  Search,
  Mail,
  User,
  Calendar,
  ChevronDown,
} from "lucide-react";

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredComplaints = complaints
    .filter(
      (c) =>
        c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest")
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      return 0;
    });

  const ComplaintCard = ({ complaint, isGrid }) => (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
        isGrid ? "" : "mb-4"
      }`}
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {complaint.subject}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{complaint.message}</p>
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-500" />
            <span className="font-medium">{complaint.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-purple-500" />
            <span className="truncate">{complaint.email}</span>
          </div>
          {complaint.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-green-500" />
              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          ID: {complaint._id?.slice(-6)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Complaints Dashboard
          </h1>
          <p className="text-gray-600">
            Showing {filteredComplaints.length} complaint(s)
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {/* Sort */}
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full md:w-auto px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Grid View"
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="List View"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading complaints...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredComplaints.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No complaints found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No complaints have been submitted yet"}
            </p>
          </div>
        )}

        {/* Complaints Grid/List */}
        {!loading && filteredComplaints.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col"
            }
          >
            {filteredComplaints.map((c) => (
              <ComplaintCard
                key={c._id}
                complaint={c}
                isGrid={viewMode === "grid"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
