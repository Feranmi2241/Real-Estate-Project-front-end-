import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';
import { getImageUrl } from '../utils/imageUtils.js';

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showNotificationModal = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // console.log(formData);
  // console.log(userListings);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);
    
    try {
      setUploading(true);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiBaseUrl}/api/user-profile/upload-avatar/${currentUser._id}`, {
        method: 'POST',
        credentials: 'include',
        body: formDataUpload,
      });
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success === false) {
        showNotificationModal('Upload failed: ' + data.message, 'error');
        return;
      }
      
      // Update Redux state with new avatar
      dispatch(updateUserSuccess(data));
      setFormData({ ...formData, avatar: data.avatar });
      setUploading(false);
      showNotificationModal('Profile picture uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
      showNotificationModal('Failed to upload image. Please check if the server is running.', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      
      // Only allow registered users to update profile
      if (!currentUser || !currentUser._id) {
        showNotificationModal('Please sign in to update your profile.', 'error');
        return;
      }

      // Check if we have any data to update
      if (Object.keys(formData).length === 0) {
        showNotificationModal('No changes to update', 'error');
        dispatch(updateUserFailure('No changes to update'));
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/user-profile/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 401) {
        showNotificationModal('Your session has expired. Please sign out and sign in again.', 'error');
        dispatch(updateUserFailure('Session expired'));
        return;
      }

      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data.message || 'Failed to update profile'));
        showNotificationModal(data.message || 'Failed to update profile', 'error');
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      showNotificationModal('Your profile has been successfully updated', 'success');
      
      // Clear form data after successful update
      setFormData({});
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      showNotificationModal('Failed to update profile', 'error');
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/user-profile/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete error:', error);
      dispatch(deleteUserFailure(error.message));
      setShowDeleteConfirm(false);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/signout`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };


  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/user-profile/listings/${currentUser._id}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);

    } catch (error) {
      setShowListingsError(true);
    }
  };


  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: 'include',
        });

        const data = await res.json();
        if (data.success === false) {
          console.log(error.message);
          return; 
        }

        setUserListings((prev) => prev.filter((listing) => (listing._id !== listingId)));



    } catch (error) {
      console.log(error.message);      
    }

  };


  return (
    <div className='relative' style={{height: '93.1vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          loop={true}
          className='w-full h-full'
        >
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920)'}}></div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='w-full h-full bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920)'}}></div>
          </SwiperSlide>
        </Swiper>
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-rose-900/30 via-pink-900/30 to-purple-900/30'></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 p-4 max-w-2xl mx-auto overflow-y-auto' style={{height: '93.1vh'}}>
        <div className='animate-fade-in-up'>
          <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-8 text-white bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/30">Profile</h1>
        </div>
        
        <div className='bg-black/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fade-in-up animation-delay-200'>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <div className='flex flex-col items-center animate-fade-in-up animation-delay-300'>
              <img
                onClick={() => fileRef.current.click()}
                src={getImageUrl(formData.avatar || currentUser.avatar)}
                alt="profile"
                className="rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-white/30 shadow-2xl hover:scale-110 transition-all duration-300 hover:border-rose-400/50"
              />
              <p className="text-sm text-white/80 mt-4 text-center">
                {uploading ? (
                  <span className="text-rose-400 animate-pulse">Uploading...</span>
                ) : (
                  "Click to upload image"
                )}
              </p>
            </div>

            <div className="relative group animate-fade-in-up animation-delay-400">
              <input
                type="text"
                placeholder="Username"
                id="username"
                defaultValue={currentUser.username}
                onChange={handleChange}
                className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <div className="relative group animate-fade-in-up animation-delay-500">
              <input
                type="email"
                placeholder="Email"
                id="email"
                defaultValue={currentUser.email}
                onChange={handleChange}
                className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <div className="relative group animate-fade-in-up animation-delay-600">
              <input
                type="password"
                placeholder="New Password"
                onChange={handleChange}
                id="password"
                className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <div className="animate-fade-in-up animation-delay-700">
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white p-4 rounded-lg uppercase font-medium hover:from-rose-700 hover:to-pink-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95"
              >
                {loading ? "Loading..." : "Update Profile"}
              </button>
            </div>
          </form>
          
          <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4 animate-fade-in-up animation-delay-800">
            <span
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-400 hover:text-red-300 cursor-pointer transition-all duration-300 hover:scale-105 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30 text-center"
            >
              Delete account
            </span>
            <span 
              onClick={handleSignOut} 
              className="text-red-400 hover:text-red-300 cursor-pointer transition-all duration-300 hover:scale-105 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30 text-center"
            >
              Sign out
            </span>
          </div>

          {error && <p className="text-red-400 mt-5 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30 animate-fade-in-up">{error}</p>}
          {updateSuccess && <p className="text-green-400 mt-5 text-center bg-green-500/20 p-3 rounded-lg border border-green-500/30 animate-fade-in-up">Profile updated successfully!</p>}
        </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-black/70 backdrop-blur-md rounded-3xl p-6 max-w-sm mx-4 shadow-2xl border border-white/30 animate-scale-in">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Delete Account</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteUser}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-black/70 backdrop-blur-md rounded-3xl p-6 max-w-sm mx-4 shadow-2xl border border-white/30 animate-scale-in">
            <div className="flex items-center">
              {notificationType === 'success' ? (
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  notificationType === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {notificationMessage}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setShowNotification(false)}
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

        {/* User Listings Section */}
        {userListings && userListings.length > 0 && (
          <div className="mt-8 bg-black/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fade-in-up animation-delay-900">
            <h2 className="text-center text-2xl sm:text-3xl font-semibold text-white mb-6">Your Listings</h2>
            <div className="space-y-4">
              {userListings.map((listing, index) => (
                <div 
                  key={listing._id}
                  className={`bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-500 hover:scale-105 transform hover:shadow-xl animate-fade-in-up`}
                  style={{animationDelay: `${1000 + index * 100}ms`}}
                >
                  <Link to={`/listing/${listing._id}`} className="flex-shrink-0">
                    <img 
                      src={getImageUrl(listing.imageUrls[0])}
                      alt="listing cover"
                      className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-xl shadow-lg hover:scale-110 transition-transform duration-300"  
                    />                
                  </Link>
                  <Link
                    className='text-white font-semibold hover:text-rose-300 hover:underline truncate flex-1 transition-colors duration-300'
                    to={`/listing/${listing._id}`}
                  >
                    <p className='text-sm sm:text-base'>{listing.name}</p>
                  </Link>

                  <div className='flex flex-row sm:flex-col gap-2 sm:gap-1'>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='text-red-400 hover:text-red-300 uppercase text-sm bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/30 transition-all duration-300 hover:scale-105'
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-400 hover:text-green-300 uppercase text-sm bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/30 transition-all duration-300 hover:scale-105'>
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleShowListings} className="hidden">
          {/* Hidden show listings button */}
        </button>
        {showListingsError && <p className="text-red-400 mt-5 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30">Error showing listings</p>}
      </div>
    </div>
  );
};

export default Profile;