// "use client";

// import { useState } from "react";
// import { Mail, Lock, LogIn } from "lucide-react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const router = useRouter();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:5000/api/admin/login", {
//         role: "admin",
//         ...form,
//       });

//       // ✅ Save user in localStorage
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       alert(res.data.message || "Login Successful");

//       // ✅ Redirect
//       router.push("/dashboard");
//     } catch (err) {
//       alert(err?.response?.data?.message || "Login Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
//           <LogIn className="text-blue-600" />
//           Admin Login
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex items-center border rounded-lg">
//             <Mail className="ml-3 text-gray-400" />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full p-3 focus:outline-none"
//               required
//             />
//           </div>

//           <div className="flex items-center border rounded-lg">
//             <Lock className="ml-3 text-gray-400" />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full p-3 focus:outline-none"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login as Admin"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        form
      );

      // ✅ Save token
      localStorage.setItem("adminToken", res.data.token);

      alert("Admin Login Successful");
      router.push("/dashboard"); // or /dashboard
    } catch (err) {
      alert(err?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <LogIn className="text-blue-600" />
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
