import { useState, useEffect } from 'react';
import { UserPlus, Search, Trash2, Edit3, Mail, Calendar, X, Save, UserCheck } from 'lucide-react';

// Sub-component: User Edit / Create Modal
export function UserEditModal({
  isOpen,
  userToEdit,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        _id: userToEdit._id,
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        password: '',
        role: userToEdit.role || 'user',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
      });
    }
    setErrorMsg('');
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Name and email are required.');
      return;
    }

    if (!formData._id && !formData.password) {
      setErrorMsg('Password is required for new user creation.');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save user details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#D1FAE5] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#D1FAE5] flex items-center justify-between bg-[#ECFDF5]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#064E3B]">
                {formData._id ? 'Edit User Account' : 'Create New User Account'}
              </h3>
              <p className="text-xs text-[#64748B] font-medium">
                {formData._id ? 'Update role & profile info' : 'Add student account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#064E3B] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626] font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#064E3B]">Full Name</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
              placeholder="e.g. Alex Rivera"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#064E3B]">Email Address</label>
            <input
              type="email"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#064E3B]">
              Password {formData._id && <span className="text-[#64748B] font-normal">(Leave blank to keep unchanged)</span>}
            </label>
            <input
              type="password"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
              placeholder={formData._id ? '••••••••' : 'Enter account password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required={!formData._id}
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#D1FAE5] flex items-center justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D1FAE5] text-[#334155] bg-white hover:bg-[#ECFDF5] transition-colors cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : formData._id ? 'Update User' : 'Create User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Module Component: User Management
export default function UserManagement({
  users = [],
  loading = false,
  onAddUser,
  onEditUser,
  onDeleteUser,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Exclude ADMIN users - list only regular users
  const regularUsers = users.filter((u) => u.role?.toLowerCase() !== 'admin');

  const filteredUsers = regularUsers.filter((u) => {
    const nameMatch = u.name ? u.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const emailMatch = u.email ? u.email.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return nameMatch || emailMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#D1FAE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#064E3B] mb-0">User Management</h2>
          </div>
        </div>

        <button
          onClick={onAddUser}
          className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#D1FAE5] p-4 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] text-[#064E3B]"
            placeholder="Search users by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#D1FAE5] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#64748B]">Loading user accounts...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B] space-y-2">
            <p className="mb-0 font-medium">No user accounts found matching your criteria.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1 text-xs font-semibold text-[#059669] underline cursor-pointer"
              >
                Reset search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#ECFDF5]/50 border-b border-[#D1FAE5] text-[10px] uppercase tracking-wider font-extrabold text-[#064E3B]">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D1FAE5] text-xs">
                {filteredUsers.map((u) => {
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : 'U';
                  const joinedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A';

                  return (
                    <tr key={u._id} className="hover:bg-[#F0FDF4]/50 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-[#064E3B]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                            {initial}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-[#64748B]">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-[#64748B]">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>{joinedDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditUser(u)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#059669] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
                            title="Edit user details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(u)}
                            className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"
                            title="Delete user account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
