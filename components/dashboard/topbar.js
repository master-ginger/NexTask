"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">

      {/* Left */}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Manage your projects efficiently
        </p>
      </div>

      {/* Right */}

      <div className="relative">

        {/* Profile Icon */}

        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white font-semibold hover:bg-zinc-800 transition"
        >
          {user?.fullName?.charAt(0).toUpperCase() || "?"}
        </button>

        {/* Dropdown */}

        {showProfile && (
          <div className="absolute right-0 top-14 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-50">

            {/* User information */}

            <div className="border-b border-gray-100 px-5 py-4">

              <p className="font-semibold text-slate-900">
                {user?.fullName}
              </p>

              <p className="text-sm text-slate-500 truncate">
                {user?.email}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {user?.role}
              </p>

            </div>

            {/* Logout */}

            <button
              onClick={logout}
              className="w-full px-5 py-3 text-left text-sm text-red-600 hover:bg-gray-50 rounded-b-xl"
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
}