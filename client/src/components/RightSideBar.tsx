import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/chatContext'
import { AuthContext } from '../../context/authContext'

const RightSidebar = () => {
  const chatContext = useContext(ChatContext)
  const authContext = useContext(AuthContext)
  if (!chatContext) throw new Error('RightSidebar must be used within ChatProvider')
  if (!authContext) throw new Error('RightSidebar must be used within AuthProvider')

  const { selectedUser, messages } = chatContext
  const { logout, onlineUsers } = authContext

  const [msgImages, setMsgImages] = useState<string[]>([])

  // Extract all image messages whenever messages update
  useEffect(() => {
    setMsgImages(
      messages.filter((msg: any) => msg.image).map((msg: any) => msg.image)
    )
  }, [messages])

  if (!selectedUser) return null

  const isOnline = onlineUsers.includes(selectedUser._id)

  return (
    <div className="hidden md:flex flex-col h-full bg-white/5 border-l border-gray-700 overflow-y-auto">

      {/* ── User info ── */}
      <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-6 border-b border-gray-700">
        {/* Avatar with online dot */}
        <div className="relative">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt={selectedUser.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/40"
          />
          {isOnline && (
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
          )}
        </div>

        <div className="text-center">
          <h2 className="text-white font-medium text-base">{selectedUser.fullName}</h2>
          <p className={`text-xs mt-0.5 ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>

        {/* Bio */}
        {selectedUser.bio && (
          <p className="text-gray-400 text-xs text-center leading-relaxed px-2">
            {selectedUser.bio}
          </p>
        )}
      </div>

      {/* ── Shared media ── */}
      <div className="flex-1 px-4 py-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">
          Shared media
        </p>

        {msgImages.length === 0 ? (
          <p className="text-gray-600 text-xs text-center mt-6">No media shared yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer border border-gray-700 hover:border-violet-500/50 transition-colors"
              >
                <img src={url} alt="shared media" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Logout ── */}
      <div className="px-4 pb-6">
        <button
          onClick={() => logout()}
          className="w-full py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-white/5 text-sm transition-colors"
        >
          Sign out
        </button>
      </div>

    </div>
  )
}

export default RightSidebar