export default function SettingsPage() {
  return (
    <div>

      <h1 className="text-3xl font-bold">
        Settings
      </h1>

      <p className="text-slate-500 mt-1 mb-8">
        Manage your account preferences.
      </p>

      <div className="space-y-6">

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Profile
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <input
              placeholder="Full Name"
              className="border rounded-xl px-4 py-3"
            />

            <input
              placeholder="Email"
              className="border rounded-xl px-4 py-3"
            />

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Password
          </h2>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Current Password"
              className="w-full border rounded-xl px-4 py-3"
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded-xl px-4 py-3"
            />

            <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-zinc-800">
              Update Password
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}