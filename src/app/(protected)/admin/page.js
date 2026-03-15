"use client";

import { useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import { useAuth } from "@/components/AuthProvider";
import { newId } from "@/lib/db";

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
  const { db, updateDB } = useAuth();
  const [tab, setTab] = useState("centers");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-zinc-600">Manage centers and center owner accounts.</p>
        </div>

        <Tabs
          tabs={[
            { id: "centers", label: "Centers" },
            { id: "accounts", label: "Accounts" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "centers" ? <CentersTab db={db} updateDB={updateDB} /> : null}
      {tab === "accounts" ? <AccountsTab db={db} updateDB={updateDB} /> : null}
    </div>
  );
}

function CentersTab({ db, updateDB }) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const centers = db?.centers ?? [];

  return (
    <div className="space-y-6">
      <Section title="Centers">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold text-zinc-600">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {centers.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50">
                  <td className="px-3 py-2 font-medium text-zinc-900">{c.name}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingName(c.name);
                      }}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {centers.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-zinc-600" colSpan={2}>
                    No centers yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Add Center">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = name.trim();
            if (!trimmed) return;
            updateDB((next) => {
              next.centers.push({ id: newId("c"), name: trimmed });
              return next;
            });
            setName("");
          }}
        >
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-zinc-700">Center name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              placeholder="e.g. TPCAP Center - Bacolod"
            />
          </div>
          <button
            type="submit"
            className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Add
          </button>
        </form>
      </Section>

      {editingId ? (
        <Section
          title="Edit Center"
          right={
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setEditingName("");
              }}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Close
            </button>
          }
        >
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = editingName.trim();
              if (!trimmed) return;
              updateDB((next) => {
                const idx = next.centers.findIndex((c) => c.id === editingId);
                if (idx >= 0) next.centers[idx].name = trimmed;
                return next;
              });
              setEditingId(null);
              setEditingName("");
            }}
          >
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-zinc-700">Center name</label>
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Save
            </button>
          </form>
        </Section>
      ) : null}
    </div>
  );
}

function AccountsTab({ db, updateDB }) {
  const centers = db?.centers ?? [];
  const ownerAccounts = useMemo(
    () => (db?.accounts ?? []).filter((a) => a.role === "center_owner"),
    [db]
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [centerId, setCenterId] = useState(centers[0]?.id ?? "");

  return (
    <div className="space-y-6">
      <Section title="Center Owner Accounts">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold text-zinc-600">
              <tr>
                <th className="px-3 py-2">Username</th>
                <th className="px-3 py-2">Center</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ownerAccounts.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-50">
                  <td className="px-3 py-2 font-medium text-zinc-900">{a.username}</td>
                  <td className="px-3 py-2 text-zinc-700">
                    {centers.find((c) => c.id === a.centerId)?.name ?? "Unassigned"}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateDB((next) => {
                          const idx = next.accounts.findIndex((x) => x.id === a.id);
                          if (idx >= 0) next.accounts[idx].password = "reset123";
                          return next;
                        });
                      }}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
              {ownerAccounts.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-zinc-600" colSpan={3}>
                    No center owner accounts yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-zinc-500">
          Reset Password sets the password to <span className="font-semibold">reset123</span>.
        </div>
      </Section>

      <Section title="Create Center Owner Account">
        <form
          className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const u = username.trim();
            const p = password.trim();
            if (!u || !p || !centerId) return;
            updateDB((next) => {
              const exists = next.accounts.some(
                (a) => a.username.toLowerCase() === u.toLowerCase()
              );
              if (exists) return next;
              next.accounts.push({
                id: newId("a"),
                role: "center_owner",
                username: u,
                password: p,
                centerId,
              });
              return next;
            });
            setUsername("");
            setPassword("");
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              placeholder="e.g. owner.bacolod"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
              placeholder="Set initial password"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Center</label>
            <select
              value={centerId}
              onChange={(e) => setCenterId(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600"
            >
              <option value="">Select…</option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Create Account
            </button>
          </div>
        </form>
        <div className="mt-3 text-xs text-zinc-500">
          Duplicate usernames are ignored for safety in this UI-only demo.
        </div>
      </Section>
    </div>
  );
}

