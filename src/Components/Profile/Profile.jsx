"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Store,
  Briefcase,
  Calendar,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${loggedUser._id}`
        );
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">No user found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User /> My Profile
          </h2>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <LogOut /> Logout
          </button>
        </div>

        <Info label="Name" value={user.name} icon={<User />} />
        <Info label="Email" value={user.email} icon={<Mail />} />
        <Info label="Phone" value={user.phone} icon={<Phone />} />
        <Info label="Role" value={user.role} />

        {user.role === "seller" && (
          <>
            <Info label="Shop Name" value={user.shopName} icon={<Store />} />
            <Info
              label="Business Type"
              value={user.businessType}
              icon={<Briefcase />}
            />
            <Info label="GST Number" value={user.gstNumber} />
            <Info
              label="Join Date"
              value={new Date(user.joinDate).toDateString()}
              icon={<Calendar />}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, icon }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 border-b pb-2">
      {icon}
      <p>
        <span className="font-semibold">{label}:</span> {value}
      </p>
    </div>
  );
}
