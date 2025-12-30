
"use client";

import { useEffect, useState } from "react";
import {
  User,
  Store,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function UserStats() {
  const [stats, setStats] = useState({
    buyers: 0,
    sellers: 0,
    revenue: 0,
    recentOrders: 0,
  });
  const [users, setUsers] = useState({ buyers: [], sellers: [] });
  const [chartData, setChartData] = useState({
    revenueOverTime: [],
    ordersByDay: [],
    userDistribution: [],
    topBuyers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users
        const resUsers = await fetch("http://localhost:5000/api/users");
        const dataUsers = await resUsers.json();

        // Split buyers and sellers
        const buyersList = dataUsers.filter((u) => u.role === "buyer");
        const sellersList = dataUsers.filter((u) => u.role === "seller");

        // Fetch orders
        const resOrders = await fetch("http://localhost:5000/api/orders");
        const dataOrders = await resOrders.json();

        // Revenue calculation
        const revenue = dataOrders.reduce((acc, order) => acc + order.total, 0);

        // Orders in last 3 days
        const now = new Date();
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(now.getDate() - 3);

        const recentOrders = dataOrders.filter(
          (order) => new Date(order.createdAt) >= threeDaysAgo
        ).length;

        setStats({
          buyers: buyersList.length,
          sellers: sellersList.length,
          revenue,
          recentOrders,
        });

        setUsers({ buyers: buyersList, sellers: sellersList });

        // Generate chart data
        generateChartData(dataOrders, buyersList, sellersList);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generateChartData = (orders, buyers, sellers) => {
    // Revenue over time (last 7 days)
    const revenueByDay = {};
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      revenueByDay[dateStr] = 0;
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const dateStr = orderDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (revenueByDay[dateStr] !== undefined) {
        revenueByDay[dateStr] += order.total;
      }
    });

    const revenueOverTime = Object.keys(revenueByDay).map((date) => ({
      date,
      revenue: revenueByDay[date],
    }));

    // Orders by day (last 7 days)
    const ordersByDay = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      ordersByDay[dateStr] = 0;
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const dateStr = orderDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (ordersByDay[dateStr] !== undefined) {
        ordersByDay[dateStr]++;
      }
    });

    const ordersData = Object.keys(ordersByDay).map((date) => ({
      date,
      orders: ordersByDay[date],
    }));

    // User distribution
    const userDistribution = [
      { name: "Buyers", value: buyers.length, color: "#3b82f6" },
      { name: "Sellers", value: sellers.length, color: "#10b981" },
    ];

    // Top buyers by order count
    const buyerOrders = {};
    orders.forEach((order) => {
      const buyerId = order.buyerId || order.userId;
      if (buyerId) {
        buyerOrders[buyerId] = (buyerOrders[buyerId] || 0) + 1;
      }
    });

    const topBuyers = Object.entries(buyerOrders)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const buyer = buyers.find((b) => b._id === id);
        return {
          name: buyer ? buyer.name || buyer.email.split("@")[0] : "Unknown",
          orders: count,
        };
      });

    setChartData({
      revenueOverTime,
      ordersByDay: ordersData,
      userDistribution,
      topBuyers,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Activity className="w-16 h-16 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Dashboard Analytics
        </h1>
        <p className="text-gray-600">Real-time insights and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <User size={40} className="text-blue-600" />
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="text-gray-500 text-sm">Total Buyers</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-1">
            {stats.buyers}
          </h2>
          <p className="text-green-500 text-sm">Active users</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <Store size={40} className="text-green-600" />
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="text-gray-500 text-sm">Total Sellers</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-1">
            {stats.sellers}
          </h2>
          <p className="text-green-500 text-sm">Registered vendors</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={40} className="text-yellow-600" />
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-1">
            ${stats.revenue.toFixed(2)}
          </h2>
          <p className="text-green-500 text-sm">All time earnings</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart size={40} className="text-purple-600" />
            <Activity size={20} className="text-blue-500" />
          </div>
          <p className="text-gray-500 text-sm">Recent Orders</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-1">
            {stats.recentOrders}
          </h2>
          <p className="text-blue-500 text-sm">Last 3 days</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Over Time */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Revenue Trend (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.revenueOverTime}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Day */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Orders by Day (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            User Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Buyers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Top 5 Buyers
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.topBuyers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#6b7280"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="orders" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Buyers & Sellers Lists */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Buyers List</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {users.buyers.length}
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {users.buyers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No buyers found</p>
            ) : (
              <ul className="space-y-2">
                {users.buyers.map((buyer, index) => (
                  <li
                    key={buyer._id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {buyer.name || buyer.email}
                        </p>
                        <p className="text-sm text-gray-500">{buyer.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Sellers List
            </h3>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {users.sellers.length}
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {users.sellers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sellers found</p>
            ) : (
              <ul className="space-y-2">
                {users.sellers.map((seller, index) => (
                  <li
                    key={seller._id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Store size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {seller.name || seller.email}
                        </p>
                        <p className="text-sm text-gray-500">{seller.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}