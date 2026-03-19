"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Badge from "@/components/Badge";
import { BuildingIcon, UserIcon } from "@/components/Icons";
import KpiCard from "@/components/KpiCard";

function Section({ title, children, right }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-4">
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function AdminPage() {
  const { centers, accounts, refreshData } = useAuth();
  const [islandFilter, setIslandFilter] = useState("");
  const [editingCenter, setEditingCenter] = useState(null);
  const [addingCenter, setAddingCenter] = useState(false);
  const [resetPasswordFor, setResetPasswordFor] = useState(null);

  const filteredCenters = useMemo(() => {
    if (!islandFilter) return centers;
    return centers.filter(c => c.island === islandFilter);
  }, [centers, islandFilter]);

  const getCenterOwner = (centerId) => {
    return accounts.find(a => a.role === "center_owner" && a.centerId === centerId) || null;
  };

  // Compute KPIs
  const totalCenters = filteredCenters.length;
  const islandCounts = useMemo(() => {
    const counts = { Luzon: 0, Visayas: 0, Mindanao: 0 };
    filteredCenters.forEach(c => counts[c.island]++);
    return counts;
  }, [filteredCenters]);
  const activeOwners = useMemo(() => filteredCenters.filter(c => getCenterOwner(c.id)).length, [filteredCenters]);

  const handleEditCenter = async (center) => {
    setEditingCenter(center);
  };

  const handleSaveCenter = async (id, name, island) => {
    try {
      const res = await fetch(`/api/centers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, island }),
      });
      if (res.ok) {
        await refreshData();
        setEditingCenter(null);
      } else {
        alert("Failed to update center");
      }
    } catch (error) {
      console.error("Error updating center:", error);
      alert("Error updating center");
    }
  };

  const handleAddCenter = async (name, island, username, password) => {
    try {
      const centerRes = await fetch("/api/centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, island }),
      });
      if (!centerRes.ok) throw new Error("Failed to add center");
      const newCenter = await centerRes.json();

      const accountRes = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role: "center_owner", centerId: newCenter.id }),
      });
      if (accountRes.ok) {
        await refreshData();
        setAddingCenter(false);
      } else {
        alert("Failed to add account");
      }
    } catch (error) {
      console.error("Error adding center:", error);
      alert("Error adding center");
    }
  };

  const handleResetPassword = async (accountId, newPassword) => {
    try {
      const res = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (res.ok) {
        alert("Password reset successfully");
        setResetPasswordFor(null);
      } else {
        alert("Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error resetting password");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Center Management
            </h1>
            <Badge variant="yellow">Admin</Badge>
          </div>
          <p className="mt-3 text-base lg:text-lg text-slate-600 font-medium">Manage centers and center owner accounts</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAddingCenter(true)}
            className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 hover:shadow-md transition-all"
          >
            <BuildingIcon className="w-4 h-4 inline -ml-1 mr-1" />
            Add New Center & Owner
          </button>
        </div>
      </div>

      {/* Styled Island Filter */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-yellow-50/50 p-6 shadow-md border border-blue-200/60 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3">
          <BuildingIcon className="w-6 h-6 text-blue-600" />
          <label className="text-lg font-bold text-slate-900">Filter Islands</label>
        </div>
        <select
          value={islandFilter}
          onChange={(e) => setIslandFilter(e.target.value)}
          className="mt-4 h-12 w-full max-w-md rounded-2xl border border-blue-200 bg-white/80 px-4 text-sm font-medium shadow-sm backdrop-blur-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50"
        >

          <option value="">All Islands</option>
          <option value="Luzon">Luzon</option>
          <option value="Visayas">Visayas</option>
          <option value="Mindanao">Mindanao</option>

        </select>
      </section>

      <Section title="Centers">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold text-zinc-600">

              <tr>
                <th className="px Asc -3 py-2">Center Name</th>
                <th className="px-3 py-2">Island</th>
                <th className="px-3 py-2">Actions</th>
              </tr>

            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCenters.map((c) => {
                const owner = getCenterOwner(c.id);
                return (
                  <tr key={c.id} className="hover:bg-zinc-50">
                    <td className="px-3 py-2 font-medium text-zinc-900">{c.name}</td>
                    <td className="px-3 py-2 text-zinc-600">{c.island}</td>
                    <td className="px-3 py-2 text-zinc-600">{owner?.username || "No owner"}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleEditCenter(c)}
                        className="mr-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        Edit Center
                      </button>
                      {owner && (
                        <button
                          type="button"
                          onClick={() => setResetPasswordFor(owner)}
                          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                        >
                          Reset Password
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredCenters.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-zinc-600" colSpan={4}>
                    No centers found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Section>

      {editingCenter && (
        <EditCenterModal
          center={editingCenter}
          onSave={handleSaveCenter}
          onClose={() => setEditingCenter(null)}
        />
      )}

      {addingCenter && (
        <AddCenterModal
          onSave={handleAddCenter}
          onClose={() => setAddingCenter(false)}
        />
      )}

      {resetPasswordFor && (
        <ResetPasswordModal
          account={resetPasswordFor}
          onSave={handleResetPassword}
          onClose={() => setResetPasswordFor(null)}
        />
      )}
    </div>
  );
}

function EditCenterModal({ center, onSave, onClose }) {
  const [name, setName] = useState(center.name);
  const [island, setIsland] = useState(center.island);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(center.id, name, island);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Edit Center</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Center Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Island</label>
            <select
              value={island}
              onChange={(e) => setIsland(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              required
            >
              <option value="Luzon">Luzon</option>
              <option value="Visayas">Visayas</option>
              <option value="Mindanao">Mindanao</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddCenterModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [island, setIsland] = useState("Luzon");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(name, island, username, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Add New Center & Owner</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Center Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Island</label>
            <select
              value={island}
              onChange={(e) => setIsland(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              required
            >
              <option value="Luzon">Luzon</option>
              <option value="Visayas">Visayas</option>
              <option value="Mindanao">Mindanao</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Owner Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Owner Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResetPasswordModal({ account, onSave, onClose }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(account.id, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Reset Password for {account.username}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

