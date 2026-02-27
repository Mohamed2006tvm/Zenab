import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

export default function Profile() {
    const { user } = useAuth();

    const [form, setForm] = useState({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        location: user?.user_metadata?.location || '',
        bio: user?.user_metadata?.bio || '',
    });
    const [passwords, setPasswords] = useState({
        current: '',
        newPass: '',
        confirm: '',
    });

    const [profileStatus, setProfileStatus] = useState({ msg: '', type: '' });
    const [passStatus, setPassStatus] = useState({ msg: '', type: '' });
    const [profileLoading, setProfileLoading] = useState(false);
    const [passLoading, setPassLoading] = useState(false);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileStatus({ msg: '', type: '' });
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: form.fullName,
                    phone: form.phone,
                    location: form.location,
                    bio: form.bio,
                },
            });
            if (error) throw error;
            setProfileStatus({ msg: 'Profile updated successfully!', type: 'success' });
        } catch (err) {
            setProfileStatus({ msg: err.message || 'Failed to update profile.', type: 'error' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPassStatus({ msg: '', type: '' });
        if (passwords.newPass !== passwords.confirm) {
            setPassStatus({ msg: 'New passwords do not match.', type: 'error' });
            return;
        }
        if (passwords.newPass.length < 6) {
            setPassStatus({ msg: 'Password must be at least 6 characters.', type: 'error' });
            return;
        }
        setPassLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: passwords.newPass });
            if (error) throw error;
            setPassStatus({ msg: 'Password updated successfully!', type: 'success' });
            setPasswords({ current: '', newPass: '', confirm: '' });
        } catch (err) {
            setPassStatus({ msg: err.message || 'Failed to update password.', type: 'error' });
        } finally {
            setPassLoading(false);
        }
    };

    const displayName = form.fullName || user?.email?.split('@')[0] || 'User';
    const avatarLetter = displayName[0].toUpperCase();

    const StatusBanner = ({ status }) =>
        status.msg ? (
            <div
                className={`px-4 py-3 rounded-lg text-sm mb-4 ${status.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}
            >
                {status.type === 'success' ? '✅' : '⚠️'} {status.msg}
            </div>
        ) : null;

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">My Profile</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your account information and security settings</p>
                </div>

                {/* Avatar Card */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-6 flex items-center gap-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-emerald-500/20 flex-shrink-0">
                        {avatarLetter}
                    </div>
                    <div>
                        <div className="text-white font-semibold text-xl">{displayName}</div>
                        <div className="text-slate-400 text-sm mt-0.5">{user?.email}</div>
                        <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            Active Account
                        </div>
                    </div>
                </div>

                {/* Profile Info Form */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-6">
                    <h2 className="text-white font-semibold text-lg mb-5">Personal Information</h2>
                    <StatusBanner status={profileStatus} />

                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    disabled
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 outline-none text-sm cursor-not-allowed"
                                    title="Email cannot be changed directly"
                                />
                                <p className="text-slate-600 text-xs mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-1.5">Location</label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm"
                                    placeholder="e.g. Mumbai, Maharashtra"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm mb-1.5">Bio</label>
                            <textarea
                                rows={3}
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm resize-none"
                                placeholder="Tell us a little about yourself..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 text-sm"
                            >
                                {profileLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </span>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-white font-semibold text-lg mb-5">Change Password</h2>
                    <StatusBanner status={passStatus} />

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1.5">New Password</label>
                            <input
                                type="password"
                                value={passwords.newPass}
                                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                required
                                className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm"
                                placeholder="Minimum 6 characters"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                required
                                className="w-full bg-[#0d1528] border border-slate-700 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-colors text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={passLoading}
                                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200 text-sm"
                            >
                                {passLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Updating...
                                    </span>
                                ) : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
