"use client";

import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';
import { UserIcon } from '@/components/Icons';
import Badge from '@/components/Badge';
import CenterSelectorBar from '@/components/CenterSelectorBar';
import { getCenterProfile } from '@/lib/metrics';

function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10v4a1 1 0 01-1 1h-2.586l-2.293 2.293a1 1 0 01-.707.293H9.5a1 1 0 01-.707-.293L6.586 12H4a1 1 0 01-1-1V5a1 1 0 011-1h12a1 1 0 011 1z" />
    </svg>
  );
}

export default function AccountSettingsPage() {
  const { session, account, activeCenter, activeCenterId } = useAuth();
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [detailsData, setDetailsData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const profile = getCenterProfile(activeCenterId, activeCenter?.name);

  const handleEditDetails = () => {
    setDetailsData({
      username: account?.username || '',
      name: profile.owner || '',
      email: profile.ownerEmail || '',
      phone: profile.ownerPhone || '',
    });
    setEditingDetails(true);
  };

  const handleSaveDetails = async () => {
    const updates = {};
    if (detailsData.username !== account?.username) {
      updates.username = detailsData.username;
    }
    if (Object.keys(updates).length > 0 && account?.id) {
      try {
        const response = await fetch(`/api/accounts/${account.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Update failed');
      } catch (error) {
        console.error('Error saving details:', error);
        alert('Failed to update details');
        return;
      }
    }
    console.log('Details saved:', detailsData);
    setEditingDetails(false);
  };

  const handleCancelDetails = () => {
    setEditingDetails(false);
  };

  const handleResetPasswordToggle = () => {
    setEditingPassword(!editingPassword);
    if (!editingPassword) {
      setNewPassword('');
      setPasswordConfirm('');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== passwordConfirm) {
      alert('Passwords do not match');
      return;
    }
    if (!newPassword) {
      alert('Enter new password');
      return;
    }
    const updates = { password: newPassword };
    try {
      const response = await fetch(`/api/accounts/${account.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Reset failed');
      alert('Password reset successful');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password');
      return;
    }
    console.log('Password reset');
    setEditingPassword(false);
    setNewPassword('');
    setPasswordConfirm('');
  };

  const handleCancelPassword = () => {
    setEditingPassword(false);
    setNewPassword('');
    setPasswordConfirm('');
  };

  if (session?.role !== 'center_owner') {
    return <div className="p-8 text-center">Access restricted to Center Owners.</div>;
  }

  const needsCenter = session?.role === 'admin' && !activeCenterId;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-900 to-purple-600 bg-clip-text text-transparent">Account Settings</h1>
            <Badge variant="purple">Personal Info</Badge>
          </div>
          <p className="mt-3 text-base lg:text-lg text-slate-600 font-medium">Manage your profile and security settings</p>
        </div>
        <CenterSelectorBar />
      </div>

      {needsCenter ? (
        <section className="rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-yellow-50/50 p-8 shadow-md border border-blue-200/60 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 text-slate-700">
            <UserIcon className="w-7 h-7 text-blue-600" />
            <div>
              <h3 className="font-bold text-xl">Select Center First</h3>
              <p className="text-sm mt-1">Choose center to manage account</p>
            </div>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-2xl bg-gradient-to-br from-white to-indigo-50/30 shadow-md border border-indigo-200/60 backdrop-blur-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center border border-indigo-200">
                  <UserIcon className="h-8 w-8 text-indigo-700" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Account Details</h2>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Username</label>
                <input 
                  value={editingDetails ? detailsData.username : account?.username || ''}
                  onChange={(e) => setDetailsData(prev => ({...prev, username: e.target.value}))}
                  className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 ${editingDetails ? 'bg-white border-indigo-300 ring-2 ring-indigo-200' : 'bg-slate-50 border-slate-300 cursor-not-allowed'}`}
                  disabled={!editingDetails}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
                <input 
                  value={editingDetails ? detailsData.name : profile.owner}
                  onChange={(e) => setDetailsData(prev => ({...prev, name: e.target.value}))}
                  className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 ${editingDetails ? 'bg-white border-indigo-300 ring-2 ring-indigo-200' : 'bg-slate-50 border-slate-300 cursor-not-allowed'}`}
                  disabled={!editingDetails}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Email</label>
                    <input 
                      value={editingDetails ? detailsData.email : profile.ownerEmail}
                      onChange={(e) => setDetailsData(prev => ({...prev, email: e.target.value}))}
                      className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 ${editingDetails ? 'bg-white border-indigo-300 ring-2 ring-indigo-200' : 'bg-slate-50 border-slate-300 cursor-not-allowed'}`}
                      disabled={!editingDetails}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Phone</label>
                    <input 
                      value={editingDetails ? detailsData.phone : profile.ownerPhone}
                      onChange={(e) => setDetailsData(prev => ({...prev, phone: e.target.value}))}
                      className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 ${editingDetails ? 'bg-white border-indigo-300 ring-2 ring-indigo-200' : 'bg-slate-50 border-slate-300 cursor-not-allowed'}`}
                      disabled={!editingDetails}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                {editingDetails ? (
                  <>
                    <button
                      onClick={handleSaveDetails}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Save Details
                    </button>
                    <button
                      onClick={handleCancelDetails}
                      className="px-6 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 font-semibold rounded-xl shadow-sm transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditDetails}
                    className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Edit Details
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-white to-purple-50/30 shadow-md border border-purple-200/60 backdrop-blur-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center border border-purple-200">
                  <LockIcon className="h-8 w-8 text-purple-700" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Security</h2>
              </div>
            </div>
            <div className="space-y-6">
              {editingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">New Password</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 ring-2 ring-purple-200 border-purple-300 bg-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Confirm Password</label>
                    <input 
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 ring-2 ring-purple-200 border-purple-300 bg-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleResetPassword}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={handleCancelPassword}
                      className="px-6 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 font-semibold rounded-xl shadow-sm transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">Password is protected. Use "Reset Password" to change your account password.</p>
                  <div className="flex justify-end">
                    <button
                      onClick={handleResetPasswordToggle}
                      className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

