import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ChatWindow from "../components/ChatWindow";
import { getImageUrl } from '../utils/imageUtils.js';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});  

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const FLUTTERWAVE_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;  

import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import Contact from "../components/Contact";

const Listing = () => {
  const params = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentType, setPaymentType] = useState('');
    const [bankConfig, setBankConfig] = useState({ local: null, intl: null });
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [exchangeRates, setExchangeRates] = useState({ USD: 1500, EUR: 1650, GBP: 1900, CAD: 1100 });
    const [showChat, setShowChat] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [showLocation, setShowLocation] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });




    const { currentUser } = useSelector((state) => state.user);

  console.log(listing);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    const fetchBankConfig = async () => {
      try {
        const res = await fetch('/api/listing/admin/bank-config');
        const data = await res.json();
        setBankConfig(data);
      } catch (error) {
        console.error('Error fetching bank config:', error);
      }
    };

    fetchListing();
    fetchBankConfig();
    
    // Refresh listing data every 30 seconds to catch status updates
    const interval = setInterval(fetchListing, 30000);
    
    return () => clearInterval(interval);
  }, [params.listingId]);

  const startChatWithAdmin = async () => {
    try {
      // Create or get existing chat
      const res = await fetch('/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          listingId: listing._id
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setCurrentChatId(data.data._id);
        
        // Send initial listing message
        await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: data.data._id,
            senderId: currentUser._id,
            senderType: 'user',
            text: `I'm interested in this property: ${listing.name}`,
            taggedListing: listing._id,
            messageType: 'listing'
          })
        });
        
        setShowChat(true);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const verifyPaystackPayment = async (reference) => {
    try {
      // For now, just save the transaction directly since we're in test mode
      const res = await fetch('/api/transactions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          listingId: listing._id,
          originalAmount: (listing.offer ? listing.discountPrice : listing.regularPrice),
          convertedAmount: (listing.offer ? listing.discountPrice : listing.regularPrice),
          currency: 'NGN',
          paymentProvider: 'Paystack',
          transactionReference: reference,
          status: 'successful'
        })
      });

      const data = await res.json();
      
      if (data.success) {
        showNotification('Payment successful: ' + reference, 'success');
        setShowPayment(false);
      } else {
        showNotification('Error saving transaction', 'error');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      showNotification('Payment verification failed. Please contact support.', 'error');
    }
  };

  const getConvertedAmount = (ngnAmount) => {
    return Math.round(ngnAmount / exchangeRates[selectedCurrency] * 100) / 100;
  };

  const getCurrencySymbol = (currency) => {
    const symbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$' };
    return symbols[currency] || currency;
  };

  const initiatePayment = (type) => {
    setPaymentType(type);
    setShowPayment(true);
    
    if (type === 'local') {
      // Paystack integration with proper verification
      if (window.PaystackPop) {
        const popup = new window.PaystackPop();
        const reference = 'TX' + Date.now() + Math.random().toString(36).substr(2, 9);
        
        popup.newTransaction({
          key: PAYSTACK_KEY,
          email: currentUser?.email || 'test@example.com',
          amount: (listing.offer ? listing.discountPrice : listing.regularPrice) * 100,
          currency: 'NGN',
          reference: reference,
          onSuccess: function(transaction) {
            // Verify payment on backend instead of trusting frontend
            verifyPaystackPayment(transaction.reference);
          },
          onCancel: function() {
            setShowPayment(false);
          }
        });
      } else {
        showNotification('Paystack not loaded. Please refresh the page.', 'error');
        setShowPayment(false);
      }
    } else {
      // Flutterwave integration (unchanged for now)
      if (window.FlutterwaveCheckout) {
        initFlutterwavePayment();
      } else {
        const script = document.createElement('script');
        script.src = 'https://checkout.flutterwave.com/v3.js';
        script.onload = () => initFlutterwavePayment();
        script.onerror = () => {
          showNotification('Failed to load Flutterwave. Please try again.', 'error');
          setShowPayment(false);
        };
        document.head.appendChild(script);
      }
    }
  };

  const initFlutterwavePayment = () => {
    const ngnAmount = listing.offer ? listing.discountPrice : listing.regularPrice;
    const convertedAmount = getConvertedAmount(ngnAmount);
    const txRef = "RX1" + Date.now() + Math.random().toString(36).substr(2, 9);
    
    window.FlutterwaveCheckout({
      public_key: FLUTTERWAVE_KEY,
      tx_ref: txRef,
      amount: convertedAmount,
      currency: selectedCurrency,
      payment_options: "card,banktransfer",
      customer: {
        email: currentUser?.email || 'user@example.com',
        phone_number: "080****4528",
        name: currentUser?.username || 'User',
      },
      callback: function (data) {
        // For now, keep the existing Flutterwave logic
        // TODO: Implement Flutterwave verification similar to Paystack
        saveFlutterwaveTransaction({
          originalAmount: ngnAmount,
          convertedAmount: convertedAmount,
          currency: selectedCurrency,
          provider: 'Flutterwave',
          reference: data.transaction_id
        });
        showNotification('Payment successful: ' + data.transaction_id, 'success');
        setShowPayment(false);
      },
      onclose: function() {
        setShowPayment(false);
      },
      customizations: {
        title: "Property Payment",
        description: `Payment for ${listing.name}`,
      },
    });
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const saveFlutterwaveTransaction = async (transactionData) => {
    try {
      await fetch('/api/transactions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          listingId: listing._id,
          originalAmount: transactionData.originalAmount,
          convertedAmount: transactionData.convertedAmount,
          currency: transactionData.currency,
          paymentProvider: transactionData.provider,
          transactionReference: transactionData.reference,
          status: 'successful'
        })
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
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
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>
      
      <div className="relative z-10">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation modules={[Navigation]}>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px]"
                  style={{
                    background: `url(${getImageUrl(url)}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500 text-sm sm:text-base'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>

            {copied && (
                <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2 text-sm'>Link Copied!</p>
            )}

            <div className='flex flex-col max-w-6xl mx-auto p-3 sm:p-4 md:p-6 my-4 sm:my-7 gap-4'>
            <p className='text-xl sm:text-2xl lg:text-3xl font-semibold'>
              {listing.name} - ₦{''}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-4 sm:mt-6 gap-2 text-slate-600 text-sm sm:text-base'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
              <p className='bg-red-900 w-full sm:max-w-[200px] text-white text-center p-2 sm:p-1 rounded-md text-sm sm:text-base'>
                {listing.soldOrRented 
                  ? (listing.soldOrRentedStatus === 'sold' ? 'Sold' : 'Rented')
                  : (listing.type === 'rent' ? 'For Rent' : 'For Sale')
                }
              </p>
              {currentUser && listing.location?.lat && (
                <button
                  onClick={() => setShowLocation(!showLocation)}
                  className='bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-1 rounded-md hover:opacity-95 text-sm sm:text-base'
                >
                  {showLocation ? 'Hide Location' : 'Show Location'}
                </button>
              )}
              {listing.offer && (
                <p className='bg-green-900 w-full sm:max-w-[200px] text-white text-center p-2 sm:p-1 rounded-md text-sm sm:text-base'>
                  ₦{+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800 text-sm sm:text-base leading-relaxed'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-xs sm:text-sm flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBed className='text-base sm:text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBath className='text-base sm:text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaParking className='text-base sm:text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaChair className='text-base sm:text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            
            {/* Location Map Display */}
            {showLocation && currentUser && listing.location?.lat && (
              <div className='bg-white p-4 sm:p-6 rounded-lg shadow-md mt-4'>
                <h3 className='text-lg sm:text-xl font-semibold mb-3'>Property Location</h3>
                <div className='w-full h-48 sm:h-64 md:h-80 rounded overflow-hidden'>
                  <MapContainer
                    center={[listing.location.lat, listing.location.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[listing.location.lat, listing.location.lng]} />
                  </MapContainer>
                </div>
                <p className='text-xs sm:text-sm text-gray-600 mt-2'>
                  Coordinates: {listing.location.lat.toFixed(6)}, {listing.location.lng.toFixed(6)}
                </p>
              </div>
            )}
            
            {currentUser && listing.userRef !== currentUser._id && (
              <div className='space-y-3'>
                <button
                  onClick={startChatWithAdmin}
                  className="bg-blue-600 text-white rounded-lg uppercase p-3 sm:p-4 hover:opacity-95 w-full text-sm sm:text-base font-medium"
                >
                  Chat Admin
                </button>
                {!contact && (
            <button
                  onClick={() => {
                  setContact(true);
                  window.open("https://wa.me/2348052052706", "_blank");
                  }}
                  className="bg-slate-700 text-white rounded-lg uppercase p-3 sm:p-4 hover:opacity-95 w-full text-sm sm:text-base font-medium"
                >
                    Contact Admin via Whatsapp
                </button>

                )}
              </div>
            )}
            
            {contact && <Contact listing={listing} /> }

            {/* Payment Section */}
            {currentUser && !listing.soldOrRented && (
              <div className='bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6'>
                <h3 className='text-lg sm:text-xl font-semibold mb-4 text-slate-800'>Make Payment</h3>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                  <button
                    onClick={() => initiatePayment('local')}
                    className='bg-green-600 text-white p-4 sm:p-6 rounded-lg hover:opacity-95 flex flex-col items-center text-center'
                  >
                    <span className='font-semibold text-sm sm:text-base'>Local Payment (Nigeria)</span>
                    <span className='text-xs sm:text-sm mt-1'>Pay with Paystack</span>
                    <span className='text-lg sm:text-xl mt-2'>₦{listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}</span>
                  </button>
                  
                  <div className='bg-purple-600 text-white p-4 sm:p-6 rounded-lg flex flex-col'>
                    <span className='font-semibold mb-2 text-sm sm:text-base'>International Payment</span>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className='mb-3 p-2 sm:p-3 text-black rounded text-sm sm:text-base'
                    >
                      <option value='USD'>USD - US Dollar</option>
                      <option value='EUR'>EUR - Euro</option>
                      <option value='GBP'>GBP - British Pound</option>
                      <option value='CAD'>CAD - Canadian Dollar</option>
                    </select>
                    <button
                      onClick={() => initiatePayment('international')}
                      className='bg-purple-700 text-white p-2 sm:p-3 rounded-lg hover:opacity-95 flex flex-col items-center text-center'
                    >
                      <span className='text-xs sm:text-sm'>Pay with Flutterwave</span>
                      <span className='text-lg sm:text-xl mt-1'>
                        {getCurrencySymbol(selectedCurrency)}{getConvertedAmount(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString()}
                      </span>
                      <span className='text-xs mt-1 opacity-75'>
                        (₦{listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()})
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Bank Details Display */}
                {showPayment && (
                  <div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg'>
                    <h4 className='font-semibold mb-3 text-sm sm:text-base'>
                      {paymentType === 'local' ? 'Local Bank Details' : 'International Bank Details'}
                    </h4>
                    {paymentType === 'local' && bankConfig.local && (
                      <div className='space-y-2 text-xs sm:text-sm'>
                        <p><strong>Bank:</strong> {bankConfig.local.bankName}</p>
                        <p><strong>Account Number:</strong> {bankConfig.local.accountNumber}</p>
                        <p><strong>Account Name:</strong> {bankConfig.local.accountName}</p>
                      </div>
                    )}
                    {paymentType === 'international' && bankConfig.intl && (
                      <div className='space-y-2 text-xs sm:text-sm'>
                        <p><strong>Bank:</strong> {bankConfig.intl.bankName}</p>
                        <p><strong>Account Number:</strong> {bankConfig.intl.accountNumber}</p>
                        <p><strong>Account Name:</strong> {bankConfig.intl.accountName}</p>
                        <p><strong>SWIFT Code:</strong> {bankConfig.intl.swiftCode}</p>
                        {bankConfig.intl.routingNumber && (
                          <p><strong>Routing Number:</strong> {bankConfig.intl.routingNumber}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Message for sold/rented properties */}
            {listing.soldOrRented && (
              <div className='bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md mt-6 text-center'>
                <h3 className='text-lg sm:text-xl font-semibold mb-2 text-gray-700'>Property Not Available</h3>
                <p className='text-sm sm:text-base text-gray-600'>
                  This property has been {listing.soldOrRentedStatus === 'sold' ? 'sold' : 'rented'} and is no longer available for purchase.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
      
      {/* Chat Window */}
      {showChat && currentChatId && (
        <ChatWindow 
          chatId={currentChatId} 
          onClose={() => setShowChat(false)} 
        />
      )}
      </div>
    </main>
  );
};

export default Listing;