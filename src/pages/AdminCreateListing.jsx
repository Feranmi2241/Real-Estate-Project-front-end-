import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function AdminCreateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const isEditMode = !!params.listingId;
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    soldOrRented: false,
    soldOrRentedStatus: 'sold',
    location: { lat: null, lng: null, address: '' }
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Fetch existing listing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchListing = async () => {
        try {
          const res = await fetch(`/api/listing/get/${params.listingId}`);
          const data = await res.json();
          if (data.success === false) {
            setError(data.message);
            return;
          }
          setFormData(data);
        } catch (error) {
          console.error('Error fetching listing:', error);
          setError('Failed to load listing data');
        }
      };
      fetchListing();
    }
  }, [isEditMode, params.listingId]);

  // Component for handling map clicks
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData({
          ...formData,
          location: {
            lat: lat,
            lng: lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          }
        });
      },
    });

    return formData.location.lat ? (
      <Marker position={[formData.location.lat, formData.location.lng]} />
    ) : null;
  }

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
        soldOrRented: false,
      });
    }

    if (e.target.id === 'soldOrRented') {
      setFormData({
        ...formData,
        soldOrRented: e.target.checked,
      });
    }

    if (e.target.id === 'soldOrRentedStatus') {
      setFormData({
        ...formData,
        soldOrRentedStatus: e.target.value,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      
      // Remove fields that shouldn't be sent in update
      const { _id, __v, userRef, createdAt, updatedAt, ...submitData } = formData;
      
      const url = isEditMode 
        ? `/api/listing/admin/update/${params.listingId}`
        : '/api/listing/admin/create';
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isEditMode ? submitData : { ...submitData, userRef: 'admin' }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate('/admin');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-red-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>

      <main className="relative z-10 p-3 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2 animate-fade-in-up">
            {isEditMode ? 'Edit Listing' : 'Admin Create Listing'}
          </h1>
          <p className="text-orange-200 text-lg animate-fade-in-up animation-delay-200">{isEditMode ? 'Update property listing details' : 'Create premium property listings'}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Property Details */}
          <div className="flex-1 space-y-6">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-400">
              <h2 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Property Name"
                  className="w-full p-4 bg-white/5 border border-red-400/30 rounded-xl text-white placeholder-red-200/70 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
                  id="name"
                  maxLength="62"
                  minLength="10"
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
                
                <textarea
                  placeholder="Property Description"
                  className="w-full p-4 bg-white/5 border border-red-400/30 rounded-xl text-white placeholder-red-200/70 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300 min-h-[120px] resize-none"
                  id="description"
                  required
                  onChange={handleChange}
                  value={formData.description}
                />
                
                <input
                  type="text"
                  placeholder="Property Address"
                  className="w-full p-4 bg-white/5 border border-red-400/30 rounded-xl text-white placeholder-red-200/70 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
                  id="address"
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>
            </div>

            {/* Property Type & Features */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-600">
              <h2 className="text-xl font-semibold text-orange-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Property Type & Features
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-orange-400/30 hover:border-orange-400 transition-all duration-300 cursor-pointer">
                  <input
                    type="checkbox"
                    id="sale"
                    className="w-5 h-5 text-orange-400 bg-transparent border-2 border-orange-400 rounded focus:ring-orange-400 focus:ring-2"
                    onChange={handleChange}
                    checked={formData.type === "sale"}
                    disabled={formData.soldOrRented}
                  />
                  <span className="text-orange-200 font-medium">For Sale</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-orange-400/30 hover:border-orange-400 transition-all duration-300 cursor-pointer">
                  <input
                    type="checkbox"
                    id="rent"
                    className="w-5 h-5 text-orange-400 bg-transparent border-2 border-orange-400 rounded focus:ring-orange-400 focus:ring-2"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                    disabled={formData.soldOrRented}
                  />
                  <span className="text-orange-200 font-medium">For Rent</span>
                </label>
                
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-orange-400/30">
                  <input
                    type="checkbox"
                    id="soldOrRented"
                    className="w-5 h-5 text-orange-400 bg-transparent border-2 border-orange-400 rounded focus:ring-orange-400 focus:ring-2"
                    onChange={handleChange}
                    checked={formData.soldOrRented}
                  />
                  <select
                    id="soldOrRentedStatus"
                    value={formData.soldOrRentedStatus}
                    onChange={handleChange}
                    disabled={!formData.soldOrRented}
                    className="bg-white/5 border border-orange-400/30 rounded-lg px-2 py-1 text-orange-200 text-sm focus:border-orange-400 transition-all duration-300"
                  >
                    <option value="sold" className="bg-gray-800">Sold</option>
                    <option value="rented" className="bg-gray-800">Rented</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 cursor-pointer">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5 h-5 text-yellow-400 bg-transparent border-2 border-yellow-400 rounded focus:ring-yellow-400 focus:ring-2"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span className="text-yellow-200 font-medium">Parking</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 cursor-pointer">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5 h-5 text-yellow-400 bg-transparent border-2 border-yellow-400 rounded focus:ring-yellow-400 focus:ring-2"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span className="text-yellow-200 font-medium">Furnished</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 cursor-pointer">
                  <input
                    type="checkbox"
                    id="offer"
                    className="w-5 h-5 text-yellow-400 bg-transparent border-2 border-yellow-400 rounded focus:ring-yellow-400 focus:ring-2"
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <span className="text-yellow-200 font-medium">Special Offer</span>
                </label>
              </div>
            </div>

            {/* Property Specifications */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-800">
              <h2 className="text-xl font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Property Specifications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-yellow-200 font-medium">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    className="w-full p-3 bg-white/5 border border-yellow-400/30 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                    onChange={handleChange}
                    value={formData.bedrooms}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-yellow-200 font-medium">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    className="w-full p-3 bg-white/5 border border-yellow-400/30 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                    onChange={handleChange}
                    value={formData.bathrooms}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-yellow-200 font-medium">
                    Regular Price (₦)
                    {formData.type === "rent" && (
                      <span className="text-sm text-yellow-300 ml-2">(per month)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    id="regularPrice"
                    min="50"
                    max="10000000"
                    required
                    className="w-full p-3 bg-white/5 border border-yellow-400/30 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                </div>
                
                {formData.offer && (
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <label className="text-red-200 font-medium">
                      Discounted Price (₦)
                      {formData.type === "rent" && (
                        <span className="text-sm text-red-300 ml-2">(per month)</span>
                      )}
                    </label>
                    <input
                      type="number"
                      id="discountPrice"
                      min="0"
                      max="10000000"
                      required
                      className="w-full p-3 bg-white/5 border border-red-400/30 rounded-xl text-white focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload & Location */}
          <div className="flex-1 space-y-6">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-1000">
              <h2 className="text-xl font-semibold text-red-300 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Property Images
              </h2>
              <p className="text-red-200/70 text-sm mb-6">First image will be the cover (max 6 images)</p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    onChange={(e) => setFiles(e.target.files)}
                    className="flex-1 p-3 bg-white/5 border border-red-400/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-400/20 file:text-red-200 hover:file:bg-red-400/30 transition-all duration-300"
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                  />
                  <button
                    disabled={uploading}
                    onClick={handleImageSubmit}
                    type="button"
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
                
                {imageUploadError && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                    {imageUploadError}
                  </p>
                )}
                
                {formData.imageUrls.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {formData.imageUrls.map((url, index) => (
                      <div
                        key={url}
                        className="flex items-center justify-between p-3 bg-white/5 border border-white/20 rounded-xl hover:border-white/40 transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <img
                          src={url}
                          alt="listing image"
                          className="w-16 h-16 object-cover rounded-lg border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/30 hover:border-red-400 transition-all duration-300 transform hover:scale-105"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Location Selection */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-1200">
              <h2 className="text-xl font-semibold text-orange-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Location Selection
              </h2>
              
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="w-full p-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Select Location on Map
              </button>
              
              {formData.location.lat && (
                <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm font-medium">
                    Location saved: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="animate-fade-in-up animation-delay-1400">
              <button 
                disabled={loading || uploading} 
                className="w-full p-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-xl font-semibold text-lg hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isEditMode ? 'Updating Listing...' : 'Creating Listing...'}
                  </span>
                ) : (
                  isEditMode ? "Update Listing" : "Create Admin Listing"
                )}
              </button>
              
              {error && (
                <p className="mt-4 text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                  {error}
                </p>
              )}
            </div>
          </div>
        </form>
        
        {/* Map Modal */}
        {showMap && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl w-full max-w-4xl h-[600px] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-white/20">
                <h3 className="text-xl font-semibold text-white">Select Property Location</h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-red-400 hover:text-red-300 text-2xl font-bold transition-colors duration-300"
                >
                  ×
                </button>
              </div>
              
              <div className="h-96 m-6 rounded-xl overflow-hidden border border-white/20">
                <MapContainer
                  center={[9.0765, 7.3986]} // Nigeria center
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-gray-300 text-sm">Click on the map to select a location for the property</p>
                {formData.location.lat && (
                  <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">
                      Selected: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setShowMap(false)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                >
                  Save Location
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}