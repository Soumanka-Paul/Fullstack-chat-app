import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../Store/useChatStore'
import { useAuthStore } from '../Store/useAuthStore'
import {
  Send, X, Loader2, Image, Video, Mic, MicOff,
  Paperclip, StopCircle, Trash2, MoreVertical
} from 'lucide-react'

const ChatContainer = () => {
  const {
    messages, getMessages, sendMessage, deleteMessage, selectedUser,
    isMessagesLoading, subscribeToMessages, unsubscribeFromMessages,
    isTyping, sendTypingIndicator
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null); // ← for delete button

  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const typingTimerRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatRecordingTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const handleTyping = (e) => {
    setText(e.target.value);
    sendTypingIndicator(selectedUser._id, true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      sendTypingIndicator(selectedUser._id, false);
    }, 2000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return;
    clearAllMedia();
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("video/")) return;
    clearAllMedia();
    const reader = new FileReader();
    reader.onloadend = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    clearAllMedia();
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview({
      base64: reader.result,
      originalName: file.name,
      fileType: file.name.split(".").pop(),
    });
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      clearAllMedia();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => setRecordingTime((p) => p + 1), 1000);
    } catch (error) {
      console.error("Microphone access denied:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const clearAllMedia = () => {
    setImagePreview(null);
    setVideoPreview(null);
    setFilePreview(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (!text.trim() && !imagePreview && !videoPreview && !audioBlob && !filePreview) return;
    setIsSending(true);
    sendTypingIndicator(selectedUser._id, false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    try {
      let messageData = { text: text.trim() };
      if (imagePreview) {
        messageData.image = imagePreview;
      } else if (videoPreview) {
        messageData.video = videoPreview;
      } else if (audioBlob) {
        const reader = new FileReader();
        const base64Audio = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(audioBlob);
        });
        messageData.audio = base64Audio;
        messageData.duration = recordingTime;
      } else if (filePreview) {
        messageData.file = filePreview;
      }
      await sendMessage(messageData);
      setText("");
      clearAllMedia();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex flex-col h-full">

      {/* ── Chat Header ───────────────────────────────────── */}
      <div className="border-b border-base-300 px-4 py-3 flex items-center gap-3 bg-base-100">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullname}
            className="size-10 rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full ring-2 ring-base-100" />
          )}
        </div>
        <div>
          <p className="font-semibold">{selectedUser.fullname}</p>
          {isTyping ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-primary font-medium">typing</span>
              <div className="flex gap-0.5 items-center">
                <span className="size-1 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="size-1 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="size-1 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-base-content/50">
              {isOnline ? <span className="text-emerald-500">● Online</span> : "Offline"}
            </p>
          )}
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isMessagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full gap-3 text-base-content/40">
            <div className="size-16 rounded-full bg-base-200 flex items-center justify-center">
              <Send className="size-7" />
            </div>
            <p className="text-sm">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === (authUser._id || authUser.id);
            return (
              <div
                key={msg._id}
                className={`flex ${isMine ? "justify-end" : "justify-start"} group`}
                onMouseEnter={() => setHoveredMessageId(msg._id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {/* Receiver Avatar */}
                {!isMine && (
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    className="size-7 rounded-full object-cover mr-2 self-end shrink-0"
                    alt=""
                  />
                )}

                <div className={`flex items-end gap-1 max-w-[70%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>

                  {/* Message Content */}
                  <div className="space-y-1">
                    {msg.image && (
                      <img src={msg.image} alt="attachment"
                        className="rounded-xl max-w-[220px] border border-base-content/10" />
                    )}
                    {msg.video && (
                      <video src={msg.video} controls
                        className="rounded-xl max-w-[280px] border border-base-content/10" />
                    )}
                    {msg.audio && (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl
                        ${isMine ? "bg-primary text-primary-content" : "bg-base-200"}`}>
                        <Mic className="size-4 shrink-0" />
                        <audio src={msg.audio} controls className="h-8 w-40" />
                        {msg.duration > 0 && (
                          <span className="text-xs opacity-70">{formatRecordingTime(msg.duration)}</span>
                        )}
                      </div>
                    )}
                    {msg.file?.url && (
                      <a href={msg.file.url} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm
                          ${isMine ? "bg-primary text-primary-content" : "bg-base-200"}`}>
                        <Paperclip className="size-4 shrink-0" />
                        <span className="truncate max-w-[160px]">{msg.file.originalName}</span>
                        <span className="uppercase text-xs opacity-70">{msg.file.fileType}</span>
                      </a>
                    )}
                    {msg.text && (
                      <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm
                        ${isMine
                          ? "bg-primary text-primary-content rounded-br-none"
                          : "bg-base-200 text-base-content rounded-bl-none"
                        }`}>
                        {msg.text}
                      </div>
                    )}
                    <p className={`text-[10px] text-base-content/40 ${isMine ? "text-right" : "text-left"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>

                  {/* ── Delete Button (only mine, only on hover) ── */}
                  {isMine && hoveredMessageId === msg._id && (
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="btn btn-circle btn-xs btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity mb-5"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}

                </div>

                {/* My Avatar */}
                {isMine && (
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    className="size-7 rounded-full object-cover ml-2 self-end shrink-0"
                    alt=""
                  />
                )}
              </div>
            );
          })
        )}

        {/* Typing Bubble */}
        {isTyping && (
          <div className="flex justify-start">
            <img src={selectedUser.profilePic || "/avatar.png"}
              className="size-7 rounded-full object-cover mr-2 self-end shrink-0" alt="" />
            <div className="bg-base-200 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1">
              <span className="size-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="size-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="size-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Media Previews ────────────────────────────────── */}
      {(imagePreview || videoPreview || filePreview || audioUrl) && (
        <div className="px-4 py-2 border-t border-base-300 bg-base-100 flex items-center gap-3">
          {imagePreview && (
            <div className="relative inline-block">
              <img src={imagePreview} className="h-20 rounded-lg object-cover" alt="preview" />
              <button onClick={clearAllMedia} className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error">
                <X className="size-3" />
              </button>
            </div>
          )}
          {videoPreview && (
            <div className="relative inline-block">
              <video src={videoPreview} className="h-20 rounded-lg" />
              <button onClick={clearAllMedia} className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error">
                <X className="size-3" />
              </button>
            </div>
          )}
          {audioUrl && (
            <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-xl">
              <Mic className="size-4 text-primary" />
              <audio src={audioUrl} controls className="h-8 w-40" />
              <span className="text-xs text-base-content/60">{formatRecordingTime(recordingTime)}</span>
              <button onClick={cancelRecording} className="btn btn-circle btn-xs btn-error ml-1">
                <X className="size-3" />
              </button>
            </div>
          )}
          {filePreview && (
            <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-xl">
              <Paperclip className="size-4 text-primary" />
              <span className="text-sm truncate max-w-[160px]">{filePreview.originalName}</span>
              <button onClick={clearAllMedia} className="btn btn-circle btn-xs btn-error ml-1">
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Recording Indicator ───────────────────────────── */}
      {isRecording && (
        <div className="px-4 py-2 border-t border-base-300 bg-base-100 flex items-center gap-3">
          <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm text-red-500 font-medium">
            Recording... {formatRecordingTime(recordingTime)}
          </span>
          <button onClick={stopRecording} className="btn btn-sm btn-error gap-1 ml-auto">
            <StopCircle className="size-4" /> Stop
          </button>
          <button onClick={cancelRecording} className="btn btn-sm btn-ghost gap-1">
            <X className="size-4" /> Cancel
          </button>
        </div>
      )}

      {/* ── Input Bar ─────────────────────────────────────── */}
      <div className="border-t border-base-300 px-4 py-3 bg-base-100 flex items-center gap-2">
        <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoChange} />
        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt,.zip" onChange={handleFileChange} />

        <button className="btn btn-circle btn-sm btn-ghost tooltip tooltip-top" data-tip="Image"
          onClick={() => imageInputRef.current?.click()}>
          <Image className="size-5 text-base-content/60" />
        </button>
        <button className="btn btn-circle btn-sm btn-ghost tooltip tooltip-top" data-tip="Video"
          onClick={() => videoInputRef.current?.click()}>
          <Video className="size-5 text-base-content/60" />
        </button>
        <button className="btn btn-circle btn-sm btn-ghost tooltip tooltip-top" data-tip="File"
          onClick={() => fileInputRef.current?.click()}>
          <Paperclip className="size-5 text-base-content/60" />
        </button>
        <button
          className={`btn btn-circle btn-sm tooltip tooltip-top ${isRecording ? "btn-error animate-pulse" : "btn-ghost"}`}
          data-tip={isRecording ? "Recording..." : "Voice"}
          onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? <MicOff className="size-5" /> : <Mic className="size-5 text-base-content/60" />}
        </button>

        <input
          type="text"
          className="input input-bordered input-sm flex-1"
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
        />

        <button
          className="btn btn-circle btn-sm btn-primary"
          onClick={handleSend}
          disabled={(!text.trim() && !imagePreview && !videoPreview && !audioBlob && !filePreview) || isSending}
        >
          {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </button>
      </div>

    </div>
  )
}

export default ChatContainer