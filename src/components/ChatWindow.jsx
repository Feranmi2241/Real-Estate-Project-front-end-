import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ChatWindow({ chatId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiUrl}/api/chat/messages/${chatId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiUrl}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          senderId: currentUser._id,
          senderType: currentUser.isAdmin ? 'admin' : 'user',
          text: newMessage,
          messageType: 'text'
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleListingClick = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up'>
      <div className='bg-black/70 backdrop-blur-md w-full max-w-4xl h-full max-h-[90vh] md:h-[80vh] flex flex-col rounded-3xl shadow-2xl border border-white/30 animate-scale-in'>
        {/* Header */}
        <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 md:p-6 rounded-t-3xl flex justify-between items-center shadow-lg'>
          <h3 className='font-semibold text-lg md:text-xl'>Chat with Admin</h3>
          <button onClick={onClose} className='text-white hover:text-white/70 text-xl md:text-2xl transition-all duration-300 hover:scale-110 transform bg-white/20 rounded-full w-8 h-8 flex items-center justify-center'>✕</button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-4'>
          {Object.entries(messageGroups).map(([date, dayMessages]) => (
            <div key={date}>
              <div className='text-center text-xs md:text-sm text-white/70 mb-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 inline-block border border-white/20'>{date}</div>
              {dayMessages.map((message) => (
                <div key={message._id} className={`flex ${message.senderType === 'admin' ? 'justify-start' : 'justify-end'} mb-3 md:mb-4`}>
                  <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 transform ${
                    message.senderType === 'admin' 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-400/50'
                  }`}>
                    {message.messageType === 'listing' && message.taggedListing && (
                      <div 
                        className='border border-white/30 rounded-lg p-3 mb-3 cursor-pointer hover:bg-white/10 transition-all duration-300 backdrop-blur-sm'
                        onClick={() => handleListingClick(message.taggedListing._id)}
                      >
                        <img 
                          src={message.taggedListing.imageUrls[0]} 
                          alt={message.taggedListing.name}
                          className='w-full h-32 md:h-40 object-cover rounded-lg mb-2 shadow-md'
                        />
                        <p className='text-sm md:text-base font-semibold text-white'>{message.taggedListing.name}</p>
                        <p className='text-xs md:text-sm text-white/80'>₦{message.taggedListing.regularPrice.toLocaleString()}</p>
                      </div>
                    )}
                    <p className='text-sm md:text-base leading-relaxed'>{message.text}</p>
                    <p className='text-xs opacity-75 mt-2'>{formatTime(message.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className='p-4 md:p-6 border-t border-white/20 bg-black/50 backdrop-blur-md rounded-b-3xl'>
          <div className='flex gap-3'>
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder='Type a message...'
              className='flex-1 p-3 md:p-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-300 hover:bg-white/20 focus:bg-white/20 text-sm md:text-base'
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 font-medium text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}