import React, { useEffect, useState } from 'react'
import { useChatStore } from '../Store/useChatStore'
import { useAuthStore } from '../Store/useAuthStore'
import { Users, Search } from 'lucide-react'

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading, unreadCounts } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { getUsers(); }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullname.toLowerCase().includes(search.toLowerCase());
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    return matchesSearch && matchesOnline;
  });

  // Online count excluding self
  const onlineCount = onlineUsers.filter(id =>
    users.some(user => user._id === id)
  ).length;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="border-b border-base-300 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <span className="font-semibold hidden lg:block">Chats</span>
          </div>
          {/* Online count badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium">{onlineCount} online</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered input-sm w-full pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Online filter */}
        <div className="hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm checkbox-primary"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
            />
            <span className="text-sm text-base-content/70">Online only</span>
          </label>
        </div>
      </div>

      {/* ── User List ──────────────────────────────────────── */}
      <div className="overflow-y-auto flex-1 py-2">
        {isUsersLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-base-content/40">
            <Users className="size-8" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const unreadCount = unreadCounts[user._id] || 0;
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;

            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full flex items-center gap-3 p-3 hover:bg-base-200
                  transition-colors duration-150
                  ${isSelected ? "bg-base-200 border-l-4 border-primary" : ""}
                `}
              >
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullname}
                    className="size-10 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full ring-2 ring-base-100" />
                  )}
                </div>

                {/* User Info */}
                <div className="hidden lg:flex flex-col items-start min-w-0 flex-1">
                  <span className="font-medium text-sm truncate w-full text-left">
                    {user.fullname}
                  </span>
                  <span className="text-xs text-base-content/50">
                    {isOnline
                      ? <span className="text-emerald-500">● Online</span>
                      : "Offline"
                    }
                  </span>
                </div>

                {/* ── Unread Badge ──────────────────────────── */}
                {unreadCount > 0 && !isSelected && (
                  <span className="hidden lg:flex size-5 bg-primary text-primary-content
                    text-[10px] font-bold rounded-full items-center justify-center shrink-0">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}

              </button>
            );
          })
        )}
      </div>

    </aside>
  )
}

export default Sidebar