"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Get logged-in user
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoggedInUser(res.data);
        socket.emit("join", res.data._id);
      });
  }, []);

  // 🔹 Get users (exclude self)
  useEffect(() => {
    if (!loggedInUser) return;

    axios.get("http://localhost:5000/api/users").then((res) => {
      const filtered = res.data.filter((u) => u._id !== loggedInUser._id);
      setUsers(filtered);
    });
  }, [loggedInUser]);

  // 🔹 Socket listener
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  // 🔹 Load chat
  const selectUser = async (user) => {
    setSelectedUser(user);

    const res = await axios.get(
      `http://localhost:5000/api/chat/${loggedInUser._id}/${user._id}`
    );
    setMessages(res.data);
  };

  // 🔹 Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
      message,
    });

    setMessage("");
  };

  if (!loggedInUser) return <p>Loading...</p>;

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
