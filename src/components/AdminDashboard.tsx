import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  KeyRound,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  AlertCircle,
  ArrowRight,
  Eye,
  Building,
  Mail,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AdminUserData, DealbookDeal, DealbookUser, Role } from '../types';
import { api, DealbookApiError } from '../services/dealbookApi';
import { useTheme } from '../context/ThemeContext';

interface AdminDashboardProps {
  deals: DealbookDeal[];
  onDealsUpdated: () => void;
  onPreviewRole: (role: Role) => void;
  onOpenDossier?: (deal: DealbookDeal) => void;
  onSignOut?: () => void;
  onExitAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  deals,
  onDealsUpdated,
  onPreviewRole,
  onSignOut,
  onExitAdmin,
}) => {
  const { isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<'users' | 'deals'>('users');
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | Role>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'disabled'>('all');

  // Create User Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createEmail, setCreateEmail] = useState('');
  const [createName, setCreateName] = useState('');
  const [createFirm, setCreateFirm] = useState('');
  const [createRole, setCreateRole] = useState<Role>('investor');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Temporary Password Display Modal state (after create or reset)
  const [tempPasswordModal, setTempPasswordModal] = useState<{
    user: DealbookUser;
    tempPassword: string;
    isReset: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Edit User Modal state
  const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
  const [editName, setEditName] = useState('');
  const [editFirm, setEditFirm] = useState('');
  const [editFocus, setEditFocus] = useState('');
  const [editRole, setEditRole] = useState<Role>('investor');
  const [editLoading, setEditLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserError(null);
    try {
      const res = await api.admin.listUsers();
      setUsers(res.users);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        setUserError(`Failed to load users: ${err.code}`);
      } else {
        setUserError('Could not reach user management service.');
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!createEmail.trim() || !createName.trim()) {
      setCreateError('Please fill in required fields (Name and Email).');
      return;
    }
    setCreateLoading(true);
    try {
      const res = await api.admin.createUser({
        email: createEmail.trim(),
        name: createName.trim(),
        firm: createFirm.trim() || undefined,
        role: createRole,
      });
      setIsCreateOpen(false);
      setCreateEmail('');
      setCreateName('');
      setCreateFirm('');
      setCreateRole('investor');
      setTempPasswordModal({
        user: res.user,
        tempPassword: res.tempPassword,
        isReset: false,
      });
      fetchUsers();
      showToast(`User ${res.user.name} created successfully.`);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        setCreateError(`Creation failed: ${err.code.replace(/_/g, ' ')}`);
      } else {
        setCreateError('Failed to create user. Please try again.');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleResetPassword = async (user: AdminUserData) => {
    if (!window.confirm(`Reset password for ${user.name} (${user.email})? A new one-time password will be generated.`)) {
      return;
    }
    try {
      const res = await api.admin.resetPassword(user.id);
      setTempPasswordModal({
        user,
        tempPassword: res.tempPassword,
        isReset: true,
      });
      showToast(`Temporary password generated for ${user.name}.`);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        showToast(`Reset failed: ${err.code}`);
      } else {
        showToast('Password reset failed.');
      }
    }
  };

  const handleStatusChange = async (user: AdminUserData, nextStatus: 'active' | 'disabled') => {
    try {
      await api.admin.updateUser(user.id, { status: nextStatus });
      fetchUsers();
      showToast(`Status for ${user.name} updated to ${nextStatus}.`);
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        showToast(`Update failed: ${err.code}`);
      } else {
        showToast('Failed to update status.');
      }
    }
  };

  const handleOpenEdit = (user: AdminUserData) => {
    setEditingUser(user);
    setEditName(user.name || '');
    setEditFirm(user.firm || '');
    setEditFocus(user.focus || '');
    setEditRole(user.role);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditLoading(true);
    try {
      await api.admin.updateUser(editingUser.id, {
        name: editName.trim(),
        firm: editFirm.trim(),
        focus: editFocus.trim(),
        role: editRole,
      });
      setEditingUser(null);
      fetchUsers();
      showToast('User profile updated.');
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        showToast(`Update failed: ${err.code}`);
      } else {
        showToast('Profile update failed.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (!tempPasswordModal) return;
    navigator.clipboard.writeText(tempPasswordModal.tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterStatus !== 'all' && u.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchFirm = u.firm?.toLowerCase().includes(q);
      const matchFocus = u.focus?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchFirm && !matchFocus) return false;
    }
    return true;
  });

  const pendingPartnersCount = users.filter((u) => u.status === 'pending').length;
  const activeInvestorsCount = users.filter((u) => u.role === 'investor' && u.status === 'active').length;
  const activePartnersCount = users.filter((u) => u.role === 'broker' && u.status === 'active').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-black/90 border border-[rgba(201,162,77,0.4)] text-[#EDEDE9] text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C9A24D]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header & Role Switcher */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#151518] border-[rgba(255,255,255,0.08)]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold mb-2 bg-[rgba(201,162,77,0.12)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)]">
              <Shield className="w-3.5 h-3.5" />
              Quatromine Operations Console
            </div>
            <h1
              className={`font-serif text-2xl sm:text-3xl font-medium tracking-tight ${
                isLight ? 'text-slate-900' : 'text-[#EDEDE9]'
              }`}
            >
              System Administration & DealBook Governance
            </h1>
            <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isLight ? 'text-slate-600' : 'text-[#8E8E93]'}`}>
              Manage user authorizations, approve partner registrations, and review CRM-synced opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onPreviewRole('investor')}
              className={`px-3 py-2 text-xs rounded-xl border transition-colors flex items-center gap-1.5 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-[#1E1E22] hover:bg-[#28282D] text-[#EDEDE9] border-[rgba(255,255,255,0.1)]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A24D]" />
              <span>Preview Investor View</span>
            </button>
            <button
              onClick={() => onPreviewRole('broker')}
              className={`px-3 py-2 text-xs rounded-xl border transition-colors flex items-center gap-1.5 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-[#1E1E22] hover:bg-[#28282D] text-[#EDEDE9] border-[rgba(255,255,255,0.1)]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span>Preview Partner View</span>
            </button>
            {onExitAdmin && (
              <button
                onClick={onExitAdmin}
                className="px-3 py-2 text-xs rounded-xl bg-[rgba(201,162,77,0.15)] hover:bg-[rgba(201,162,77,0.25)] text-[#C9A24D] border border-[rgba(201,162,77,0.4)] transition-colors font-medium"
              >
                Return to Deal View
              </button>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
              Total Users
            </span>
            <span className="text-2xl font-serif text-[#EDEDE9]">{users.length}</span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
              Pending Approvals
            </span>
            <span className={`text-2xl font-serif ${pendingPartnersCount > 0 ? 'text-amber-400 font-bold' : 'text-[#EDEDE9]'}`}>
              {pendingPartnersCount}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
              Active Investors
            </span>
            <span className="text-2xl font-serif text-emerald-400">{activeInvestorsCount}</span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
              Synced Opportunities
            </span>
            <span className="text-2xl font-serif text-[#C9A24D]">{deals.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#C9A24D] text-black font-semibold'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Accounts & Authorizations</span>
            {pendingPartnersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-bold">
                {pendingPartnersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'deals'
                ? 'bg-[#C9A24D] text-black font-semibold'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CRM Deals & Pipeline ({deals.length})</span>
          </button>
        </div>

        {activeTab === 'users' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[rgba(201,162,77,0.15)] hover:bg-[rgba(201,162,77,0.25)] text-[#C9A24D] border border-[rgba(201,162,77,0.4)] flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New User</span>
          </button>
        )}
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#151518] border-white/10'
            }`}
          >
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, firm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    : 'bg-[#1A1A1E] border-white/10 text-white placeholder:text-stone-500'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Role filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as 'all' | Role)}
                className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-[#1A1A1E] border-white/10 text-stone-300'
                }`}
              >
                <option value="all">All Roles</option>
                <option value="investor">Investors</option>
                <option value="broker">Brokers / Partners</option>
                <option value="admin">Admins</option>
              </select>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'active' | 'disabled')}
                className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-[#1A1A1E] border-white/10 text-stone-300'
                }`}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Approval</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>

              <button
                onClick={fetchUsers}
                title="Refresh user list"
                className="p-2 rounded-lg text-stone-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* User Table */}
          {loadingUsers ? (
            <div className="p-16 text-center text-xs text-stone-400">
              <div className="w-5 h-5 border-2 border-[rgba(201,162,77,0.3)] border-t-[#C9A24D] rounded-full animate-spin mx-auto mb-3" />
              <p>Loading user directory from server...</p>
            </div>
          ) : userError ? (
            <div className="p-8 text-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <p>{userError}</p>
              <button
                onClick={fetchUsers}
                className="mt-3 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs text-rose-200"
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-[#151518] text-stone-400 text-xs">
              <Users className="w-8 h-8 text-stone-600 mx-auto mb-3" />
              <p className="font-medium text-stone-300">No matching user accounts</p>
              <p className="mt-1">Try modifying your search or filter parameters.</p>
            </div>
          ) : (
            <div
              className={`rounded-2xl border overflow-hidden ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151518] border-white/10'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b uppercase tracking-wider text-[10px] ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-500'
                        : 'bg-[#18181C] border-white/10 text-stone-400'
                    }`}
                  >
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">User</th>
                      <th className="py-3.5 px-4 font-semibold">Firm / Focus</th>
                      <th className="py-3.5 px-4 font-semibold">Role</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Registered</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => {
                      const isPending = u.status === 'pending';
                      const isActive = u.status === 'active';
                      const isDisabled = u.status === 'disabled';

                      return (
                        <tr
                          key={u.id}
                          className={`hover:bg-white/[0.02] transition-colors ${
                            isPending ? 'bg-amber-500/[0.04]' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-white">{u.name || 'Unnamed'}</div>
                            <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-stone-500" />
                              <span>{u.email}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-white">{u.firm || '—'}</div>
                            {u.focus && (
                              <div className="text-[11px] text-stone-400 truncate max-w-xs mt-0.5">
                                {u.focus}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                  : u.role === 'investor'
                                  ? 'bg-[#C9A24D]/15 text-[#C9A24D] border border-[#C9A24D]/30'
                                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {u.role === 'broker' ? 'Partner' : u.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                                <AlertCircle className="w-3 h-3" />
                                Pending Review
                              </span>
                            ) : isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-500/20 text-stone-400 border border-stone-500/30">
                                <XCircle className="w-3 h-3" />
                                Disabled
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* If Pending Partner: Quick Approve */}
                              {isPending && (
                                <button
                                  onClick={() => handleStatusChange(u, 'active')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-sm"
                                  title="Approve partner application immediately"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Approve Partner</span>
                                </button>
                              )}

                              {/* Toggle active / disabled */}
                              {isActive && (
                                <button
                                  onClick={() => handleStatusChange(u, 'disabled')}
                                  className="px-2 py-1 rounded-lg text-[11px] text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
                                  title="Disable account"
                                >
                                  Disable
                                </button>
                              )}
                              {isDisabled && (
                                <button
                                  onClick={() => handleStatusChange(u, 'active')}
                                  className="px-2 py-1 rounded-lg text-[11px] text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 transition-colors"
                                  title="Reactivate account"
                                >
                                  Activate
                                </button>
                              )}

                              {/* Reset Password */}
                              <button
                                onClick={() => handleResetPassword(u)}
                                className="px-2 py-1 rounded-lg text-[11px] text-[#C9A24D] hover:bg-[#C9A24D]/10 border border-[rgba(201,162,77,0.2)] hover:border-[#C9A24D]/40 transition-colors flex items-center gap-1"
                                title="Generate a new one-time temporary password"
                              >
                                <KeyRound className="w-3 h-3" />
                                <span>Reset PW</span>
                              </button>

                              {/* Edit Profile */}
                              <button
                                onClick={() => handleOpenEdit(u)}
                                className="px-2 py-1 rounded-lg text-[11px] text-stone-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CRM DEALS PIPELINE */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          {/* CRM Explanatory Banner */}
          <div className="p-5 rounded-2xl bg-[rgba(201,162,77,0.08)] border border-[rgba(201,162,77,0.25)] text-xs leading-relaxed text-[#EDEDE9]">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#C9A24D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#C9A24D] mb-1">
                  CRM Deal Governance Architecture
                </p>
                <p className="text-stone-300">
                  Deals are authored and governed directly in the Quatromine CRM. Ticking <strong>&quot;Show in Dealbook&quot;</strong> on any opportunity record in the CRM publishes it live to vetted institutional investors and partners.
                  Company identity is concealed for investors and partners, while you as admin can view company names and jump directly into the CRM opportunity record via the links below.
                </p>
              </div>
            </div>
          </div>

          {deals.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-white/10 bg-[#151518] text-stone-400 text-xs">
              <Layers className="w-8 h-8 text-stone-600 mx-auto mb-3" />
              <p className="font-medium text-stone-300 text-sm">No Deals Currently Synced</p>
              <p className="mt-1 max-w-md mx-auto">
                Once opportunities in the CRM have the &quot;Show in Dealbook&quot; checkbox enabled and the DealBook import runs, they will appear here automatically.
              </p>
            </div>
          ) : (
            <div
              className={`rounded-2xl border overflow-hidden ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151518] border-white/10'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b uppercase tracking-wider text-[10px] ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-500'
                        : 'bg-[#18181C] border-white/10 text-stone-400'
                    }`}
                  >
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Reference & Title</th>
                      <th className="py-3.5 px-4 font-semibold">CRM Company</th>
                      <th className="py-3.5 px-4 font-semibold">Stage & Asset Class</th>
                      <th className="py-3.5 px-4 font-semibold">Clusters & Fields</th>
                      <th className="py-3.5 px-4 font-semibold">Geography</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">CRM Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {deals.map((deal) => (
                      <tr key={deal.ref} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-white">
                          <div>{deal.ref}</div>
                          <div className="text-[11px] font-sans text-stone-400 line-clamp-1 mt-0.5">
                            {deal.title}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-white font-medium">
                          {deal.admin?.company || '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {deal.companyStage.map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-stone-300 border border-white/10"
                              >
                                {s}
                              </span>
                            ))}
                            {deal.assetClass.map((ac) => (
                              <span
                                key={ac}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-[rgba(201,162,77,0.1)] text-[#C9A24D] border border-[rgba(201,162,77,0.25)]"
                              >
                                {ac}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-[11px] text-stone-300">
                            {[...deal.clusters, ...deal.fields].slice(0, 3).join(', ') || '—'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-stone-400">
                          {deal.geography.join(', ') || '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          {deal.admin?.published !== false ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-500/20 text-stone-400 border border-stone-500/30">
                              Draft / Hidden
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {deal.admin?.crmUrl ? (
                            <a
                              href={deal.admin.crmUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[rgba(201,162,77,0.12)] hover:bg-[rgba(201,162,77,0.22)] text-[#C9A24D] border border-[rgba(201,162,77,0.3)] transition-colors"
                            >
                              <span>Open in CRM</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-stone-500 text-[11px]">No CRM URL</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: CREATE USER */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#151518] border-white/10 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg tracking-tight">Create User Account</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-stone-400 mb-4">
              A temporary one-time password will be generated upon creation. The user will be required to change it at their first login.
            </p>

            {createError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. Marc Vance"
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-[#1C1C20] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="e.g. m.vance@capital.ch"
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-[#1C1C20] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Firm / Fund (Optional)</label>
                <input
                  type="text"
                  value={createFirm}
                  onChange={(e) => setCreateFirm(e.target.value)}
                  placeholder="e.g. Geneva Wealth Partners"
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-[#1C1C20] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Assigned Role</label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as Role)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-[#1C1C20] border-white/10 text-white'
                  }`}
                >
                  <option value="investor">Vetted Investor</option>
                  <option value="broker">Origination Partner (Broker)</option>
                  <option value="admin">Quatromine Operations (Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors disabled:opacity-50"
                >
                  {createLoading ? 'Creating User...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ONE-TIME PASSWORD DISPLAY (Copy & Handover) */}
      {tempPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-[rgba(201,162,77,0.4)] p-6 bg-[#151518] text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(201,162,77,0.15)] border border-[rgba(201,162,77,0.3)] flex items-center justify-center text-[#C9A24D]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg tracking-tight">
                  {tempPasswordModal.isReset ? 'Password Reset Complete' : 'User Account Created'}
                </h3>
                <p className="text-xs text-stone-400">
                  {tempPasswordModal.user.name} ({tempPasswordModal.user.email})
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[rgba(201,162,77,0.08)] border border-[rgba(201,162,77,0.25)] mb-4">
              <p className="text-[11px] text-stone-300 mb-2">
                Hand this one-time temporary password over to the user. The platform will require them to set their own permanent password upon their initial sign-in:
              </p>
              <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-sm text-[#C9A24D]">
                <span className="select-all font-bold">{tempPasswordModal.tempPassword}</span>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTempPasswordModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C9A24D] text-black hover:bg-[#d4b05e] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER PROFILE */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 bg-[#151518] text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg tracking-tight">Edit User Profile</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-stone-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-[#1C1C20] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A24D]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Firm / Fund</label>
                <input
                  type="text"
                  value={editFirm}
                  onChange={(e) => setEditFirm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-[#1C1C20] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A24D]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Sector Focus</label>
                <input
                  type="text"
                  value={editFocus}
                  onChange={(e) => setEditFocus(e.target.value)}
                  placeholder="e.g. Enterprise AI, Deep Tech"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-[#1C1C20] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A24D]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as Role)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-[#1C1C20] border border-white/10 text-white focus:outline-none"
                >
                  <option value="investor">Vetted Investor</option>
                  <option value="broker">Origination Partner (Broker)</option>
                  <option value="admin">Quatromine Operations (Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-2 rounded-lg text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
