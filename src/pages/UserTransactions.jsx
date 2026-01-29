import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function UserTransactions() {
  const { currentUser } = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/transactions/user/${currentUser._id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const downloadReceipt = async (transactionId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/transactions/receipt/${transactionId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${transactionId}.pdf`;
      a.click();
    } catch (error) {
      console.error('Failed to download receipt:', error);
    }
  };

  if (loading) {
    return (
      <div className='relative' style={{height: '93.1vh'}}>
        {/* Background Swiper */}
        <div className='absolute inset-0 z-0 w-full h-full'>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 6500, disableOnInteraction: false }}
            loop={true}
            className='w-full h-full'
          >
            <SwiperSlide>
              <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920)'}}></div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920)'}}></div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920)'}}></div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1448630360428-65456885c650?w=1920)'}}></div>
            </SwiperSlide>
          </Swiper>
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
          <div className='absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30'></div>
        </div>
        
        <div className='relative z-10 flex items-center justify-center' style={{height: '93.1vh'}}>
          <div className='bg-black/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30 animate-fade-in-up'>
            <div className='text-center text-white text-xl'>Loading transactions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative' style={{height: '93.1vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 6500, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
         
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1448630360428-65456885c650?w=1920)'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 p-6 max-w-6xl mx-auto overflow-y-auto' style={{height: '93.1vh'}}>
        <div className='animate-fade-in-up'>
          <h1 className='text-3xl sm:text-4xl font-bold text-white mb-8 text-center bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/30'>Transaction History</h1>
        </div>
        
        {error && (
          <div className='bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-3xl mb-6 backdrop-blur-md animate-fade-in-up animation-delay-200'>
            {error}
          </div>
        )}

        {transactions.length === 0 ? (
          <div className='text-center py-8 animate-fade-in-up animation-delay-200'>
            <div className='bg-black/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30 inline-block'>
              <p className='text-white text-xl'>No transactions found</p>
            </div>
          </div>
        ) : (
          <div className='space-y-6 animate-fade-in-up animation-delay-200'>
            {transactions.map((transaction, index) => (
              <div 
                key={transaction._id} 
                className={`bg-black/70 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-6 transition-all duration-500 hover:scale-105 transform hover:shadow-3xl animate-fade-in-up`}
                style={{animationDelay: `${300 + index * 100}ms`}}
              >
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                  {/* Transaction Details */}
                  <div className='space-y-3'>
                    <h3 className='font-semibold text-lg text-emerald-400 border-b border-emerald-400/30 pb-2'>Transaction Details</h3>
                    <p className='text-white/90'><span className='font-medium text-white'>ID:</span> <span className='text-sm font-mono bg-white/10 px-2 py-1 rounded'>{transaction._id}</span></p>
                    <p className='text-white/90'><span className='font-medium text-white'>Date:</span> {new Date(transaction.createdAt).toLocaleString()}</p>
                    <p className='text-white/90'><span className='font-medium text-white'>Type:</span> <span className='capitalize bg-white/10 px-2 py-1 rounded'>{transaction.type}</span></p>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-white'>Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.status === 'successful' ? 'text-green-400 bg-green-500/20 border border-green-500/30' :
                        transaction.status === 'pending' ? 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30' :
                        transaction.status === 'failed' ? 'text-red-400 bg-red-500/20 border border-red-500/30' :
                        'text-gray-400 bg-gray-500/20 border border-gray-500/30'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className='space-y-3'>
                    <h3 className='font-semibold text-lg text-teal-400 border-b border-teal-400/30 pb-2'>Payment Details</h3>
                    <p className='text-white/90'><span className='font-medium text-white'>Amount:</span> <span className='text-emerald-400 font-bold text-lg'>₦{transaction.convertedAmount?.toLocaleString()}</span></p>
                    {transaction.originalAmount !== transaction.convertedAmount && (
                      <p className='text-white/90'><span className='font-medium text-white'>Original:</span> <span className='text-cyan-400'>${transaction.originalAmount}</span></p>
                    )}
                    <p className='text-white/90'><span className='font-medium text-white'>Currency:</span> <span className='bg-white/10 px-2 py-1 rounded'>{transaction.currency}</span></p>
                    <p className='text-white/90'><span className='font-medium text-white'>Method:</span> <span className='capitalize bg-white/10 px-2 py-1 rounded'>{transaction.paymentMethod}</span></p>
                    <p className='text-white/90'><span className='font-medium text-white'>Reference:</span> <span className='text-sm font-mono bg-white/10 px-2 py-1 rounded'>{transaction.reference}</span></p>
                  </div>

                  {/* Property Information */}
                  <div className='space-y-3'>
                    <h3 className='font-semibold text-lg text-cyan-400 border-b border-cyan-400/30 pb-2'>Property Details</h3>
                    <p className='text-white/90'><span className='font-medium text-white'>Name:</span> <span className='text-cyan-300'>{transaction.listingId?.name || 'N/A'}</span></p>
                    <p className='text-white/90'><span className='font-medium text-white'>Address:</span> {transaction.listingId?.address || 'N/A'}</p>
                    <p className='text-white/90'><span className='font-medium text-white'>Type:</span> <span className='capitalize bg-white/10 px-2 py-1 rounded'>{transaction.listingId?.type || 'N/A'}</span></p>
                    <p className='text-white/90'><span className='font-medium text-white'>User:</span> <span className='text-emerald-300'>{transaction.userId?.username || currentUser.username}</span></p>
                  </div>
                </div>

                {/* Actions */}
                <div className='mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                  <div className='text-sm'>
                    {transaction.adminVerified && (
                      <span className='text-green-400 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30'>✓ Admin Verified</span>
                    )}
                  </div>
                  <button
                    onClick={() => downloadReceipt(transaction._id)}
                    className='bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-medium'
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}