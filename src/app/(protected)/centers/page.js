"use client";

import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';
import { BuildingIcon, UserIcon, UsersIcon } from '@/components/Icons';
import Badge from '@/components/Badge';
import CenterSelectorBar from '@/components/CenterSelectorBar';
import KpiCard from '@/components/KpiCard';
import { getCenterProfile, getDashboardKpis } from '@/lib/metrics';

function kpiVisual(title) {
  switch (title) {
    case "Active Onlist":
      return { icon: <UsersIcon className="h-5 w-5" />, variant: "blue" };
    case "Overall Onlist":
      return { icon: <UserIcon className="h-5 w-5" />, variant: "blue" };
    case "Center Capacity":
      return { icon: <BuildingIcon className="h-5 w-5" />, variant: "blue" };
    default:
      return { icon: null, variant: "blue" };
  }
}

export default function CenterInformationPage() {
  const { activeCenter, activeCenterId, session } = useAuth();
  const [editing, setEditing] = useState(false);
  const [centerData, setCenterData] = useState({
    owner: '',
    ownerEmail: '',
    ownerPhone: '',
    location: '',
    address: '',
  });
  const [photoFiles, setPhotoFiles] = useState([]);

  const handleSave = () => {
    console.log('Saved:', centerData);
    setEditing(false);
  };

  const handleEditToggle = () => {
    if (!editing) {
      setCenterData(profile);
    }
    setEditing((prev) => !prev);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles(prev => [...prev, ...files.slice(0, 8 - prev.length)]);
  };

  const needsCenter = session?.role === "admin" && !activeCenterId;

  const profile = getCenterProfile(activeCenterId, activeCenter?.name);
  const dashboard = needsCenter ? null : getDashboardKpis(activeCenterId);
  const statByTitle = new Map((dashboard?.kpis ?? []).map((k) => [k.title, k]));

  const stats = [
    {
      title: "Active Onlist",
      value: statByTitle.get("Active Onlist")?.value ?? "0",
      subtitle: "Current",
      icon: <UsersIcon className="h-5 w-5" />,
      variant: "blue",
    },
    {
      title: "Overall Onlist",
      value: statByTitle.get("Overall Onlist")?.value ?? "0",
      subtitle: "All time",
      icon: <UserIcon className="h-5 w-5" />,
      variant: "blue",
    },
    {
      title: "Center Capacity",
      value: statByTitle.get("Center Capacity")?.value ?? "0%",
      subtitle: "Max",
      icon: <BuildingIcon className="h-5 w-5" />,
      variant: "blue",
    },
  ];

  if (needsCenter) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Center Information</h1>
              <Badge variant="yellow">Manage</Badge>
            </div>
            <p className="mt-3 text-base lg:text-lg text-slate-600 font-medium">View and edit center details</p>
          </div>
          <CenterSelectorBar />
        </div>
        <section className="rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-yellow-50/50 p-8 shadow-md border border-blue-200/60 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 text-slate-700">
            <BuildingIcon className="w-7 h-7 text-blue-600" />
            <div>
              <h3 className="font-bold text-xl">Select Center First</h3>
              <p className="text-sm mt-1">Choose center to manage information</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Center Information</h1>
            <Badge variant="yellow">{activeCenter?.name}</Badge>
          </div>
          <p className="mt-3 text-base lg:text-lg text-slate-600 font-medium">Owner, location and facility details</p>
        </div>
        <CenterSelectorBar />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => (
          <KpiCard
            key={idx}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            variant={stat.variant}
          />
        ))}
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-white to-blue-50/30 shadow-md border border-blue-200/60 backdrop-blur-sm p-8 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-200">
              <BuildingIcon className="h-8 w-8 text-blue-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{activeCenter?.name}</h2>
              <p className="text-sm text-slate-600 mt-1">Primary facility</p>
            </div>
          </div>
          <button
            onClick={handleEditToggle}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            {editing ? 'Cancel' : 'Edit'} 
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border shadow-sm transition-all ${editing ? 'ring-2 ring-blue-200 border-blue-300' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Owner Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
                <input 
                  value={editing ? centerData.owner : profile.owner}
                  onChange={(e) => setCenterData(prev => ({...prev, owner: e.target.value}))}
                  className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 ${editing ? 'focus:border-blue-500' : 'bg-slate-50 cursor-not-allowed border-slate-300'}`}
                  disabled={!editing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Email</label>
                  <input 
                    value={editing ? centerData.ownerEmail : profile.ownerEmail}
                    onChange={(e) => setCenterData(prev => ({...prev, ownerEmail: e.target.value}))}
                    className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 ${editing ? 'focus:border-blue-500' : 'bg-slate-50 cursor-not-allowed border-slate-300'}`}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Phone</label>
                  <input 
                    value={editing ? centerData.ownerPhone : profile.ownerPhone}
                    onChange={(e) => setCenterData(prev => ({...prev, ownerPhone: e.target.value}))}
                    className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 ${editing ? 'focus:border-blue-500' : 'bg-slate-50 cursor-not-allowed border-slate-300'}`}
                    disabled={!editing}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border shadow-sm transition-all ${editing ? 'ring-2 ring-emerald-200 border-emerald-300' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                <BuildingIcon className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Location</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Location Name</label>
                <input 
                  value={editing ? centerData.location : profile.location}
                  onChange={(e) => setCenterData(prev => ({...prev, location: e.target.value}))}
                  className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 ${editing ? 'focus:border-emerald-500' : 'bg-slate-50 cursor-not-allowed border-slate-300'}`}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Full Address</label>
                <textarea 
                  rows="3"
                  value={editing ? centerData.address : profile.address}
                  onChange={(e) => setCenterData(prev => ({...prev, address: e.target.value}))}
                  className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all resize-vertical text-slate-900 ${editing ? 'focus:border-emerald-500' : 'bg-slate-50 cursor-not-allowed border-slate-300'}`}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white border shadow-md overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-indigo-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Facility Photos</h3>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={!editing}
              className={`block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition-all border-2 border-dashed border-slate-300 rounded-xl p-12 text-center ${editing ? '' : 'opacity-50 cursor-not-allowed'}`}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photoFiles.slice(0,8).map((file, idx) => (
                <div key={idx} className="group relative rounded-xl overflow-hidden bg-slate-100 aspect-square shadow-sm hover:shadow-md border transition-all">
                  <img src={URL.createObjectURL(file)} alt={`Photo ${idx+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button onClick={() => setPhotoFiles(p => p.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {editing && (
        <div className="pt-8 border-t border-slate-200">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setEditing(false)}
              className="px-8 py-3 text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

