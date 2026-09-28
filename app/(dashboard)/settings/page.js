"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    department: "",
    designation: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      setProfileData({
        fullName: parsedUser.fullName || "",
        email: parsedUser.email || "",
        department: parsedUser.department || "",
        designation: parsedUser.designation || "",
      });
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = () => {
    console.log("Profile data:", profileData);

    // API call will be added here later
  };

  const handlePasswordUpdate = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    console.log("Update password");

    // API call will be added here later
  };

  const formatRole = (role) => {
    if (!role) return "";

    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-full bg-slate-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lg font-semibold text-white">
            ⚙
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your account, profile and security preferences.
            </p>
          </div>
        </div>
      </div>

      {!user ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading account details...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Overview */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-7 py-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white">
                    {profileData.fullName
                      ? profileData.fullName.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {profileData.fullName || "User"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {profileData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {formatRole(user.role)}
                  </span>

                  {user.designation && (
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                      {user.designation}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-7">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal and professional information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    name="email"
                    value={profileData.email}
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Email address cannot be changed here.
                  </p>
                </div>

                {/* Department */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Department
                  </label>

                  <input
                    name="department"
                    value={profileData.department}
                    onChange={handleProfileChange}
                    placeholder="e.g. Engineering"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Designation
                  </label>

                  <input
                    name="designation"
                    value={profileData.designation}
                    onChange={handleProfileChange}
                    placeholder="e.g. Software Developer"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Account Role
                  </label>

                  <input
                    value={formatRole(user.role)}
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-7 flex justify-end border-t border-slate-100 pt-6">
                <button
                  onClick={handleProfileSave}
                  className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-7">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  🔒
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Password & Security
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep your account secure by using a strong password.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Current Password */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-6">
                <p className="text-xs text-slate-400">
                  Your password is securely hashed before being stored.
                </p>

                <button
                  onClick={handlePasswordUpdate}
                  className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic information about your NexTask account.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account ID
                </p>

                <p className="mt-2 truncate text-sm font-medium text-slate-700">
                  {user.id}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {formatRole(user.role)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {user.department || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}