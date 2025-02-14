import React from 'react'
import {useChatStore} from "../store/ChatUser"
import MessageSkeleton from './skeletons/MessageSkeleton'
import {useAuthStore} from '../store/AuthUser'
import {useEffect, useRef} from "react"
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
    const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessage} = useChatStore();

    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => unsubscribeFromMessage();
    },[selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessage]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if(isMessagesLoading)   return <MessageSkeleton />

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
            <div
            key={message._id}
            className={`flex items-start gap-3 ${
                message.senderId === authUser._id ? "justify-end" : "justify-start"
            }`}
            ref={messageEndRef}
            >
            {/* Avatar */}
            <div className="size-10 rounded-full border border-gray-600 overflow-hidden">
                <img
                src={
                    message.senderId === authUser._id
                    ? authUser.profilePic || "/avatar.png"
                    : selectedUser.profilePic || "/avatar.png"
                }
                alt="profile pic"
                className="w-full h-full object-cover"
                />
            </div>

            {/* Message Content */}
            <div className={`max-w-xs sm:max-w-md flex flex-col ${message.senderId === authUser._id ? "items-end" : "items-start"}`}>
                {/* Timestamp */}
                <div className="text-xs text-gray-400 mb-1">
                {formatMessageTime(message.createdAt)}
                </div>

                {/* Message Bubble */}
                <div
                className={`p-3 rounded-lg text-white ${
                    message.senderId === authUser._id ? "bg-gray-700" : "bg-gray-800"
                }`}
                >
                {/* Image Attachment */}
                {message.image && (
                    <img
                    src={message.image}
                    alt="Attachment"
                    className="rounded-md mb-2 max-w-[200px]"
                    />
                )}

                {/* Text Message */}
                {message.text && <p>{message.text}</p>}
                </div>
            </div>
            </div>
        ))}
        </div>


        <MessageInput />
    </div>
  )
}

export default ChatContainer
