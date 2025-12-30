// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { User, Mail, LogOut } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function ProfilePage() {
//   const router = useRouter();
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");

//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/admin/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAdmin(res.data);
//       } catch (err) {
//         console.error(err);
//         localStorage.removeItem("adminToken");
//         router.push("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [router]);

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     router.push("/login");
//   };

//   if (loading) return <p className="p-6">Loading...</p>;
//   if (!admin) return <p className="p-6">No admin found</p>;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <div className="bg-white shadow rounded-xl p-6 space-y-4">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold flex items-center gap-2">
//             <User /> Admin Profile
//           </h2>
//         </div>

//         <Info label="Name" value={admin.name} />
//         <Info label="Email" value={admin.email} />
//         <Info label="Role" value="Admin" />
//       </div>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <p>
//       <span className="font-semibold">{label}:</span> {value}
//     </p>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("adminToken");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!admin) return <p className="p-6">No admin found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <User size={22} /> Admin Profile
        </h2>

        {/* 🔹 Main Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* LEFT - Profile Image */}
          <div className="flex-shrink-0">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Admin"
              className="w-32 h-32 rounded-full border shadow"
            />
          </div>

          {/* RIGHT - Profile Details */}
          <div className="space-y-3 text-gray-700">
            <Info label="Name" value={admin.name} />
            <Info label="Email" value={admin.email} />
            <Info label="Role" value="Admin" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p>
      <span className="font-semibold">{label}:</span> {value}
    </p>
  );
}
