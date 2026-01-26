import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminChatDetail() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/messages/${chatId}`);
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
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          senderId: currentUser._id,
          senderType: 'admin',
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
    <div className='p-4 md:p-6 max-w-6xl mx-auto'>
      <div className='bg-white rounded-lg shadow-md h-[85vh] md:h-[80vh] flex flex-col'>
        {/* Header */}
        <div className='bg-green-600 text-white p-4 md:p-6 rounded-t-lg flex justify-between items-center'>
          <h3 className='font-semibold text-lg md:text-xl'>Admin Chat</h3>
          <button 
            onClick={() => navigate('/admin/chat-history')}
            className='text-white hover:opacity-75 text-sm md:text-base'
          >
            ← Back
          </button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50'>
          {Object.entries(messageGroups).map(([date, dayMessages]) => (
            <div key={date}>
              <div className='text-center text-xs md:text-sm text-gray-500 mb-4 bg-white rounded-full px-3 py-1 inline-block'>{date}</div>
              {dayMessages.map((message) => (
                <div key={message._id} className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'} mb-3 md:mb-4`}>
                  <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl shadow-sm ${
                    message.senderType === 'admin' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-black border border-gray-200'
                  }`}>
                    {message.messageType === 'listing' && message.taggedListing && (
                      <div 
                        className='border rounded-lg p-3 mb-3 cursor-pointer hover:bg-opacity-80 transition-all'
                        onClick={() => handleListingClick(message.taggedListing._id)}
                      >
                        <img 
                          src={message.taggedListing.imageUrls[0]} 
                          alt={message.taggedListing.name}
                          className='w-full h-32 md:h-40 object-cover rounded-lg mb-2'
                        />
                        <p className='text-sm md:text-base font-semibold'>{message.taggedListing.name}</p>
                        <p className='text-xs md:text-sm opacity-75'>₦{message.taggedListing.regularPrice.toLocaleString()}</p>
                      </div>
                    )}
                    <p className='text-sm md:text-base leading-relaxed'>{message.text}</p>
                    <p className='text-xs opacity-75 mt-2'>{formatTime(message.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className='p-4 md:p-6 border-t bg-white rounded-b-lg'>
          <div className='flex gap-3'>
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder='Type a message...'
              className='flex-1 p-3 md:p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base'
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className='bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors font-medium text-sm md:text-base'
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}