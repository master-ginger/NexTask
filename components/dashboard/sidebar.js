"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
]

export default function Sidebar() {
  const pathname = usePathname();

  const [user, setUser] = useState(null);

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
  
  return (
    <aside className="w-72 bg-black text-white flex flex-col">

      {/* Logo */}

      <div className="border-b border-zinc-800 px-8 py-7">
        <h1 className="text-3xl font-bold tracking-wide">
          NexTask
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Project Management
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-8">

        <ul className="space-y-2">

          {menuItems.map((item) => {

            const active = pathname === item.href;

            return (
              <li key={item.name}>

                <Link
                  href={item.href}
                  className={`flex items-center gap-4 rounded-xl px-5 py-3 transition ${
                    active
                      ? "bg-white text-black font-semibold"
                      : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >

                  <span className="text-lg">
                    {item.icon}
                  </span>

                  {item.name}

                </Link>

              </li>
            );
          })}

        </ul>

      </nav>

      {/* Logged in User */}

      <div className="border-t border-zinc-800 p-6">

        {user && (
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black font-bold">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">

              <h3 className="font-medium truncate">
                {user.fullName}
              </h3>

              <p className="text-sm text-zinc-400">
                {user.role}
              </p>

            </div>

          </div>
        )}

      </div>

    </aside>
  );
}