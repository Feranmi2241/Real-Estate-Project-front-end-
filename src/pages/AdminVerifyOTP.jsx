import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function AdminVerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/admin/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adminAuth', 'true');
        navigate('/admin');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    }
    setLoading(false);
  };

  if (!email) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className='relative' style={{height: '100vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5800, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920)'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-red-900/30 via-orange-900/30 to-yellow-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 flex items-center justify-center animate-fade-in-up' style={{height: '100vh'}}>
        <div className='bg-black/70 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 w-full max-w-sm sm:max-w-md mx-4 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl animate-scale-in'>
          <h1 className='text-3xl text-center font-semibold mb-7 text-white animate-fade-in-up animation-delay-200'>
            Admin Verification
          </h1>
          <div className='animate-fade-in-up animation-delay-300'>
            <p className='text-center mb-6 text-white/80 leading-relaxed'>
              Enter the verification code sent to <strong className='text-white'>{email}</strong>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="relative group animate-fade-in-up animation-delay-400">
              <input
                type='text'
                placeholder='Enter 6-digit code'
                className='w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            
            <div className="animate-fade-in-up animation-delay-500">
              <button
                disabled={loading}
                className='w-full bg-gradient-to-r from-red-600 to-orange-600 text-white p-3 rounded-lg uppercase hover:from-red-700 hover:to-orange-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95 font-medium'
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>

          <div className='flex justify-center mt-5 animate-fade-in-up animation-delay-600'>
            <button
              onClick={() => navigate('/admin/login')}
              className='text-red-400 hover:text-red-300 hover:underline transition-all duration-300 transform hover:scale-105 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30'
            >
              Back to Login
            </button>
          </div>

          {error && <p className='text-red-400 mt-5 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30 animate-fade-in-up animation-delay-700 transform transition-all duration-500 hover:scale-105'>{error}</p>}
        </div>
      </div>
    </div>
  );
}