import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localBankConfig, setLocalBankConfig] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankCode: ''
  });
  const [intlBankConfig, setIntlBankConfig] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    swiftCode: '',
    routingNumber: ''
  });
  const [bankSuggestions, setBankSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [analytics, setAnalytics] = useState({
    totalUsers: null,
    totalListings: null,
    totalRevenue: null
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchListings();
    
    // Refresh listings every 30 seconds to catch status updates from verified transactions
    const interval = setInterval(fetchListings, 30000);
    
    // Refresh when window regains focus (e.g., returning from edit page)
    const handleFocus = () => {
      fetchListings();
      if (analytics.totalRevenue !== null) {
        fetchAnalytics('revenue');
      }
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [analytics.totalRevenue]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listing/admin/all?limit=1000');
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    }
    setLoading(false);
  };

  const fetchBanks = async (query) => {
    if (query.length < 2) {
      setBankSuggestions([]);
      return;
    }
    try {
      const res = await fetch('https://api.paystack.co/bank');
      const data = await res.json();
      const filtered = data.data.filter(bank => 
        bank.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setBankSuggestions(filtered);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const handleBankSearch = (value, field) => {
    setActiveField(field);
    if (field === 'local') {
      setLocalBankConfig({...localBankConfig, bankName: value});
    } else {
      setIntlBankConfig({...intlBankConfig, bankName: value});
    }
    fetchBanks(value);
  };

  const selectBank = (bank) => {
    if (activeField === 'local') {
      setLocalBankConfig({...localBankConfig, bankName: bank.name, bankCode: bank.code});
    } else {
      setIntlBankConfig({...intlBankConfig, bankName: bank.name});
    }
    setShowSuggestions(false);
    setBankSuggestions([]);
  };

  const saveBankConfig = async (type) => {
    const config = type === 'local' ? localBankConfig : intlBankConfig;
    
    // Client-side validation
    if (type === 'local') {
      if (!config.bankName || !config.accountNumber || !config.accountName) {
        alert('Please fill in all required fields: Bank Name, Account Number, and Account Name');
        return;
      }
    }
    
    if (type === 'intl') {
      if (!config.bankName || !config.accountNumber || !config.accountName || !config.swiftCode) {
        alert('Please fill in all required fields: Bank Name, Account Number, Account Name, and SWIFT Code');
        return;
      }
    }
    
    try {
      const response = await fetch(`/api/listing/admin/bank-config/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`${type === 'local' ? 'Local' : 'International'} bank configuration saved and verified successfully!`);
      } else {
        alert(`Validation Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving bank config:', error);
      alert('Error saving bank configuration. Please try again.');
    }
  };

  const fetchAnalytics = async (type) => {
    setLoadingAnalytics(prev => ({...prev, [type]: true}));
    try {
      const res = await fetch(`/api/analytics/${type}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(prev => ({
          ...prev, 
          [type === 'users' ? 'totalUsers' : type === 'listings' ? 'totalListings' : 'totalRevenue']: 
            data.data[type === 'users' ? 'totalUsers' : type === 'listings' ? 'totalListings' : 'totalRevenue']
        }));
      } else {
        alert('Error fetching analytics: ' + data.message);
      }
    } catch (error) {
      console.error('Analytics error:', error);
      alert('Error fetching analytics data');
    }
    setLoadingAnalytics(prev => ({...prev, [type]: false}));
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/listing/admin/delete/${id}`, { 
        method: 'DELETE'
      });
      
      if (res.ok) {
        await fetchListings();
        
        if (analytics.totalListings !== null) {
          await fetchAnalytics('listings');
        }
        if (analytics.totalRevenue !== null) {
          await fetchAnalytics('revenue');
        }
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
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

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-md border-r border-white/20 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-red-400 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          <Link 
            to='/admin/profile'
            className='flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group'
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Admin Profile
          </Link>
          
          <Link 
            to='/admin/chat-history'
            className='flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group'
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat History
          </Link>
          
          <Link 
            to='/admin/revenue-report'
            className='flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group'
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Revenue Report
          </Link>
          
          <Link 
            to='/admin/transactions'
            className='flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group'
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Transactions
          </Link>
          
          <Link 
            to='/admin/create-listing'
            className='flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group'
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Listing
          </Link>
          
          <button
            onClick={async () => {
              await fetch('/api/admin/auth/logout', { method: 'POST' });
              localStorage.removeItem('adminAuth');
              window.location.href = '/admin/login';
            }}
            className='flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200 group w-full text-left'
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 lg:-mt-[420px]">
        {/* Header */}
        <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-red-400 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Online</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="relative z-10 p-6">
          {/* Analytics Section */}
          <section className="mb-8">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 animate-fade-in-up">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Analytics Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center group">
                  <button
                    onClick={() => fetchAnalytics('users')}
                    disabled={loadingAnalytics.users}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {loadingAnalytics.users ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        Total Users
                      </div>
                    )}
                  </button>
                  {analytics.totalUsers !== null && (
                    <div className="mt-4 p-4 bg-blue-400/10 border border-blue-400/30 rounded-xl backdrop-blur-sm">
                      <span className="text-3xl font-bold text-blue-400">{analytics.totalUsers}</span>
                      <p className="text-sm text-blue-200 mt-1">Registered Users</p>
                    </div>
                  )}
                </div>
                
                <div className="text-center group">
                  <button
                    onClick={() => fetchAnalytics('listings')}
                    disabled={loadingAnalytics.listings}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {loadingAnalytics.listings ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Total Listings
                      </div>
                    )}
                  </button>
                  {analytics.totalListings !== null && (
                    <div className="mt-4 p-4 bg-green-400/10 border border-green-400/30 rounded-xl backdrop-blur-sm">
                      <span className="text-3xl font-bold text-green-400">{analytics.totalListings}</span>
                      <p className="text-sm text-green-200 mt-1">Property Listings</p>
                    </div>
                  )}
                </div>
                
                <div className="text-center group">
                  <button
                    onClick={() => fetchAnalytics('revenue')}
                    disabled={loadingAnalytics.revenue}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {loadingAnalytics.revenue ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Total Revenue
                      </div>
                    )}
                  </button>
                  {analytics.totalRevenue !== null && (
                    <div className="mt-4 p-4 bg-purple-400/10 border border-purple-400/30 rounded-xl backdrop-blur-sm">
                      <span className="text-3xl font-bold text-purple-400">₦{analytics.totalRevenue.toLocaleString()}</span>
                      <p className="text-sm text-purple-200 mt-1">Total Edx Revenue</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Listings Section */}
          <section>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-200">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Property Listings Management
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white text-lg">Loading listings...</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="p-4 text-left text-white/80 font-medium">Image</th>
                        <th className="p-4 text-left text-white/80 font-medium">Name</th>
                        <th className="p-4 text-left text-white/80 font-medium">Address</th>
                        <th className="p-4 text-left text-white/80 font-medium">Description</th>
                        <th className="p-4 text-left text-white/80 font-medium">Type</th>
                        <th className="p-4 text-left text-white/80 font-medium">Price</th>
                        <th className="p-4 text-left text-white/80 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(listings) && listings.map((listing, index) => (
                        <tr key={listing._id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200" style={{ animationDelay: `${index * 100}ms` }}>
                          <td className="p-4">
                            <img 
                              src={listing.imageUrls[0]} 
                              alt={listing.name}
                              className="w-16 h-16 object-cover rounded-xl border border-white/20 shadow-lg"
                            />
                          </td>
                          <td className="p-4 text-white font-medium">{listing.name}</td>
                          <td className="p-4 text-white/80">{listing.address}</td>
                          <td className="p-4">
                            <div className="max-w-xs truncate text-white/70">
                              {listing.description}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              listing.soldOrRented 
                                ? (listing.soldOrRentedStatus === 'sold' ? 'bg-red-400/20 text-red-400 border border-red-400/30' : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30')
                                : (listing.type === 'rent' ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30' : 'bg-green-400/20 text-green-400 border border-green-400/30')
                            }`}>
                              {listing.soldOrRented 
                                ? (listing.soldOrRentedStatus === 'sold' ? 'Sold' : 'Rented')
                                : (listing.type === 'rent' ? 'For Rent' : 'For Sale')
                              }
                            </span>
                          </td>
                          <td className="p-4 text-white font-semibold">₦{listing.regularPrice.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Link 
                                to={`/admin/edit-listing/${listing._id}`}
                                className="bg-blue-500/20 text-blue-400 border border-blue-400/30 px-3 py-1 rounded-lg text-sm hover:bg-blue-500/30 hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
                              >
                                Edit
                              </Link>
                              <button 
                                onClick={() => deleteListing(listing._id)}
                                className="bg-red-500/20 text-red-400 border border-red-400/30 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 hover:border-red-400 transition-all duration-200 transform hover:scale-105"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {Array.isArray(listings) && listings.length === 0 && (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-white/60 text-lg">No listings found</p>
                      <p className="text-white/40 text-sm mt-2">Create your first property listing to get started</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}