"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <main className="h-screen  flex p-5 justify-center ">

  <div className="w-full  bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-2">

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

          <p>Create unlimited projects</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            ✓
          </div>

          <p>Assign and track tasks</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            ✓
          </div>

          <p>Monitor project progress</p>
        </div>

      </div>

    </div>

    {/* Right Side */}

    <div className="p-12 flex flex-col justify-center">

      <h2 className="text-3xl font-bold text-slate-800">
        Create Account
      </h2>

      <p className="text-slate-500 mt-2 mb-8">
        Let's get you started.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-gray-500 outline-none"
            />
          </div>

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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-gray-500 outline-none"
            />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-gray-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-gray-500 outline-none"
            />
          </div>

        </div>

        <div>

          <label className="block mb-3 text-sm font-medium text-slate-700">
            Choose your role
          </label>

          <div className="grid grid-cols-2 gap-4">

            <button
              type="button"
              className={`text-slate-700 rounded-xl border p-4 text-left transition ${
                formData.role === "manager"
                  ? "border-black bg-gray-200"
                  : "border-slate-300 hover:border-gray-400"
              }`}
              onClick={() =>
                setFormData({ ...formData, role: "manager" })
              }
            >
              <h3 className="font-semibold">
                Project Manager
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Create projects & assign work
              </p>

            </button>

            <button
              type="button"
              className={`text-slate-700 rounded-xl border p-4 text-left transition ${
                formData.role === "member"
                  ? "border-black bg-gray-200"
                  : "border-slate-300 hover:border-gray-400"
              }`}
              onClick={() =>
                setFormData({ ...formData, role: "member" })
              }
            >
              <h3 className="font-semibold">
                 Team Member
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Complete assigned tasks
              </p>

            </button>

          </div>

        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-900 transition"
        >
          Create Account
        </button>

      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?
        <Link
          href="/login"
          className="ml-1 text-black font-semibold hover:underline"
        >
          Login
        </Link>
      </p>

    </div>

  </div>

</main>
  );
}