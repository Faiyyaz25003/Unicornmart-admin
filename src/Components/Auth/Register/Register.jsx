"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  UserPlus,
  Building2,
  Calendar,
  Store,
  Briefcase,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [role, setRole] = useState("buyer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    shopName: "",
    businessType: "",
    gstNumber: "",
    joinDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      role,
      ...form,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        payload
      );

      localStorage.setItem("user", JSON.stringify(res.data.user || payload));
      alert(res.data.message || "Registration Successful");
      router.push("/dashboard");
    } catch (err) {
      alert(
        err?.response?.data?.message || err.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <UserPlus className="text-blue-600" />
          Buyer / Seller Registration
        </h2>

        {/* Role Select */}
        <div className="flex gap-6 mb-6">
          {["buyer", "seller"].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="accent-blue-600"
              />
              {r.toUpperCase()}
            </label>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* TWO COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

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

            {/* Phone */}
            <div className="flex items-center border rounded-lg">
              <Phone className="ml-3 text-gray-400" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 focus:outline-none"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-semibold mb-2">Gender</label>
              <div className="flex gap-4">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* SELLER EXTRA FIELDS */}
            {role === "seller" && (
              <>
                <div className="flex items-center border rounded-lg">
                  <Store className="ml-3 text-gray-400" />
                  <input
                    type="text"
                    name="shopName"
                    placeholder="Shop / Company Name"
                    value={form.shopName}
                    onChange={handleChange}
                    className="w-full p-3 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center border rounded-lg">
                  <Briefcase className="ml-3 text-gray-400" />
                  <input
                    type="text"
                    name="businessType"
                    placeholder="Business Type"
                    value={form.businessType}
                    onChange={handleChange}
                    className="w-full p-3 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center border rounded-lg">
                  <Building2 className="ml-3 text-gray-400" />
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="GST Number"
                    value={form.gstNumber}
                    onChange={handleChange}
                    className="w-full p-3 focus:outline-none"
                  />
                </div>

                <div className="flex items-center border rounded-lg">
                  <Calendar className="ml-3 text-gray-400" />
                  <input
                    type="date"
                    name="joinDate"
                    value={form.joinDate}
                    onChange={handleChange}
                    className="w-full p-3 focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register as {role.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
}
