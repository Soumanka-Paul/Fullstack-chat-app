import React from 'react'
import { MessageSquare, Users, Lock } from 'lucide-react'

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-center p-8">

      {/* Animated Icon */}
      <div className="relative">
        <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <MessageSquare className="size-10 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 size-5 bg-emerald-500 rounded-full
          flex items-center justify-center animate-bounce">
          <span className="text-white text-[8px] font-bold">✓</span>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Welcome to Messeger!</h2>
        <p className="text-base-content/50 text-sm max-w-xs">
          Select a conversation from the sidebar to start chatting with your friends
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {[
          { icon: "⚡", text: "Real-time messaging" },
          { icon: "🖼️", text: "Share images & videos" },
          { icon: "🎤", text: "Voice messages" },
          { icon: "🔒", text: "Secure & private" },
        ].map((feature) => (
          <div key={feature.text}
            className="flex items-center gap-1.5 bg-base-200 px-3 py-1.5 rounded-full text-xs text-base-content/70">
            <span>{feature.icon}</span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default NoChatSelected