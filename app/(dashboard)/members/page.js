export default function MembersPage() {
  const members = [
    {
      name: "John Doe",
      team: "Frontend",
      tasks: 8,
      status: "Active",
    },
    {
      name: "Sarah",
      team: "Backend",
      tasks: 5,
      status: "Active",
    },
    {
      name: "Alex",
      team: "QA",
      tasks: 4,
      status: "On Leave",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-slate-500 mt-1">
            View and manage your team.
          </p>
        </div>

        <button className="bg-black text-white px-5 py-3 rounded-xl hover:bg-zinc-800">
          + Add Member
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-5">Name</th>
              <th className="text-left p-5">Team</th>
              <th className="text-left p-5">Tasks</th>
              <th className="text-left p-5">Status</th>

            </tr>

          </thead>

          <tbody>

            {members.map((member) => (

              <tr
                key={member.name}
                className="border-t"
              >

                <td className="p-5">{member.name}</td>
                <td className="p-5">{member.team}</td>
                <td className="p-5">{member.tasks}</td>

                <td className="p-5">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {member.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}