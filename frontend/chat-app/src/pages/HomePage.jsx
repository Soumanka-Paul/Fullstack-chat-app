import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import NoChatSelected from '../components/NoChatSelected'
import { useChatStore } from '../Store/useChatStore'

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen pt-16 bg-base-200">
      <div className="flex h-full rounded-lg overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <div className="flex-1 bg-base-100">
          {selectedUser ? <ChatContainer /> : <NoChatSelected />}
        </div>

      </div>
    </div>
  )
}

export default HomePage