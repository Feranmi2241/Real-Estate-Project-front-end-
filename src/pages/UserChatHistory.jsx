import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatWindow from '../components/ChatWindow';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function UserChatHistory() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/chat/user/${currentUser._id}`);
      const data = await res.json();
      if (data.success) {
        setChats(data.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
    setLoading(false);
  };

  const openChat = (chatId) => {
    setCurrentChatId(chatId);
    setShowChat(true);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className='relative' style={{height: '93.1vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920)'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 p-6 max-w-6xl mx-auto'>
        <div className='animate-fade-in-up'>
          <h1 className='text-3xl sm:text-4xl font-bold text-white mb-8 text-center bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/30'>My Chat History</h1>
        </div>
        
        {loading ? (
          <div className='text-center py-8 animate-fade-in-up animation-delay-200'>
            <div className='bg-black/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30 inline-block'>
              <p className='text-xl text-white'>Loading chats...</p>
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className='text-center py-8 animate-fade-in-up animation-delay-200'>
            <div className='bg-black/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30 inline-block'>
              <p className='text-xl text-white mb-2'>No chats found</p>
              <p className='text-white/70'>Start chatting with admin about properties you're interested in!</p>
            </div>
          </div>
        ) : (
          <div className='space-y-6 animate-fade-in-up animation-delay-200'>
            {chats.map((chat, index) => (
              <div 
                key={chat._id}
                onClick={() => openChat(chat._id)}
                className={`bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl cursor-pointer border-l-4 border-indigo-500 transition-all duration-500 hover:scale-105 transform animate-fade-in-up`}
                style={{animationDelay: `${300 + index * 100}ms`}}
              >
                <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6'>
                  <img 
                    src={chat.listingId.imageUrls[0]} 
                    alt={chat.listingId.name}
                    className='w-full sm:w-24 h-48 sm:h-24 object-cover rounded-2xl shadow-lg'
                  />
                  <div className='flex-1 w-full'>
                    <div className='flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0'>
                      <div className='flex-1'>
                        <h3 className='font-semibold text-lg sm:text-xl text-blue-400 hover:text-blue-300 transition-colors duration-300'>{chat.listingId.name}</h3>
                        <p className='text-white/70 text-sm sm:text-base mt-1'>{chat.listingId.address}</p>
                        <p className='text-green-400 font-semibold text-lg mt-2'>₦{chat.listingId.regularPrice.toLocaleString()}</p>
                      </div>
                      <div className='text-left sm:text-right'>
                        <p className='text-xs sm:text-sm text-white/60 mb-2'>{formatTime(chat.lastMessageTime)}</p>
                        <span className='bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full shadow-lg'>
                          Chat with Admin
                        </span>
                      </div>
                    </div>
                    <p className='text-white/80 text-sm sm:text-base mt-4 line-clamp-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm'>{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Window */}
        {showChat && currentChatId && (
          <ChatWindow 
            chatId={currentChatId} 
            onClose={() => setShowChat(false)} 
          />
        )}
      </div>
    </div>
  );
}