import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);


  console.log(sidebardata);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      <div className='flex flex-col lg:flex-row relative z-10'>
        <div className='p-3 xs:p-4 sm:p-6 md:p-7 border-b-2 lg:border-r-2 lg:min-h-screen backdrop-blur-md bg-white/40 border-slate-200 lg:w-80 xl:w-96'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4 xs:gap-6 sm:gap-8'>
            <div className='flex flex-col gap-2'>
              <label className='whitespace-nowrap font-semibold text-slate-700 text-xs xs:text-sm sm:text-base'>
                Search Term:
              </label>
              <input
                type='text'
                id='searchTerm'
                placeholder='Search...'
                className='border border-slate-300 rounded-lg p-2 xs:p-2.5 sm:p-3 w-full bg-white/80 backdrop-blur-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-xs xs:text-sm sm:text-base'
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
              <label className='font-semibold text-slate-700 text-xs xs:text-sm sm:text-base'>Type:</label>
              <div className='flex flex-wrap gap-2 xs:gap-3 sm:gap-4'>
                <div className='flex gap-1 xs:gap-2 items-center'>
                  <input
                    type='checkbox'
                    id='all'
                    className='w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 bg-transparent border-2 border-purple-400 rounded focus:ring-purple-400 focus:ring-2'
                    onChange={handleChange}
                    checked={sidebardata.type === 'all'}
                  />
                  <span className='text-slate-700 text-xs xs:text-sm sm:text-base'>Rent & Sale</span>
                </div>
                <div className='flex gap-1 xs:gap-2 items-center'>
                  <input
                    type='checkbox'
                    id='rent'
                    className='w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600 bg-transparent border-2 border-blue-400 rounded focus:ring-blue-400 focus:ring-2'
                    onChange={handleChange}
                    checked={sidebardata.type === 'rent'}
                  />
                  <span className='text-slate-700 text-xs xs:text-sm sm:text-base'>Rent</span>
                </div>
                <div className='flex gap-1 xs:gap-2 items-center'>
                  <input
                    type='checkbox'
                    id='sale'
                    className='w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 bg-transparent border-2 border-green-400 rounded focus:ring-green-400 focus:ring-2'
                    onChange={handleChange}
                    checked={sidebardata.type === 'sale'}
                  />
                  <span className='text-slate-700 text-xs xs:text-sm sm:text-base'>Sale</span>
                </div>
                <div className='flex gap-1 xs:gap-2 items-center'>
                  <input
                    type='checkbox'
                    id='offer'
                    className='w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-pink-600 bg-transparent border-2 border-pink-400 rounded focus:ring-pink-400 focus:ring-2'
                    onChange={handleChange}
                    checked={sidebardata.offer}
                  />
                  <span className='text-slate-700 text-xs xs:text-sm sm:text-base'>Offer</span>
                </div>
              </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
              <label className='font-semibold text-slate-700 text-xs xs:text-sm sm:text-base'>Amenities:</label>
              <div className='flex flex-wrap gap-2 xs:gap-3 sm:gap-4'>
                <div className='flex gap-1 xs:gap-2 items-center'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-cyan-600 bg-transparent border-2 border-cyan-400 rounded focus:ring-cyan-400 focus:ring-2'
                    onChange={handleChange}
                    checked={sidebardata.parking}
                  />
                  <span className='text-slate-700 text-xs xs:text-sm sm:text-base'>Parking</span>
                </div>
                <div className='flex gap-1 xs:gap-2 items-center'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-orange-600 bg-transparent border-2 border-orange-400 rounded focus:ring-orange-400 focus:ring-2'
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                  />
                  <span className='text-slate-700 text-xs xs:text-sm sm:text-base'>Furnished</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='font-semibold text-slate-700 text-xs xs:text-sm sm:text-base'>Sort:</label>
              <select
                onChange={handleChange}
                defaultValue={'created_at_desc'}
                id='sort_order'
                className='border border-slate-300 rounded-lg p-2 xs:p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-xs xs:text-sm sm:text-base'
              >
                <option value='regularPrice_desc' className='bg-white'>Price high to low</option>
                <option value='regularPrice_asc' className='bg-white'>Price low to high</option>
                <option value='createdAt_desc' className='bg-white'>Latest</option>
                <option value='createdAt_asc' className='bg-white'>Oldest</option>
              </select>
            </div>
            <button className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-2 xs:p-2.5 sm:p-3 rounded-lg uppercase hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-xs xs:text-sm sm:text-base'>
              Search
            </button>
          </form>
        </div>
        <div className='flex-1 backdrop-blur-md bg-white/20'>
          <h1 className='text-xl xs:text-2xl sm:text-3xl font-semibold border-b border-slate-200 p-3 xs:p-4 sm:p-5 text-slate-800 mt-2 xs:mt-3 sm:mt-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Listing results:
          </h1>

          <div className='p-3 xs:p-4 sm:p-7 flex flex-wrap gap-3 xs:gap-4'>
            {!loading && listings.length === 0 && (
              <p className='text-base xs:text-lg sm:text-xl text-slate-600'>No listing found!</p>
            )}
            {loading && (
              <p className='text-base xs:text-lg sm:text-xl text-slate-600 text-center w-full'>
                Loading...
              </p>
            )}

            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}

            {showMore && (
              <button
                onClick={onShowMoreClick}
                className='text-blue-600 hover:text-blue-700 hover:underline p-3 xs:p-4 sm:p-7 text-center w-full font-medium transition-colors duration-300 text-xs xs:text-sm sm:text-base'
              >
                Show more
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}