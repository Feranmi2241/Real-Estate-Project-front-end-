import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function AdminChatHistory() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat/admin/all');
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
    navigate(`/admin/chat/${chatId}`);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className='relative' style={{height: '100vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 6200, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920)'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-red-900/30 via-orange-900/30 to-yellow-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 p-6 max-w-6xl mx-auto overflow-y-auto' style={{height: '93.1vh'}}>
        <div className='animate-fade-in-up'>
          <h1 className='text-3xl sm:text-4xl font-bold text-white mb-8 text-center bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/30'>Admin Chat History</h1>
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
              <p className='text-xl text-white'>No chats found</p>
            </div>
          </div>
        ) : (
          <div className='space-y-6 animate-fade-in-up animation-delay-200'>
            {chats.map((chat, index) => (
              <div 
                key={chat._id}
                onClick={() => openChat(chat._id)}
                className={`bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl cursor-pointer border-l-4 border-red-500 transition-all duration-500 hover:scale-105 transform animate-fade-in-up`}
                style={{animationDelay: `${300 + index * 100}ms`}}
              >
                <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6'>
                  <img 
                    src={chat.listingId?.imageUrls?.[0] || 'https://via.placeholder.com/150'} 
                    alt={chat.listingId?.name || 'Listing'}
                    className='w-full sm:w-20 h-48 sm:h-20 object-cover rounded-2xl shadow-lg'
                  />
                  <div className='flex-1 w-full'>
                    <div className='flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0'>
                      <div className='flex-1'>
                        <h3 className='font-semibold text-lg sm:text-xl text-red-400 hover:text-red-300 transition-colors duration-300'>{chat.userId?.username || 'Unknown User'}</h3>
                        <p className='text-white/70 text-sm sm:text-base mt-1'>{chat.userId?.email || 'No email'}</p>
                        <p className='text-orange-400 text-sm sm:text-base font-medium mt-1'>{chat.listingId?.name || 'Unknown Listing'}</p>
                      </div>
                      <div className='text-left sm:text-right'>
                        <p className='text-xs sm:text-sm text-white/60 mb-2'>{formatTime(chat.lastMessageTime)}</p>
                        <p className='text-yellow-400 font-semibold text-lg'>₦{chat.listingId?.regularPrice?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                    <p className='text-white/80 text-sm sm:text-base mt-4 line-clamp-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm'>{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}