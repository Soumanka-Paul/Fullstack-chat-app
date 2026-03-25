import React from 'react'
import { useThemeStore } from '../Store/useThemeStore'
import { themes } from '../constants/index.js'
import { Send } from 'lucide-react'

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm good, how about you?", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl">

      {/* ── Theme Selector ────────────────────────────────── */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/60">Choose a theme for your chat interface</p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {themes.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg
                transition-all duration-200 cursor-pointer
                ${theme === t
                  ? "bg-base-200 ring-2 ring-primary scale-105"
                  : "hover:bg-base-200"
                }
              `}
              onClick={() => setTheme(t)}
            >
              {/* Color Swatches */}
              <div
                className="relative h-8 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <span className="rounded bg-primary"></span>
                  <span className="rounded bg-secondary"></span>
                  <span className="rounded bg-accent"></span>
                  <span className="rounded bg-neutral"></span>
                </div>
              </div>

              {/* Theme Name */}
              <span className="text-[10px] font-medium truncate w-full text-center capitalize">
                {t}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Preview ──────────────────────────────────── */}
      <div className="mt-8 space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="text-sm text-base-content/60">This is how your chat will look</p>
        </div>

        <div className="rounded-xl border border-base-content/10 overflow-hidden shadow-lg bg-base-100">

          {/* Chat Header */}
          <div className="bg-base-200 px-4 py-3 flex items-center gap-3 border-b border-base-content/10">
            <div className="size-9 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
              S
            </div>
            <div>
              <p className="font-medium text-sm">Soumanka</p>
              <p className="text-xs text-emerald-500 font-medium">● Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 min-h-[180px] bg-base-100">
            {PREVIEW_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm
                    ${msg.isSent
                      ? "bg-primary text-primary-content rounded-br-none"
                      : "bg-base-200 text-base-content rounded-bl-none"
                    }
                  `}
                >
                  {msg.content}
                  <p className={`text-[10px] mt-1 ${msg.isSent ? "text-primary-content/70 text-right" : "text-base-content/50"}`}>
                    12:00 PM
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="bg-base-200 px-4 py-3 flex items-center gap-2 border-t border-base-content/10">
            <input
              type="text"
              className="input input-bordered input-sm flex-1 text-sm"
              placeholder="Type a message..."
              readOnly
            />
            <button className="btn btn-primary btn-sm px-3">
              <Send className="size-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default SettingsPage