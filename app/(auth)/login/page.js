"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data: ",formData)

    try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    router.push("/dashboard");  

  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
  };

  return (
    <main className="h-screen flex justify-center p-5 ">

      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-2">

        {/* Left Side */}

        <div className="bg-black text-white p-14 flex flex-col justify-center">

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-zinc-300 to-white bg-clip-text text-transparent animate-fade-up">
            NexTask
          </h1>

          <p className="mt-4 text-zinc-400 text-lg">
            Organize. Collaborate. Deliver.
          </p>

          <div className="mt-12 space-y-6">

            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <p>Track project progress effortlessly</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <p>Manage your team's workflow</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <p>Stay on top of deadlines</p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="p-12 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h2>

          <p className="text-slate-500 mt-2 mb-8">
            Sign in to continue managing your projects.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@email.com"
                className="w-full rounded-xl border text-black border-slate-300 px-4 py-3 focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-slate-500 hover:text-black"
                >
                  Forgot Password?
                </button>
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full text-black rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-900 transition"
            >
              Sign In
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?
            <Link
              href="/signup"
              className="ml-1 font-semibold text-black hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}