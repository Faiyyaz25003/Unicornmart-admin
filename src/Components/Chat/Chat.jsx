// // "use client";

// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // export default function Chat() {
// //   const [users, setUsers] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [message, setMessage] = useState("");

// //   // Fetch users
// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:5000/api/users");
// //         setUsers(res.data);
// //       } catch (err) {
// //         console.error("Error fetching users", err);
// //       }
// //     };

// //     fetchUsers();
// //   }, []);

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       {/* LEFT - USERS LIST */}
// //       <div className="w-1/4 bg-white border-r">
// //         <h2 className="p-4 font-bold text-lg border-b">Users</h2>

// //         {users.map((user) => (
// //           <div
// //             key={user._id}
// //             onClick={() => setSelectedUser(user)}
// //             className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
// //               selectedUser?._id === user._id ? "bg-gray-200" : ""
// //             }`}
// //           >
// //             <p className="font-semibold">{user.name || user.email}</p>
// //             <p className="text-sm text-gray-500">{user.role}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* RIGHT - CHAT AREA */}
// //       <div className="flex-1 flex flex-col">
// //         {/* Header */}
// //         <div className="p-4 bg-white border-b">
// //           {selectedUser ? (
// //             <h2 className="font-bold">
// //               Chat with {selectedUser.name || selectedUser.email}
// //             </h2>
// //           ) : (
// //             <h2 className="text-gray-500">Select a user to start chat</h2>
// //           )}
// //         </div>

// //         {/* Messages */}
// //         <div className="flex-1 p-4 overflow-y-auto">
// //           {selectedUser ? (
// //             <p className="text-gray-400 text-sm">No messages yet (UI only)</p>
// //           ) : (
// //             <p className="text-gray-400 text-sm">Please select a user</p>
// //           )}
// //         </div>

// //         {/* Input */}
// //         {selectedUser && (
// //           <div className="p-4 bg-white border-t flex gap-2">
// //             <input
// //               type="text"
// //               placeholder="Type a message..."
// //               value={message}
// //               onChange={(e) => setMessage(e.target.value)}
// //               className="flex-1 border rounded px-3 py-2 outline-none"
// //             />
// //             <button
// //               className="bg-blue-600 text-white px-4 py-2 rounded"
// //               onClick={() => setMessage("")}
// //             >
// //               Send
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// export default function Chat() {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   // ⚠️ TEMP: logged in user (admin / user)
//   const loggedInUser = {
//     _id: "ADMIN_123", // real app me token se aayega
//   };

//   // Fetch users
//   useEffect(() => {
//     axios.get("http://localhost:5000/api/users").then((res) => {
//       setUsers(res.data);
//     });
//   }, []);

//   // Join socket room
//   useEffect(() => {
//     socket.emit("join", loggedInUser._id);

//     socket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => socket.off("receiveMessage");
//   }, []);

//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const msgData = {
//       senderId: loggedInUser._id,
//       receiverId: selectedUser._id,
//       message,
//     };

//     socket.emit("sendMessage", msgData);

//     setMessages((prev) => [...prev, msgData]);
//     setMessage("");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* USERS LIST */}
//       <div className="w-1/4 bg-white border-r">
//         <h2 className="p-4 font-bold border-b">Users</h2>
//         {users.map((user) => (
//           <div
//             key={user._id}
//             onClick={() => {
//               setSelectedUser(user);
//               setMessages([]);
//             }}
//             className="p-4 cursor-pointer hover:bg-gray-100"
//           >
//             {user.email}
//           </div>
//         ))}
//       </div>

//       {/* CHAT */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-4 bg-white border-b">
//           {selectedUser ? `Chat with ${selectedUser.name}` : "Select a user"}
//         </div>

//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`mb-2 ${
//                 msg.senderId === loggedInUser._id ? "text-right" : "text-left"
//               }`}
//             >
//               <span className="inline-block bg-blue-100 px-3 py-1 rounded">
//                 {msg.message}
//               </span>
//             </div>
//           ))}
//         </div>

//         {selectedUser && (
//           <div className="p-4 bg-white border-t flex gap-2">
//             <input
//               className="flex-1 border px-3 py-2 rounded"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type message..."
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-600 text-white px-4 rounded"
//             >
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // TEMP LOGIN USER
  const loggedInUser = {
    _id: "64a123456789abcd12345678",
    name: "Admin",
  };

  // USERS
  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  // SOCKET JOIN
  useEffect(() => {
    socket.emit("join", loggedInUser._id);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  // LOAD CHAT
  const selectUser = async (user) => {
    setSelectedUser(user);

    const res = await axios.get(
      `http://localhost:5000/api/chat/${loggedInUser._id}/${user._id}`
    );

    setMessages(res.data);
  };

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
      message,
    });

    setMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* USERS */}
      <div className="w-1/4 bg-white border-r">
        <h2 className="p-4 font-bold">Users</h2>

        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => selectUser(user)}
            className="p-4 border-b cursor-pointer hover:bg-gray-100"
          >
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white border-b font-bold">
          {selectedUser ? selectedUser.name : "Select User"}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 ${
                msg.senderId === loggedInUser._id ? "text-right" : "text-left"
              }`}
            >
              <span className="inline-block bg-blue-100 px-3 py-1 rounded">
                {msg.message}
              </span>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              className="flex-1 border px-3 py-2 rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
