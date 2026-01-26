import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch,  useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

const SignIn = () => {

  const [formData, setFormData] = useState({});  
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      console.log(data);

      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || 'Sign in failed'));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
      
    } catch (error) {
      dispatch(signInFailure(error.message));
    }

  };

  return (
    <div className='relative' style={{height: '93.1vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920)'}}></div>
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
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 flex items-center justify-center animate-fade-in-up' style={{height: '93.1vh'}}>
        <div className='bg-black/70 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 w-full max-w-sm sm:max-w-md mx-4 transform transition-all duration-700 hover:scale-105 hover:shadow-3xl animate-scale-in'>
          <h1 className="text-3xl text-center font-semibold mb-7 text-white animate-fade-in-up animation-delay-200">Sign In</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative group animate-fade-in-up animation-delay-300">
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl"
                id="email"
                onChange={handleChange}
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            <div className="relative group animate-fade-in-up animation-delay-400">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl"
                id="password"
                onChange={handleChange}        
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            <div className="animate-fade-in-up animation-delay-500">
              <button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg uppercase hover:from-blue-700 hover:to-purple-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95">
                {loading ? "Loading..." : "Sign In"}
              </button>
            </div>
            <div className="animate-fade-in-up animation-delay-600">
              <OAuth />
            </div>
          </form>

          <div className="flex gap-2 mt-5 justify-between text-white animate-fade-in-up animation-delay-700">
            <div className="flex gap-2">
              <p className="transition-all duration-300 hover:text-white/80">Dont have an account?</p>
              <Link to={"/sign-up"}>
              <span className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300 transform hover:scale-105">Sign Up</span>
              </Link>
            </div>
            <Link to={"/forgot-password"}>
              <span className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300 transform hover:scale-105">Forgot Password?</span>
            </Link>
          </div>
          {error && <p className="text-red-400 mt-4 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30 animate-fade-in-up animation-delay-800 transform transition-all duration-500 hover:scale-105">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignIn;