// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const OrderList = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/orders");
//         setOrders(response.data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <p className="text-center mt-10">Loading orders...</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">All Orders</h1>
//       {orders.length === 0 ? (
//         <p>No orders placed yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="border p-4 rounded-lg shadow hover:shadow-md transition"
//             >
//               <p>
//                 <span className="font-semibold">Name:</span> {order.name}
//               </p>
//               <p>
//                 <span className="font-semibold">Phone:</span> {order.phone}
//               </p>
//               <p>
//                 <span className="font-semibold">Product:</span>{" "}
//                 {order.productName}
//               </p>
//               <p>
//                 <span className="font-semibold">Quantity:</span>{" "}
//                 {order.quantity} Kg
//               </p>
//               <p>
//                 <span className="font-semibold">Price per Kg:</span> ₹
//                 {order.productPrice}
//               </p>
//               <p>
//                 <span className="font-semibold">Total:</span> ₹{order.total}
//               </p>
//               <p>
//                 <span className="font-semibold">Address:</span> {order.address}
//               </p>
//               <p className="text-sm text-gray-500">
//                 Placed on: {new Date(order.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderList;


"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  List,
  Grid,
  User,
  Package,
  Phone,
  MapPin,
  Calendar,
  Tag,
} from "lucide-react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone?.includes(searchTerm) ||
          order.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter (you can add status field in your orders)
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, filterStatus, orders]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
          <p className="text-gray-600 mt-1">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Orders Display */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                              {order.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Phone className="w-4 h-4" />
                              <span>{order.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-15">
                          <div className="flex items-start gap-2">
                            <Package className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">Product</p>
                              <p className="font-medium text-gray-800">
                                {order.productName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Tag className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Quantity & Price
                              </p>
                              <p className="font-medium text-gray-800">
                                {order.quantity} Kg × ₹{order.productPrice}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-medium text-gray-800">
                                {order.address}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">Placed on</p>
                              <p className="font-medium text-gray-800">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:text-right">
                        <p className="text-sm text-gray-500 mb-1">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold text-indigo-600">
                          ₹{order.total}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          {order.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {order.name}
                        </h3>
                        <p className="text-sm text-gray-600">{order.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Product</p>
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {order.productName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="font-medium text-sm text-gray-800">
                            {order.quantity} Kg × ₹{order.productPrice}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {order.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Placed on</p>
                          <p className="font-medium text-sm text-gray-800">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-xl font-bold text-indigo-600">
                          ₹{order.total}
                        </span>
                      </div>
                      <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;