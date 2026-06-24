import React, { useContext, useEffect, useRef, useState, FormEvent, ChangeEvent } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/chatContext'
import { AuthContext } from '../../context/authContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const chatContext = useContext(ChatContext)
  const authContext = useContext(AuthContext)
  if (!chatContext) throw new Error('ChatContainer must be used within ChatProvider')
  if (!authContext) throw new Error('ChatContainer must be used within AuthProvider')

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = chatContext
  const { authUser, onlineUsers } = authContext

  const scrollEnd = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() === '') return
    await sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleSendImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id)
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // ── Empty state (no chat selected) ──
  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center gap-3 h-full bg-white/5">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          {/* chat bubble icon */}
          <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">Select a conversation to start chatting</p>
      </div>
    )
  }

  const isOnline = onlineUsers.includes(selectedUser._id)

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 bg-white/5 flex-shrink-0">
        {/* Back button — mobile only */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt={selectedUser.fullName}
            className="w-9 h-9 rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
          )}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{selectedUser.fullName}</p>
          <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>

        {/* Help icon */}
        <img src={assets.help_icon} alt="Help" className="w-5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer hidden md:block" />
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg: any, index: number) => {
          const isSent = msg.senderId === authUser?._id
          const avatar = isSent
            ? authUser?.profilePic || assets.avatar_icon
            : selectedUser.profilePic || assets.avatar_icon

          return (
            <div key={index} className={`flex items-end gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <img src={avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0 mb-1" />

              {/* Bubble */}
              <div className={`flex flex-col gap-1 max-w-[60%] ${isSent ? 'items-end' : 'items-start'}`}>
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="shared image"
                    className="max-w-[220px] rounded-2xl border border-gray-700 object-cover"
                  />
                ) : (
                  <p className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words
                    ${isSent
                      ? 'bg-violet-600 text-white rounded-br-sm'
                      : 'bg-white/10 text-gray-100 border border-gray-700 rounded-bl-sm'
                    }`}>
                    {msg.text}
                  </p>
                )}
                {/* Timestamp */}
                <p className="text-xs text-gray-500 px-1">{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          )
        })}
        <div ref={scrollEnd} />
      </div>

      {/* ── Input bar ── */}
      <div className="px-4 py-3 border-t border-gray-700 bg-white/5 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* Image attach */}
          <input onChange={handleSendImage} type="file" id="image" accept="image/png,image/jpeg" hidden />
          <label htmlFor="image"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </label>

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') handleSendMessage(e as any)
            }}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />

          {/* Send button */}
          <button type="submit"
            className="w-9 h-9 bg-violet-600 hover:bg-violet-700 rounded-full flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40"
            disabled={input.trim() === ''}>
            <svg className="w-4 h-4 text-white translate-x-px" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  )
}

export default ChatContainer