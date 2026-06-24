import React, { useContext } from 'react'
import Sidebar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSideBar'
import { ChatContext } from '../../context/chatContext'

const HomePage = () => {
  const chatContext = useContext(ChatContext)
  if (!chatContext) throw new Error('HomePage must be used within ChatProvider')
  const { selectedUser } = chatContext

  return (
    /*
      Outer wrapper — full screen, with horizontal/vertical padding on larger screens.
      On mobile (default) it fills the full viewport with no padding.
    */
    <div className="w-full h-screen sm:px-[8%] sm:py-[4%]">

      {/*
        Main container — blurred glass card.
        Grid switches from 1 col (mobile) to 2 cols (no chat selected)
        or 3 cols (chat selected) on md+ screens.
      */}
      <div className={`
        h-full rounded-none sm:rounded-2xl overflow-hidden
        border border-gray-700 backdrop-blur-xl
        grid grid-cols-1
        ${selectedUser
          ? 'md:grid-cols-[260px_1fr_280px]'
          : 'md:grid-cols-[260px_1fr]'}
      `}>

        {/* Left — contacts list */}
        <Sidebar />

        {/* Center — active chat or empty state */}
        <ChatContainer />

        {/* Right — user details panel, only visible when a chat is open */}
        {selectedUser && <RightSidebar />}

      </div>
    </div>
  )
}

export default HomePage