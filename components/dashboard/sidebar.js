"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const managerMenuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    name: "Projects",
    href: "/projects",
    icon: "📁",
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: "📁",
  },
  {
    name: "Productivity Analysis",
    href: "/productivity",
    icon: "📊",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "⚙️",
  },
];

const memberMenuItems = [
  {
    name: "Dashboard",
    href: "/member-dashboard",
    icon: "🏠",
  },
  {
    name: "My Tasks",
    href: "/my-tasks",
    icon: "✓",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "⚙️",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return null;
  }

  const menuItems =
    user.role === "MEMBER"
      ? memberMenuItems
      : managerMenuItems;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside
      className={`relative flex h-screen flex-col bg-black text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}
      <div
        className={`border-b border-zinc-800 ${
          collapsed ? "px-4 py-7" : "px-8 py-7"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div>
              <h1 className="text-3xl font-bold tracking-wide">
                NexTask
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Project Management
              </p>
            </div>
          )}

          {collapsed && (
            <h1 className="text-2xl font-bold">
              N
            </h1>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-black text-sm text-white shadow-md transition hover:bg-zinc-800"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "→" : "←"}
      </button>

      {/* Navigation */}
      <nav
        className={`flex-1 ${
          collapsed ? "px-2 py-8" : "px-4 py-8"
        }`}
      >
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  title={collapsed ? item.name : ""}
                  className={`flex items-center rounded-xl py-3 transition ${
                    collapsed
                      ? "justify-center px-3"
                      : "gap-4 px-5"
                  } ${
                    active
                      ? "bg-white font-semibold text-black"
                      : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span>{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logged in User */}
      <div
        className={`relative border-t border-zinc-800 ${
          collapsed ? "p-3" : "p-6"
        }`}
      >
        {/* Logout popup */}
        {showProfileMenu && (
          <div
            className={`absolute bottom-full mb-3 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-xl ${
              collapsed
                ? "left-3 w-48"
                : "left-6 right-6"
            }`}
          >
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              <span>↪</span>
              <span>Logout</span>
            </button>
          </div>
        )}

        <button
          onClick={() =>
            setShowProfileMenu(!showProfileMenu)
          }
          className={`flex w-full items-center rounded-xl transition hover:bg-zinc-900 ${
            collapsed
              ? "justify-center p-2"
              : "gap-4 p-2 text-left"
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white font-bold text-black">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h3 className="truncate font-medium">
                {user.fullName}
              </h3>

              <p className="text-sm text-zinc-400">
                {user.role}
              </p>
            </div>
          )}

          {!collapsed && (
            <span className="ml-auto text-zinc-500">
              {showProfileMenu ? "⌄" : "⌃"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}