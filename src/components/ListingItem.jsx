import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className="group relative p-[2px] rounded-[2rem] transition-all duration-500 hover:bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.3)]">
      <div className="bg-white/95 backdrop-blur-sm rounded-[1.9rem] overflow-hidden h-full">
        <Link to={`/listing/${listing._id}`}>
          <div className="h-48 bg-slate-700 overflow-hidden relative">
            <img
              src={
                listing.imageUrls[0] ||
                'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
              }
              alt='listing cover'
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {listing.offer && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Offer
              </div>
            )}
            {listing.type === 'rent' && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Rent
              </div>
            )}
            {listing.type === 'sale' && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Sale
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-slate-800 text-xl font-bold mb-2 truncate group-hover:text-blue-600 transition-colors duration-300">
              {listing.name}
            </h3>
            <div className='flex items-center gap-1 mb-3'>
              <MdLocationOn className='h-4 w-4 text-blue-600' />
              <p className='text-sm text-slate-600 truncate'>
                {listing.address}
              </p>
            </div>
            <p className="text-slate-600 text-sm line-clamp-2 mb-4">
              {listing.description}
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-black text-slate-800">
                ₦{listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && (
                  <span className="text-sm font-normal text-slate-500">/mo</span>
                )}
              </span>
            </div>
            <div className='flex gap-4 text-slate-700'>
              <div className='flex items-center gap-1 text-sm font-semibold'>
                <FaBed className='text-blue-600' />
                <span>
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds`
                    : `${listing.bedrooms} bed`}
                </span>
              </div>
              <div className='flex items-center gap-1 text-sm font-semibold'>
                <FaBath className='text-purple-600' />
                <span>
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths`
                    : `${listing.bathrooms} bath`}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}