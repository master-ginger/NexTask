"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
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
    name: "Members",
    href: "/members",
    icon: "👥",
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: "📅",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "⚙️",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

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

      {/* User */}

      <div className="border-t border-zinc-800 p-6">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black font-bold">
            B
          </div>

          <div>

            <h3 className="font-medium">
              Bhavana
            </h3>

            <p className="text-sm text-zinc-400">
              Project Manager
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}