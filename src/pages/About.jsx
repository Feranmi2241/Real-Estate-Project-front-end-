// Desc: About page
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function About() {
  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1920) center/cover no-repeat'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920) center/cover no-repeat'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920) center/cover no-repeat'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920) center/cover no-repeat'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920) center/cover no-repeat'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 py-20 px-4 max-w-6xl mx-auto'>
        <div className='animate-fade-in-up'>
          <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-8 text-white leading-relaxed transition-all duration-700 hover:scale-105 transform bg-black/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30'>
            Positive Mind Estate is a modern real estate platform built to simplify the process of buying and renting housing properties with transparency, security, and confidence. We are committed to helping individuals and families make informed property decisions by providing access to verified listings, clear pricing with locations and a seamless digital experience designed for today's fast-paced world.
          </h1>
        </div>
        
        <div className='animate-fade-in-up animation-delay-200'>
          <p className='mb-6 text-base sm:text-lg md:text-xl font-medium text-white leading-relaxed transition-all duration-500 bg-black/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30'>
            At Positive Mind Estate, we believe that finding a home should be stress-free and trustworthy. Our platform connects property seekers with carefully listed homes while ensuring that every transaction is handled with accountability and professionalism. Through secure payment integrations, verified listings, and real-time updates, we eliminate uncertainty and give our users peace of mind throughout their property journey.
          </p>
        </div>
        
        <div className='animate-fade-in-up animation-delay-400'>
          <p className='mb-6 text-base sm:text-lg md:text-xl font-medium text-white leading-relaxed transition-all duration-500 bg-black/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30'>
            Beyond listings, Positive Mind Estate is built on innovation and reliability. We leverage modern technology to ensure data integrity, secure transactions, and efficient property management for our customers. Whether you are searching for a home or renting a property, Positive Mind Estate stands as a dependable partner committed to delivering value and long-term satisfaction.
          </p>
        </div>
      </div>
    </div>
  )
}