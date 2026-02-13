import { useState } from 'react';
import '../styles/animations.css';

export default function RevenueReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiUrl}/api/revenue/report`);
      const data = await res.json();
      if (data.success) {
        setReportData(data.data);
      } else {
        setError('Failed to generate report');
      }
    } catch (error) {
      setError('Error generating report');
    }
    setLoading(false);
  };

  const formatCurrency = (amount, isLocal = true) => {
    return isLocal ? `₦${amount.toLocaleString()}` : `$${amount.toLocaleString()}`;
  };

  const SimpleChart = ({ data, title, type }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => Math.max(d.local || 0, d.international || 0)));
    
    return (
      <div className='bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-all duration-300'>
        <h4 className='font-semibold mb-4 text-center text-white'>{title}</h4>
        <div className='space-y-2'>
          {data.map((item, index) => {
            const label = item.date || item.month || item.year;
            const localHeight = maxValue > 0 ? (item.local / maxValue) * 100 : 0;
            const intlHeight = maxValue > 0 ? (item.international / maxValue) * 100 : 0;
            
            return (
              <div key={index} className='flex items-end space-x-2 h-20'>
                <div className='flex-1 text-center'>
                  <div className='flex justify-center items-end space-x-1 h-16'>
                    <div 
                      className='bg-gradient-to-t from-green-500 to-green-400 w-4 rounded-t shadow-lg'
                      style={{ height: `${localHeight}%` }}
                      title={`Local: ${formatCurrency(item.local)}`}
                    ></div>
                    <div 
                      className='bg-gradient-to-t from-purple-500 to-purple-400 w-4 rounded-t shadow-lg'
                      style={{ height: `${intlHeight}%` }}
                      title={`International: ${formatCurrency(item.international, false)}`}
                    ></div>
                  </div>
                  <div className='text-xs mt-1 text-white/80'>{label}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className='flex justify-center mt-4 space-x-4 text-sm'>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded mr-2 shadow-sm'></div>
            <span className='text-white/90'>Local (NGN)</span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded mr-2 shadow-sm'></div>
            <span className='text-white/90'>International</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='relative min-h-screen'>
      {/* Neon Gradient Background - Admin Theme */}
      <div className='absolute inset-0 z-0 w-full h-full'>
        <div className='w-full h-full bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900'></div>
        <div className='absolute inset-0 bg-gradient-to-tr from-red-900/30 via-transparent to-yellow-900/30'></div>
        <div className='absolute inset-0 bg-gradient-to-bl from-transparent via-orange-900/20 to-transparent'></div>
        {/* Animated gradient orbs */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse' style={{animationDelay: '2s'}}></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-yellow-500/15 to-red-500/15 rounded-full blur-3xl animate-pulse' style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Content Layer */}
      <div className='relative z-10 p-6 max-w-7xl mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in-up'>
          <h1 className='text-3xl sm:text-4xl font-bold text-white bg-black/50 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20'>Revenue Report</h1>
          <button
            onClick={generateReport}
            disabled={loading}
            className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-medium'
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {error && (
          <div className='bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl mb-6 backdrop-blur-md animate-fade-in-up animation-delay-200'>
            {error}
          </div>
        )}

        {reportData && (
          <div className='space-y-8 animate-fade-in-up animation-delay-300'>
            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400'>
                <h3 className='text-lg font-semibold mb-4 text-center text-white'>Daily Revenue</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between text-white/90'>
                    <span>Local (NGN):</span>
                    <span className='font-bold text-green-400'>
                      {formatCurrency(reportData.totals.daily.local)}
                    </span>
                  </div>
                  <div className='flex justify-between text-white/90'>
                    <span>International:</span>
                    <span className='font-bold text-purple-400'>
                      {formatCurrency(reportData.totals.daily.international, false)}
                    </span>
                  </div>
                  <div className='border-t border-white/20 pt-3 flex justify-between font-bold text-white'>
                    <span>Total:</span>
                    <span className='text-blue-400'>{formatCurrency(reportData.totals.daily.local + reportData.totals.daily.international)}</span>
                  </div>
                </div>
              </div>

              <div className='bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-500'>
                <h3 className='text-lg font-semibold mb-4 text-center text-white'>Weekly Revenue</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between text-white/90'>
                    <span>Local (NGN):</span>
                    <span className='font-bold text-green-400'>
                      {formatCurrency(reportData.totals.weekly.local)}
                    </span>
                  </div>
                  <div className='flex justify-between text-white/90'>
                    <span>International:</span>
                    <span className='font-bold text-purple-400'>
                      {formatCurrency(reportData.totals.weekly.international, false)}
                    </span>
                  </div>
                  <div className='border-t border-white/20 pt-3 flex justify-between font-bold text-white'>
                    <span>Total:</span>
                    <span className='text-blue-400'>{formatCurrency(reportData.totals.weekly.local + reportData.totals.weekly.international)}</span>
                  </div>
                </div>
              </div>

              <div className='bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-600'>
                <h3 className='text-lg font-semibold mb-4 text-center text-white'>Yearly Revenue</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between text-white/90'>
                    <span>Local (NGN):</span>
                    <span className='font-bold text-green-400'>
                      {formatCurrency(reportData.totals.yearly.local)}
                    </span>
                  </div>
                  <div className='flex justify-between text-white/90'>
                    <span>International:</span>
                    <span className='font-bold text-purple-400'>
                      {formatCurrency(reportData.totals.yearly.international, false)}
                    </span>
                  </div>
                  <div className='border-t border-white/20 pt-3 flex justify-between font-bold text-white'>
                    <span>Total:</span>
                    <span className='text-blue-400'>{formatCurrency(reportData.totals.yearly.local + reportData.totals.yearly.international)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='animate-fade-in-up animation-delay-700'>
                <SimpleChart 
                  data={reportData.charts.daily} 
                  title="Daily Revenue (Last 7 Days)" 
                  type="daily"
                />
              </div>
              <div className='animate-fade-in-up animation-delay-800'>
                <SimpleChart 
                  data={reportData.charts.monthly} 
                  title="Monthly Revenue (Last 12 Months)" 
                  type="monthly"
                />
              </div>
              <div className='animate-fade-in-up animation-delay-900'>
                <SimpleChart 
                  data={reportData.charts.yearly} 
                  title="Yearly Revenue (Last 3 Years)" 
                  type="yearly"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}