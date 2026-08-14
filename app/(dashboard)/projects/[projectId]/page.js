"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {

  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchProject();
    fetchMembers();
  }, []);

  async function fetchProject() {

    const res = await fetch(
      `/api/projects/${projectId}`
    );

    const data = await res.json();

    if (data.success) {
      setProject(data.project);
    }
  }

  async function fetchMembers() {

    const res = await fetch("/api/members");

    const data = await res.json();

    if (data.success) {
      setMembers(data.members);
    }
  }

  function toggleMember(memberId) {

    setSelectedMembers((current) => {

      if (current.includes(memberId)) {
        return current.filter(
          (id) => id !== memberId
        );
      }

      return [...current, memberId];
    });
  }

  async function addMembers() {

    if (selectedMembers.length === 0) {
      return;
    }

    const res = await fetch(
      `/api/projects/${projectId}/members`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          memberIds: selectedMembers,
        }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    setShowMemberModal(false);
    setSelectedMembers([]);

    fetchProject();
  }

  async function removeMember(memberId) {

    const confirmed = window.confirm(
      "Remove this member from the project?"
    );

    if (!confirmed) {
      return;
    }

    const res = await fetch(
      `/api/projects/${projectId}/members/${memberId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    fetchProject();
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  

  // Users who are NOT already part of this project
  const availableMembers = members.filter(
    (member) =>
      !project.projectUsers.some(
        (projectMember) =>
          projectMember.user.id === member.id
      )
  );

  return (
    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            {project.name}
          </h1>

          <p className="text-slate-500 mt-1">
            Manage project details and members.
          </p>

        </div>

        <button
          onClick={() => setShowMemberModal(true)}
          className="bg-black text-white px-5 py-3 rounded-xl hover:bg-zinc-800"
        >
          + Add Members
        </button>

      </div>


      {/* Project Information */}

      <div className="bg-white rounded-2xl shadow p-6 mb-6">

        <h2 className="text-xl font-semibold mb-5">
          Project Details
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-slate-500">
              Start Date
            </p>

            <p className="font-medium mt-1">
              {new Date(
                project.startDate
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Deadline
            </p>

            <p className="font-medium mt-1">
              {new Date(
                project.deadline
              ).toLocaleDateString()}
            </p>
          </div>

        </div>

      </div>


      {/* Members */}

      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-semibold">
            Members
          </h2>

          <span className="text-sm text-slate-500">
            {project.projectUsers.length} Members
          </span>

        </div>

        <div className="divide-y">

          {project.projectUsers.map(
            (projectMember) => {

              const member = projectMember.user;

              return (
                <div
                  key={member.id}
                  className="flex justify-between items-center py-4"
                >

                  <div>

                    <p className="font-medium">
                      {member.fullName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {member.email}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeMember(member.id)
                    }
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>

                </div>
              );
            }
          )}

        </div>

      </div>


      {/* Add Members Modal */}

      {showMemberModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white rounded-2xl p-8 w-[500px]">

            <h2 className="text-2xl font-bold mb-6">
              Add Members
            </h2>

            {availableMembers.length === 0 ? (

              <p className="text-slate-500">
                All employees are already part
                of this project.
              </p>

            ) : (

              <div className="space-y-3 max-h-80 overflow-y-auto">

                {availableMembers.map(
                  (member) => (

                    <label
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer"
                    >

                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(
                          member.id
                        )}
                        onChange={() =>
                          toggleMember(member.id)
                        }
                      />

                      <div>

                        <p className="font-medium">
                          {member.fullName}
                        </p>

                        <p className="text-sm text-slate-500">
                          {member.email}
                        </p>

                      </div>

                    </label>

                  )
                )}

              </div>

            )}

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => {
                  setShowMemberModal(false);
                  setSelectedMembers([]);
                }}
                className="px-5 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={addMembers}
                disabled={selectedMembers.length === 0}
                className="px-5 py-2 bg-black text-white rounded-xl disabled:opacity-50"
              >
                Add Members
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}