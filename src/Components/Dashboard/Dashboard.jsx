"use client";

import { useEffect, useState } from "react";
import { User, Store, DollarSign, ShoppingCart } from "lucide-react";

export default function UserStats() {
  const [stats, setStats] = useState({
    buyers: 0,
    sellers: 0,
    revenue: 0,
    recentOrders: 0,
  });
  const [users, setUsers] = useState({ buyers: [], sellers: [] });
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

        // Revenue calculation (sum of order totals)
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

        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-6">
        {/* Total Buyers */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <User size={48} className="text-blue-600 mb-4" />
          <p className="text-gray-500">Total Buyers</p>
          <h2 className="text-3xl font-bold text-gray-800">{stats.buyers}</h2>
        </div>

        {/* Total Sellers */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <Store size={48} className="text-green-600 mb-4" />
          <p className="text-gray-500">Total Sellers</p>
          <h2 className="text-3xl font-bold text-gray-800">{stats.sellers}</h2>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <DollarSign size={48} className="text-yellow-600 mb-4" />
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-3xl font-bold text-gray-800">${stats.revenue}</h2>
        </div>

        {/* Orders in Last 3 Days */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <ShoppingCart size={48} className="text-purple-600 mb-4" />
          <p className="text-gray-500">Orders (Last 3 Days)</p>
          <h2 className="text-3xl font-bold text-gray-800">
            {stats.recentOrders}
          </h2>
        </div>
      </div>

      {/* Buyers & Sellers Lists */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Buyers List</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {users.buyers.map((buyer) => (
              <li key={buyer._id} className="p-2 border-b border-gray-200">
                {buyer.name || buyer.email}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Sellers List</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {users.sellers.map((seller) => (
              <li key={seller._id} className="p-2 border-b border-gray-200">
                {seller.name || seller.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
