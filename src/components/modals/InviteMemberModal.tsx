import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InviteMemberModal: React.FC = () => {
  const { isInviteModalOpen, closeInviteModal, inviteMember } = useApp();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInviteModalOpen) closeInviteModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInviteModalOpen, closeInviteModal]);

  if (!isInviteModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !email.trim()) return;

    inviteMember({
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      avatarColor: '#8B5CF6',
    });

    setName('');
    setRole('');
    setEmail('');
    closeInviteModal();
  };

  return (
    <div 
      onClick={closeInviteModal}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="font-heading text-lg font-bold text-gray-900">
              Invite Team Member
            </h2>
          </div>

          <button
            onClick={closeInviteModal}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Role & Title *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Design Systems Specialist"
              className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya.lin@taskforge.dev"
              className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 text-gray-900"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-purple-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeInviteModal}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all active:scale-95"
            >
              Send Workspace Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
