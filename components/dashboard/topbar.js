"use client";

export default function Topbar() {
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

      <div className="flex items-center gap-5">

        {/* Search */}

        <input
          type="text"
          placeholder="Search..."
          className="w-72 rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-black"
        />

        {/* Notifications */}

        <button className="relative rounded-xl border border-gray-300 p-3 hover:bg-gray-100 transition">

          🔔

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

        </button>

        {/* Profile */}

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white font-semibold">
            B
          </div>

          <div>

            <h4 className="text-sm font-semibold">
              Bhavana
            </h4>

            <p className="text-xs text-slate-500">
              Project Manager
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}