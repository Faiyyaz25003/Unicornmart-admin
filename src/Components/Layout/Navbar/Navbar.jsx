"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
  UserPlus,
  CalendarCheck,
} from "lucide-react";
import Register from "@/Components/Auth/Register/Register";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeView, setActiveView] = useState(null); // register | calendar | null

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
      if (!e.target.closest(".notification-dropdown"))
        setIsNotificationOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Dummy notifications
  const notifications = [
    {
      id: 1,
      title: "New Assignment",
      message: "Math homework due tomorrow",
      time: "5 min ago",
    },
    {
      id: 2,
      title: "Meeting Reminder",
      message: "Team sync at 3 PM",
      time: "1 hour ago",
    },
  ];

  const toggleView = (view) => {
    setActiveView((prev) => (prev === view ? null : view));
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 right-0 left-0 lg:left-80 z-30 transition-all duration-300 ${
          isScrolled
            ? "bg-[#1e7a8c]/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-to-r from-[#1e7a8c] to-[#2596ad]"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* SEARCH */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-14 pr-6 py-3 bg-white/10 border border-white/20 text-white rounded-2xl focus:outline-none focus:bg-white/20"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              {/* Register */}
              <button
                onClick={() => toggleView("register")}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeView === "register"
                    ? "bg-white/30"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <UserPlus className="text-white" size={20} />
              </button>

              {/* Calendar */}
              <button
                onClick={() => toggleView("calendar")}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeView === "calendar"
                    ? "bg-white/30"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <CalendarCheck className="text-white" size={20} />
              </button>

              {/* Notifications */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center"
                >
                  <Bell className="text-white" size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 bg-[#1e88a8] text-white">
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-sm opacity-80">
                        {notifications.length} new
                      </p>
                    </div>
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b hover:bg-gray-50">
                        <p className="font-semibold">{n.title}</p>
                        <p className="text-sm text-gray-600">{n.message}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PROFILE */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white"
                >
                  <User size={20} />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold">Faiyyaz Khan</p>
                    <p className="text-xs text-white/70">Administrator</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl overflow-hidden">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >
                      <User size={18} /> My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >
                      <Settings size={18} /> Settings
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ACTIVE VIEW BELOW NAVBAR */}
      {activeView && (
        <div className="fixed top-16 lg:top-20 left-0 lg:left-80 right-0 bottom-0 bg-gray-50 z-20 p-6">
          {activeView === "register" && (
            <div className="text-xl font-semibold"><Register/></div>
          )}
          {activeView === "calendar" && (
            <div className="text-xl font-semibold">Calendar Component Here</div>
          )}
        </div>
      )}
    </>
  );
}
