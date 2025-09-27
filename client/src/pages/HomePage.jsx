import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
const HomePage = () => {
  const [selectedUser,setSeletedUser]=useState(false);
  return (
    <div className='border w-full min-h-screen sm:px-[15%] sm:py-[5%] bg-cover bg-center'>
      <div className='backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid gird-cols-1 relative'>
        <SideBar></SideBar>
        <ChatContainer></ChatContainer>
        <RightSideBar></RightSideBar>
      </div>
    </div>
  )
}

export default HomePage
