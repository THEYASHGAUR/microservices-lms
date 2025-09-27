'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  UserIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface Chat {
  id: string
  name: string
  type: 'group' | 'personal'
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline?: boolean
  courseName?: string
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isOwn: boolean
}

// Dummy chat data
const dummyChats: Chat[] = [
  {
    id: '1',
    name: 'React Fundamentals - Group Chat',
    type: 'group',
    lastMessage: 'Hey everyone! How is the assignment going?',
    timestamp: '2 min ago',
    unreadCount: 3,
    courseName: 'React Fundamentals'
  },
  {
    id: '2',
    name: 'Alice Johnson',
    type: 'personal',
    lastMessage: 'Thanks for helping me with the code!',
    timestamp: '1 hour ago',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: '3',
    name: 'Node.js Backend - Group Chat',
    type: 'group',
    lastMessage: 'The server is running perfectly now',
    timestamp: '3 hours ago',
    unreadCount: 1,
    courseName: 'Node.js Backend Development'
  },
  {
    id: '4',
    name: 'Bob Smith',
    type: 'personal',
    lastMessage: 'Can we discuss the project requirements?',
    timestamp: '1 day ago',
    unreadCount: 2,
    isOnline: false
  }
]

// Dummy messages for selected chat
const dummyMessages: Message[] = [
  {
    id: '1',
    sender: 'Alice Johnson',
    content: 'Hey! How is everyone doing with the React assignment?',
    timestamp: '10:30 AM',
    isOwn: false
  },
  {
    id: '2',
    sender: 'You',
    content: 'I\'m working on the component structure. It\'s going well!',
    timestamp: '10:32 AM',
    isOwn: true
  },
  {
    id: '3',
    sender: 'Mike Chen',
    content: 'Same here! The hooks are really interesting to learn',
    timestamp: '10:35 AM',
    isOwn: false
  },
  {
    id: '4',
    sender: 'You',
    content: 'Absolutely! useState and useEffect are game changers',
    timestamp: '10:36 AM',
    isOwn: true
  }
]

export default function StudentChatsPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(dummyChats[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const filteredChats = dummyChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Chats</h1>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {chat.type === 'group' ? (
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className={`h-10 w-10 rounded-full ${chat.isOnline ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {chat.name}
                    </p>
                    <p className="text-xs text-gray-500">{chat.timestamp}</p>
                  </div>
                  
                  {chat.courseName && (
                    <p className="text-xs text-blue-600 mb-1">{chat.courseName}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                {selectedChat.type === 'group' ? (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <UserGroupIcon className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className={`h-8 w-8 rounded-full ${selectedChat.isOnline ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h2>
                  {selectedChat.courseName && (
                    <p className="text-sm text-blue-600">{selectedChat.courseName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dummyMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {!message.isOwn && (
                      <p className="text-xs font-medium mb-1">{message.sender}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <PaperAirplaneIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat</h3>
              <p className="text-gray-600">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
