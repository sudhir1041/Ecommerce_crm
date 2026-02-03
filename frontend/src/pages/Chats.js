import React, { useState } from 'react';
import {
  Chat,
  Send,
  AttachFile,
  EmojiEmotions,
  Search,
  MoreVert,
  Circle,
  CheckCircle,
  Person,
  Phone,
  VideoCall,
} from '@mui/icons-material';

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');

  const chatList = [
    {
      id: 1,
      customer: 'Rahul Sharma',
      lastMessage: 'Hi, I need help with my order',
      timestamp: '2 min ago',
      unread: 2,
      status: 'online',
      avatar: 'RS'
    },
    {
      id: 2,
      customer: 'Priya Patel',
      lastMessage: 'When will my product be delivered?',
      timestamp: '15 min ago',
      unread: 0,
      status: 'offline',
      avatar: 'PP'
    },
    {
      id: 3,
      customer: 'Amit Kumar',
      lastMessage: 'Thank you for the quick response!',
      timestamp: '1 hour ago',
      unread: 0,
      status: 'online',
      avatar: 'AK'
    },
    {
      id: 4,
      customer: 'Sneha Singh',
      lastMessage: 'I want to return this item',
      timestamp: '2 hours ago',
      unread: 1,
      status: 'offline',
      avatar: 'SS'
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'customer',
      message: 'Hi, I need help with my order #ORD-2024-001',
      timestamp: '10:30 AM',
      status: 'delivered'
    },
    {
      id: 2,
      sender: 'agent',
      message: 'Hello! I\'d be happy to help you with your order. Let me check the status for you.',
      timestamp: '10:32 AM',
      status: 'delivered'
    },
    {
      id: 3,
      sender: 'customer',
      message: 'It shows as shipped but I haven\'t received it yet',
      timestamp: '10:33 AM',
      status: 'delivered'
    },
    {
      id: 4,
      sender: 'agent',
      message: 'I can see your order was shipped yesterday. It should arrive by tomorrow. I\'ll send you the tracking details.',
      timestamp: '10:35 AM',
      status: 'delivered'
    },
    {
      id: 5,
      sender: 'customer',
      message: 'That would be great, thank you!',
      timestamp: '10:36 AM',
      status: 'read'
    },
  ];

  const selectedChatData = chatList.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Chats</h1>
          <p className="text-gray-600">Manage customer support conversations</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Chat List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat === chat.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">{chat.avatar}</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">{chat.customer}</p>
                        <p className="text-xs text-gray-500">{chat.timestamp}</p>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedChatData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">{selectedChatData.avatar}</span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          selectedChatData.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedChatData.customer}</h3>
                        <p className="text-sm text-gray-600 capitalize">{selectedChatData.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        <VideoCall className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        <MoreVert className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'agent'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <div className={`flex items-center justify-end space-x-1 mt-1 ${
                          msg.sender === 'agent' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">{msg.timestamp}</span>
                          {msg.sender === 'agent' && (
                            msg.status === 'delivered' ? 
                              <CheckCircle className="h-3 w-3" /> : 
                              <Circle className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <AttachFile className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <EmojiEmotions className="h-4 w-4" />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="1"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Chat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a chat from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;