import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function VerifyResetCode() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email;

  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiUrl}/api/forgot-password/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();

      if (data.success) {
        // Get user data and sign them in
        const userRes = await fetch(`${apiUrl}/api/user/public/${data.userId}`);
        const userData = await userRes.json();
        
        dispatch(signInSuccess(userData));
        navigate('/');
      } else {
        setError(data.message || 'Invalid or expired code');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiUrl}/api/forgot-password/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (data.success) {
        showNotification('New verification code sent to your email!', 'success');
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    }
    setResendLoading(false);
  };

  return (
    <div className='relative' style={{height: '93.1vh'}}>
      {/* Neon Gradient Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-500 ease-in-out ${
          notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className={`relative p-4 rounded-lg shadow-2xl backdrop-blur-sm border ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-400/90 via-emerald-500/90 to-teal-600/90 border-green-300/50 shadow-green-500/25' 
              : 'bg-gradient-to-r from-red-400/90 via-pink-500/90 to-rose-600/90 border-red-300/50 shadow-red-500/25'
          } animate-pulse`}>
            <div className={`absolute inset-0 rounded-lg blur-sm ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600' 
                : 'bg-gradient-to-r from-red-400 via-pink-500 to-rose-600'
            } opacity-75`}></div>
            <div className="relative flex items-center justify-between">
              <p className="text-white font-medium text-sm pr-8 leading-relaxed">
                {notification.message}
              </p>
              <button
                onClick={() => setNotification({ show: false, message: '', type: '' })}
                className="absolute top-0 right-0 text-white/80 hover:text-white transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920)'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-orange-900/30 via-yellow-900/30 to-red-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 flex items-center justify-center animate-fade-in-up' style={{height: '93.1vh'}}>
        <div className='bg-black/70 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 w-full max-w-sm sm:max-w-md mx-4 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl animate-scale-in'>
          <h1 className='text-3xl text-center font-semibold mb-7 text-white animate-fade-in-up animation-delay-200'>Enter Verification Code</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='animate-fade-in-up animation-delay-300'>
              <p className='text-white/80 text-center mb-4 leading-relaxed'>
                We've sent a 6-digit verification code to <strong className='text-white'>{email}</strong>
              </p>
            </div>
            
            <div className="relative group animate-fade-in-up animation-delay-400">
              <input
                type='text'
                placeholder='Enter 6-digit code'
                className='w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl'
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            
            <div className="animate-fade-in-up animation-delay-500">
              <button
                disabled={loading}
                className='w-full bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 rounded-lg uppercase hover:from-orange-700 hover:to-red-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95'
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>

            <div className="animate-fade-in-up animation-delay-600">
              <button
                type='button'
                onClick={handleResendCode}
                disabled={resendLoading}
                className='w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-3 rounded-lg uppercase hover:from-yellow-700 hover:to-orange-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95'
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Code'}
              </button>
            </div>
          </form>

          {error && <p className='text-red-400 mt-5 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30 animate-fade-in-up animation-delay-700 transform transition-all duration-500 hover:scale-105'>{error}</p>}

          <div className='flex gap-2 mt-5 justify-center text-white animate-fade-in-up animation-delay-800'>
            <p className="transition-all duration-300 hover:text-white/80">Remember your password?</p>
            <Link to='/sign-in'>
              <span className='text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300 transform hover:scale-105'>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}