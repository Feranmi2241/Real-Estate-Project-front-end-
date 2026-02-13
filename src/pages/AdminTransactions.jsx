import { useState, useEffect } from 'react';
import '../styles/animations.css';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    provider: '',
    email: ''
  });

  useEffect(() => {
    // Load all transactions on initial page load
    fetchTransactions();
  }, []);

  const handleSearch = () => {
    fetchTransactions();
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.provider) queryParams.append('provider', filters.provider);
      if (filters.email && filters.email.trim()) queryParams.append('email', filters.email.trim());
      
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/transactions?${queryParams}`);
      const data = await res.json();
      
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  const verifyTransaction = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/transactions/${id}/verify`, {
        method: 'PATCH'
      });
      const data = await res.json();
      
      if (data.success) {
        // Update the transaction in the list
        setTransactions(transactions.map(t => 
          t._id === id ? { ...t, verified: true } : t
        ));
        
        // Show success message with listing status update info
        const transaction = transactions.find(t => t._id === id);
        const listingType = transaction?.listingId?.type;
        const statusText = listingType === 'sale' ? 'Sold' : 'Rented';
        
        alert(`Transaction verified successfully! Listing status updated to "${statusText}".`);
      }
    } catch (error) {
      console.error('Error verifying transaction:', error);
      alert('Error verifying transaction');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className='relative min-h-screen'>
      {/* Neon Gradient Background */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <div className='w-full h-full bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900'></div>
        <div className='absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-transparent to-pink-900/40'></div>
        <div className='absolute inset-0 bg-gradient-to-bl from-transparent via-blue-900/30 to-transparent'></div>
        {/* Animated neon orbs */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse' style={{animationDelay: '2s'}}></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse' style={{animationDelay: '4s'}}></div>
        <div className='absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse' style={{animationDelay: '6s'}}></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 p-6 max-w-7xl mx-auto'>
        <div className='animate-fade-in-up'>
          <h1 className='text-3xl sm:text-4xl font-bold text-white mb-8 text-center bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-cyan-500/30'>Admin Transaction History</h1>
        </div>
        
        {/* Filters */}
        <div className='bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-cyan-500/30 mb-8 animate-fade-in-up animation-delay-200'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className="relative group">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className='w-full p-3 bg-white/10 backdrop-blur-sm border border-cyan-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/20'
              >
                <option value='' className='bg-slate-800 text-white'>All Status</option>
                <option value='pending' className='bg-slate-800 text-white'>Pending</option>
                <option value='successful' className='bg-slate-800 text-white'>Successful</option>
                <option value='failed' className='bg-slate-800 text-white'>Failed</option>
              </select>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            
            <div className="relative group">
              <select
                value={filters.provider}
                onChange={(e) => setFilters({...filters, provider: e.target.value})}
                className='w-full p-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 hover:bg-white/20'
              >
                <option value='' className='bg-slate-800 text-white'>All Providers</option>
                <option value='Paystack' className='bg-slate-800 text-white'>Paystack</option>
                <option value='Flutterwave' className='bg-slate-800 text-white'>Flutterwave</option>
              </select>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            
            <div className="relative group">
              <input
                type='text'
                placeholder='Search by email (optional)...'
                value={filters.email}
                onChange={(e) => setFilters({...filters, email: e.target.value})}
                className='w-full p-3 bg-white/10 backdrop-blur-sm border border-pink-500/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 transition-all duration-300 hover:bg-white/20'
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className='bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-medium'
          >
            Search Transactions
          </button>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className='text-center py-8 animate-fade-in-up animation-delay-300'>
            <div className='bg-black/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-cyan-500/30 inline-block'>
              <p className='text-xl text-white'>Loading transactions...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className='text-center py-8 animate-fade-in-up animation-delay-300'>
            <div className='bg-black/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-cyan-500/30 inline-block'>
              <p className='text-xl text-white'>No transactions found</p>
            </div>
          </div>
        ) : (
          <div className='bg-black/50 backdrop-blur-md rounded-2xl shadow-xl border border-cyan-500/30 overflow-hidden animate-fade-in-up animation-delay-300'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-sm'>
                  <tr>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>Transaction ID</th>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>User</th>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>Property</th>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>Amount</th>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>Provider</th>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>Status</th>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>Verified</th>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>Date</th>
                    <th className='p-4 text-left text-cyan-300 font-semibold'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={transaction._id} className={`border-b border-cyan-500/20 hover:bg-white/10 transition-all duration-300 animate-fade-in-up`} style={{animationDelay: `${400 + index * 50}ms`}}>
                      <td className='p-4 font-mono text-sm text-white bg-slate-800/50 rounded-lg m-1'>
                        {transaction._id.slice(-8)}
                      </td>
                      <td className='p-4'>
                        <div>
                          <p className='font-medium text-white'>{transaction.userId?.username}</p>
                          <p className='text-sm text-cyan-300'>{transaction.userId?.email}</p>
                        </div>
                      </td>
                      <td className='p-4'>
                        <div>
                          <p className='font-medium text-white'>{transaction.listingId?.name}</p>
                          <p className='text-sm text-purple-300'>
                            ₦{transaction.listingId?.regularPrice?.toLocaleString()}
                          </p>
                        </div>
                      </td>
                      <td className='p-4'>
                        <div>
                          <span className='font-medium text-green-400'>
                            {transaction.currency === 'NGN' ? '₦' : 
                             transaction.currency === 'USD' ? '$' : 
                             transaction.currency === 'EUR' ? '€' : 
                             transaction.currency === 'GBP' ? '£' : 
                             transaction.currency === 'CAD' ? 'C$' : ''}
                            {transaction.convertedAmount?.toLocaleString() || transaction.amount.toLocaleString()}
                          </span>
                          {transaction.originalAmount && transaction.originalAmount !== transaction.convertedAmount && (
                            <p className='text-xs text-cyan-400 mt-1'>
                              Original: ₦{transaction.originalAmount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className='p-4 text-white'>{transaction.paymentProvider}</td>
                      <td className='p-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'successful' ? 'text-green-400 bg-green-500/20 border border-green-500/30' :
                          transaction.status === 'failed' ? 'text-red-400 bg-red-500/20 border border-red-500/30' :
                          transaction.status === 'pending' ? 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30' :
                          'text-gray-400 bg-gray-500/20 border border-gray-500/30'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className='p-4'>
                        {transaction.verified ? (
                          <span className='text-green-400 font-medium bg-green-500/20 px-2 py-1 rounded-lg border border-green-500/30'>✓ Verified</span>
                        ) : (
                          <span className='text-gray-400 bg-gray-500/20 px-2 py-1 rounded-lg border border-gray-500/30'>Not Verified</span>
                        )}
                      </td>
                      <td className='p-4 text-sm text-white'>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className='p-4'>
                        {!transaction.verified && transaction.status === 'successful' && (
                          <button
                            onClick={() => verifyTransaction(transaction._id)}
                            className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                          >
                            Verify
                          </button>
                        )}
                        {transaction.verified && (
                          <span className='text-green-400 text-sm bg-green-500/20 px-2 py-1 rounded border border-green-500/30'>Verified</span>
                        )}
                        {!transaction.verified && transaction.status !== 'successful' && (
                          <span className='text-gray-400 text-sm'>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}