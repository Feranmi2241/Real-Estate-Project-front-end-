import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import '../styles/animations.css';
import ListingItem from '../components/ListingItem';
import { getImageUrl } from '../utils/imageUtils.js';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Autoplay]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className='relative overflow-hidden min-h-screen flex items-center px-4 sm:px-6 lg:px-8'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse'></div>
        <div className='flex flex-col gap-6 sm:gap-8 max-w-6xl mx-auto relative z-10 w-full'>
          <div className='animate-fade-in-up text-center sm:text-left'>
            <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl leading-tight animate-gradient-x transition-all duration-700 hover:scale-105 transform'>
              Find Your Dream Home
            </h1>
            <div className='h-1 w-24 xs:w-32 sm:w-40 md:w-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 sm:mt-6 animate-scale-in transition-all duration-500 hover:w-32 xs:hover:w-40 sm:hover:w-52 mx-auto sm:mx-0'></div>
          </div>
          <div className='text-slate-600 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-full sm:max-w-2xl lg:max-w-4xl leading-relaxed animate-fade-in-up animation-delay-200 transition-all duration-500 hover:text-slate-700 text-center sm:text-left'>
            <span className='font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-800'>Positive Mind Estate</span> is the best place to find your next perfect place to live.
            <br className='hidden sm:block' />
            We have a wide range of properties for you to choose from.
          </div>
          <div className='animate-fade-in-up animation-delay-400 flex justify-center sm:justify-start'>
            <Link
              to={'/search'}
              className='group inline-flex items-center gap-2 sm:gap-3 px-6 xs:px-8 sm:px-10 md:px-12 py-3 xs:py-4 sm:py-5 md:py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm xs:text-base sm:text-lg md:text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-fit'
            >
              <span>Let's get started</span>
              <svg className='w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Properties Carousel */}
      <div className='relative -mt-[120px] xs:-mt-[140px] sm:-mt-[160px] md:-mt-[190px] z-20 animate-fade-in-up px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='relative backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden h-[250px] xs:h-[300px] sm:h-[350px] md:h-[400px] transition-all duration-500 hover:scale-105 hover:shadow-2xl' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 0 50px rgba(255, 255, 255, 0.8), 0 0 100px rgba(255, 255, 255, 0.6), 0 0 150px rgba(255, 255, 255, 0.4)', transition: 'all 0.5s ease-in-out'}}>
            <Swiper navigation className='featured-swiper h-full'>
              {offerListings &&
                offerListings.length > 0 &&
                offerListings.map((listing) => (
                  <SwiperSlide key={listing._id}>
                    <div className='relative group h-full'>
                      <div
                        style={{
                          background: `url(${getImageUrl(listing.imageUrls[0])}) center no-repeat`,
                          backgroundSize: 'cover',
                        }}
                        className='h-full transition-transform duration-700 group-hover:scale-105'
                      ></div>
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                      <div className='absolute bottom-3 xs:bottom-4 sm:bottom-6 left-3 xs:left-4 sm:left-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100'>
                        <h3 className='text-base xs:text-lg sm:text-xl font-bold mb-1 sm:mb-2'>Featured Property</h3>
                        <p className='text-xs xs:text-sm text-white/90'>Discover amazing deals</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Property Sections */}
      <div className='relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-10 space-y-0'>
          {offerListings && offerListings.length > 0 && (
            <div 
              className='animate-fade-in-up mb-2 rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 cursor-pointer'
              style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #e9d5ff 50%, #fce7f3 100%)',
                border: '1px solid rgba(147, 197, 253, 0.3)',
                boxShadow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.5), 0 20px 60px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(255, 255, 255, 1), 0 0 120px rgba(255, 255, 255, 0.7), 0 30px 80px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.5), 0 20px 60px rgba(0, 0, 0, 0.15)';
              }}
            >
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6'>
                <div className='text-center sm:text-left'>
                  <h2 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-slate-800 mb-2 sm:mb-3'>Recent Offers</h2>
                  <div className='h-1 w-16 xs:w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto sm:mx-0'></div>
                </div>
                <Link 
                  className='group mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 xs:px-6 py-2 xs:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm xs:text-base font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 self-center sm:self-auto' 
                  to={'/search?offer=true'}
                >
                  <span>Show more offers</span>
                  <svg className='w-3 h-3 xs:w-4 xs:h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                  </svg>
                </Link>
              </div>
              <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                {offerListings.map((listing, index) => (
                  <div key={listing._id} className='animate-fade-in-up transition-all duration-500 hover:scale-105 hover:-translate-y-2' style={{animationDelay: `${index * 100}ms`}}>
                    <ListingItem listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {(rentListings && rentListings.length > 0) || (saleListings && saleListings.length > 0) ? (
          <div className='relative overflow-hidden min-h-screen'>
            {/* Background Swiper */}
            <div className='absolute inset-0 z-0 w-full h-full'>
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className='w-full h-full'
              >
                <SwiperSlide>
                  <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200) center/cover no-repeat'}}></div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200) center/cover no-repeat'}}></div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1200) center/cover no-repeat'}}></div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200) center/cover no-repeat'}}></div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200) center/cover no-repeat'}}></div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200) center/cover no-repeat'}}></div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200) center/cover no-repeat'}}></div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className='w-full h-full' style={{background: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200) center/cover no-repeat'}}></div>
                </SwiperSlide>
              </Swiper>
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent'></div>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20'></div>
            </div>
            
            {/* Content Layer */}
            <div className='relative z-10 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10'>
              {rentListings && rentListings.length > 0 && (
                <div className='animate-fade-in-up'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12'>
                    <div className='text-center sm:text-left'>
                      <h2 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg'>Places for Rent</h2>
                      <div className='h-1 w-16 xs:w-20 bg-gradient-to-r from-green-400 to-teal-400 rounded-full shadow-lg shadow-green-400/50 mx-auto sm:mx-0'></div>
                    </div>
                    <Link 
                      className='group mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 xs:px-6 py-2 xs:py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm xs:text-base font-medium rounded-full hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20 self-center sm:self-auto' 
                      to={'/search?type=rent'}
                    >
                      <span>Show more rentals</span>
                      <svg className='w-3 h-3 xs:w-4 xs:h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                      </svg>
                    </Link>
                  </div>
                  <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                    {rentListings.map((listing, index) => (
                      <div key={listing._id} className='animate-fade-in-up transition-all duration-500 hover:scale-105 hover:-translate-y-2' style={{animationDelay: `${index * 100}ms`}}>
                        <ListingItem listing={listing} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {saleListings && saleListings.length > 0 && (
                <div className='animate-fade-in-up'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12'>
                    <div className='text-center sm:text-left'>
                      <h2 className='text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg'>Places for Sale</h2>
                      <div className='h-1 w-16 xs:w-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-400/50 mx-auto sm:mx-0'></div>
                    </div>
                    <Link 
                      className='group mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 xs:px-6 py-2 xs:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm xs:text-base font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20 self-center sm:self-auto' 
                      to={'/search?type=sale'}
                    >
                      <span>Show more sales</span>
                      <svg className='w-3 h-3 xs:w-4 xs:h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                      </svg>
                    </Link>
                  </div>                                                                                                                                                                                          
                  <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                    {saleListings.map((listing, index) => (
                      <div key={listing._id} className='animate-fade-in-up transition-all duration-500 hover:scale-105 hover:-translate-y-2' style={{animationDelay: `${index * 100}ms`}}>
                        <ListingItem listing={listing} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}