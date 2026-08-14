"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();

      if (data.success) {
        setMembers(data.members);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-slate-500 mt-1">
            View and manage your team.
          </p>
        </div>

        

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-5">Name</th>
              <th className="text-left p-5">Email</th>
              

            </tr>

          </thead>

          <tbody>

            {members.map((member) => (

              <tr
                key={member.id}
                className="border-t"
              >

                <td className="p-5">{member.fullName}</td>
                <td className="p-5">{member.email}</td>
                

                

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}