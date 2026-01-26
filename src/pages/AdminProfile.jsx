import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import '../styles/animations.css';

export default function AdminProfile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: localStorage.getItem('adminAvatar') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  });

  useEffect(() => {
    // Load admin data on component mount
    const loadAdminData = async () => {
      try {
        const res = await fetch('/api/admin/auth/profile');
        const data = await res.json();
        if (data.success) {
          setFormData(prev => ({
            ...prev,
            username: data.username || 'admin',
            email: data.email || '',
            avatar: data.avatar || localStorage.getItem('adminAvatar') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          }));
        }
      } catch (error) {
        console.error('Failed to load admin data:', error);
      }
    };
    
    loadAdminData();
    
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.error('Upload error:', error);
        setFileUploadError(true);
        setFilePerc(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('Upload successful:', downloadURL);
          setFormData(prev => ({ ...prev, avatar: downloadURL }));
          localStorage.setItem('adminAvatar', downloadURL);
          setFilePerc(0);
          setFileUploadError(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/admin/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='relative' style={{height: '100vh'}}>
      {/* Background Swiper */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 7500, disableOnInteraction: false }}
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
      <div className='relative z-10 p-4 max-w-2xl mx-auto overflow-y-auto' style={{height: '93.1vh'}}>
        <div className='animate-fade-in-up'>
          <h1 className='text-3xl sm:text-4xl font-semibold text-center mb-8 text-white bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/30'>
            Admin Profile
          </h1>
        </div>
        
        <div className='bg-black/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30 animate-fade-in-up animation-delay-200'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
            />
            <div className='flex flex-col items-center animate-fade-in-up animation-delay-300'>
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar}
                alt='profile'
                className='rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-white/30 shadow-2xl hover:scale-110 transition-all duration-300 hover:border-red-400/50'
              />
              <p className='text-sm text-white/80 mt-4 text-center'>
                {fileUploadError ? (
                  <span className='text-red-400 bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/30'>
                    Error Image upload (image must be less than 2 mb)
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className='text-orange-400 animate-pulse bg-orange-500/20 px-3 py-1 rounded-lg border border-orange-500/30'>{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className='text-green-400 bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/30'>Image successfully uploaded!</span>
                ) : (
                  'Click to upload image'
                )}
              </p>
            </div>

            <div className="relative group animate-fade-in-up animation-delay-400">
              <input
                type='text'
                placeholder='Username'
                id='username'
                value={formData.username}
                onChange={handleChange}
                className='w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl'
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <div className="relative group animate-fade-in-up animation-delay-500">
              <input
                type='email'
                placeholder='Email'
                id='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl'
                required
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <div className="relative group animate-fade-in-up animation-delay-600">
              <input
                type='password'
                placeholder='New Password (leave blank to keep current)'
                onChange={handleChange}
                id='password'
                className='w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-400/50 transition-all duration-500 hover:bg-white/20 focus:bg-white/20 transform focus:scale-105 hover:shadow-lg focus:shadow-xl'
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <div className="animate-fade-in-up animation-delay-700">
              <button
                disabled={loading}
                className='w-full bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-lg uppercase font-medium hover:from-red-700 hover:to-orange-700 disabled:opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:scale-105 active:scale-95'
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>

          {error && <p className='text-red-400 mt-5 text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30 animate-fade-in-up animation-delay-800'>{error}</p>}
          {updateSuccess && (
            <p className='text-green-400 mt-5 text-center bg-green-500/20 p-3 rounded-lg border border-green-500/30 animate-fade-in-up animation-delay-800'>
              Profile updated successfully!
            </p>
          )}

          <div className='flex justify-center mt-6 animate-fade-in-up animation-delay-900'>
            <button
              onClick={() => navigate('/admin')}
              className='text-red-400 hover:text-red-300 hover:underline transition-all duration-300 transform hover:scale-105 bg-red-500/20 px-6 py-3 rounded-lg border border-red-500/30 font-medium'
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}