import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import OAuth from "../components/OAuth";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

const SignUp = () => {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/signup`;
      const res = await fetch(apiUrl, {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success == false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate("/sign-in");
      
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }

  };

  return (
    <div className='relative' style={{height: '93.1vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920)'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 flex items-center justify-center animate-fade-in-up' style={{height: '93.1vh'}}>
        <div className='bg-black/70 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 w-full max-w-sm sm:max-w-md mx-4 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl animate-scale-in'>
          <h1 className="text-3xl text-center font-semibold mb-7 text-white animate-fade-in-up animation-delay-200">Sign Up</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative group animate-fade-in-up animation-delay-300">
              <input
                type="text"
                placeholder="Username"
                className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl"
                id="username"
                onChange={handleChange}        
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            <div className="relative group animate-fade-in-up animation-delay-400">
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl"
                id="email"
                onChange={handleChange}
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            <div className="relative group animate-fade-in-up animation-delay-500">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl"
                id="password"
                onChange={handleChange}        
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            <div className="animate-fade-in-up animation-delay-600">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg uppercase hover:from-purple-700 hover:to-pink-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95">
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </div>
            <div className="animate-fade-in-up animation-delay-700">
              <OAuth />
            </div>
          </form>

          <div className="flex gap-2 mt-5 text-white animate-fade-in-up animation-delay-800">
            <p className="transition-all duration-300 hover:text-white/80">Have an account?</p>
            <Link to={"/sign-in"}>
            <span className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300 transform hover:scale-105">Sign In</span>
            </Link>
          </div>
          {error && <p className="text-red-400 mt-4 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30 animate-fade-in-up animation-delay-900 transform transition-all duration-500 hover:scale-105">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUp;