import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Verification code sent to your email!');
        setTimeout(() => {
          navigate('/verify-reset-code', { state: { email } });
        }, 2000);
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className='relative' style={{height: '93.1vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920)'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-green-900/30 via-teal-900/30 to-blue-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 flex items-center justify-center animate-fade-in-up' style={{height: '93.1vh'}}>
        <div className='bg-black/70 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 w-full max-w-sm sm:max-w-md mx-4 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl animate-scale-in'>
          <h1 className='text-3xl text-center font-semibold mb-7 text-white animate-fade-in-up animation-delay-200'>Forgot Password</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='animate-fade-in-up animation-delay-300'>
              <p className='text-white/80 text-center mb-4 leading-relaxed'>
                Enter your email address and we'll send you a verification code to reset your password.
              </p>
            </div>
            
            <div className="relative group animate-fade-in-up animation-delay-400">
              <input
                type='email'
                placeholder='Enter your email address'
                className='w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            
            <div className="animate-fade-in-up animation-delay-500">
              <button
                disabled={loading}
                className='w-full bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 rounded-lg uppercase hover:from-green-700 hover:to-teal-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95'
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          </form>

          {message && <p className='text-green-400 mt-5 text-center bg-green-500/20 p-3 rounded-lg border border-green-500/30 animate-fade-in-up animation-delay-600 transform transition-all duration-500 hover:scale-105'>{message}</p>}
          {error && <p className='text-red-400 mt-5 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30 animate-fade-in-up animation-delay-600 transform transition-all duration-500 hover:scale-105'>{error}</p>}

          <div className='flex gap-2 mt-5 justify-center text-white animate-fade-in-up animation-delay-700'>
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