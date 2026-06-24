import React, { useContext, useEffect, useState, ChangeEvent } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { ChatContext } from '../../context/chatContext'

const Sidebar = () => {
  const chatContext = useContext(ChatContext)
  const authContext = useContext(AuthContext)
  if (!chatContext) throw new Error('Sidebar must be used within ChatProvider')
  if (!authContext) throw new Error('Sidebar must be used within AuthProvider')

  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = chatContext
  const { logout, onlineUsers } = authContext

  const [input, setInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const filteredUsers = input
    ? users.filter((user: any) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users

  useEffect(() => {
    getUsers()
  }, [onlineUsers])

  return (
    <div className={`flex flex-col h-full bg-white/5 border-r border-gray-700 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <p className="text-white font-medium text-sm">Messages</p>

        {/* Menu — edit profile + logout */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <img src={assets.menu_icon} alt="Menu" className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              {/* Invisible backdrop to close menu on outside click */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute top-full right-0 mt-1 z-20 w-36 bg-[#1e1b3a] border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                <button
                  onClick={() => { navigate('/profile'); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Edit profile
                </button>
                <div className="h-px bg-gray-700" />
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 py-2.5 border-b border-gray-700 flex-shrink-0">
        <div className="relative">
          <img src={assets.search_icon} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 opacity-50" />
          <input
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white/5 border border-gray-700 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* ── User list ── */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-600 text-xs text-center mt-8 px-4">No users found</p>
        ) : (
          filteredUsers.map((user: any, index: number) => {
            const isOnline = onlineUsers.includes(user._id)
            const unseen = unseenMessages[user._id]
            const isActive = selectedUser?._id === user._id

            return (
              <div
                key={index}
                onClick={() => {
                  setSelectedUser(user)
                  setUnseenMessages((prev: Record<string, number>) => ({ ...prev, [user._id]: 0 }))
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-700/50
                  ${isActive
                    ? 'bg-violet-600/15 border-l-2 border-l-violet-500'
                    : 'hover:bg-white/5'
                  }`}
              >
                {/* Avatar with online dot */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                </div>

                {/* Name + status */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user.fullName}</p>
                  <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>

                {/* Unseen badge */}
                {unseen > 0 && (
                  <span className="w-5 h-5 bg-violet-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">
                    {unseen}
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}

export default Sidebar