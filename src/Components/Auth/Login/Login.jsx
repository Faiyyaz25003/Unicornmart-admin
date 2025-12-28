"use client";
import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        role: "admin",
        ...form,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(res.data.message || "Login Successful");
      router.push("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <LogIn className="text-blue-600" />
          Seller Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex items-center border rounded-lg">
            <Mail className="ml-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg">
            <Lock className="ml-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 focus:outline-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login as SELLER
          </button>
        </form>
      </div>
    </div>
  );
}
