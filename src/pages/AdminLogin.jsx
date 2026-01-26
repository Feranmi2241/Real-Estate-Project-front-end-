import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adminAuth', 'true');
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your admin email first');
      return;
    }

    setForgotLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();

      if (data.success) {
        navigate('/admin/verify-otp', { state: { email: formData.email } });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to send verification code');
    }
    setForgotLoading(false);
  };

  return (
    <div className='relative' style={{height: '100vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
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
        <div className='absolute inset-0 bg-gradient-to-r from-red-900/30 via-orange-900/30 to-yellow-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 flex items-center justify-center animate-fade-in-up' style={{height: '93.1vh'}}>
        <div className='bg-black/70 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 w-full max-w-sm sm:max-w-md mx-4 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl animate-scale-in'>
          <h1 className='text-3xl text-center font-semibold mb-7 text-white animate-fade-in-up animation-delay-200'>Admin Login</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="relative group animate-fade-in-up animation-delay-300">
              <input
                type='email'
                placeholder='Admin Email'
                className='w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl'
                id='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            <div className="relative group animate-fade-in-up animation-delay-400">
              <input
                type='password'
                placeholder='Admin Password'
                className='w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl'
                id='password'
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            <div className="animate-fade-in-up animation-delay-500">
              <button
                disabled={loading}
                className='w-full bg-gradient-to-r from-red-600 to-orange-600 text-white p-3 rounded-lg uppercase hover:from-red-700 hover:to-orange-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95 font-medium'
              >
                {loading ? 'Signing In...' : 'Admin Sign In'}
              </button>
            </div>
          </form>

          <div className='flex justify-center mt-5 animate-fade-in-up animation-delay-600'>
            <button
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              className='text-red-400 hover:text-red-300 hover:underline disabled:opacity-50 transition-all duration-300 transform hover:scale-105 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30'
            >
              {forgotLoading ? 'Sending...' : 'Forgot Password?'}
            </button>
          </div>

          {error && <p className='text-red-400 mt-5 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30 animate-fade-in-up animation-delay-700 transform transition-all duration-500 hover:scale-105'>{error}</p>}
        </div>
      </div>
    </div>
  );
}