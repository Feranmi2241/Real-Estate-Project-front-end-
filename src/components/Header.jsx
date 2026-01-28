import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getImageUrl } from '../utils/imageUtils.js';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

  };

  useEffect(() => {

    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);




  return (
    <header className="relative bg-gradient-to-r from-white via-blue-50 to-purple-50 shadow-lg backdrop-blur-sm border-b border-white/20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-blue-400/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 right-1/3 w-16 h-16 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="relative z-10 flex justify-between items-center max-w-6xl mx-auto p-3 sm:p-4">
        <Link to="/" className="group flex-shrink-0">
          <h1 className="font-bold text-xs sm:text-sm md:text-xl flex flex-wrap transition-all duration-500 group-hover:scale-105 transform">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x transition-all duration-700 group-hover:from-pink-600 group-hover:via-blue-600 group-hover:to-purple-600">Positive Mind Estate</span> 
            <span className="text-slate-700 ml-1 sm:ml-2 transition-all duration-500 group-hover:text-slate-900 group-hover:scale-105">& Reality</span>
          </h1>
        </Link>
        
        {/* Desktop Search */}
        <form onSubmit={handleSubmit} className="relative group hidden md:block">
          <div className="relative bg-white/80 backdrop-blur-lg p-2 sm:p-3 rounded-full shadow-lg border border-white/30 transition-all duration-500 group-hover:shadow-xl group-focus-within:shadow-xl group-focus-within:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search properties..."
                className="bg-transparent focus:outline-none w-32 lg:w-64 text-slate-700 placeholder-slate-500 transition-all duration-300 focus:placeholder-slate-400 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="ml-2 sm:ml-3 p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                <FaSearch className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </form>
        
        {/* Desktop Navigation */}
        <ul className="hidden 2xl:flex gap-4 xl:gap-6 items-center">
          <Link to="/" className="group">
            <li className="text-slate-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium relative text-sm xl:text-base">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </li>
          </Link>
          <Link to="/about" className="group">
            <li className="text-slate-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium relative text-sm xl:text-base">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </li>
          </Link>
          {currentUser && (
            <Link to="/user/chat-history" className="group">
              <li className="text-slate-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium relative text-sm xl:text-base">
                Chat History
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </li>
            </Link>
          )}
          {currentUser && (
            <Link to="/user/transactions" className="group">
              <li className="text-slate-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium relative text-sm xl:text-base">
                Transactions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </li>
            </Link>
          )}
          <Link to="/profile" className="group">
            {currentUser ? (
              <div className="relative">
                <img
                  src={getImageUrl(currentUser.avatar)}
                  alt="avatar"
                  className="rounded-full h-7 w-7 sm:h-8 sm:w-8 object-cover border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-purple-500 group-hover:shadow-xl"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : (
              <li className="text-slate-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium relative text-sm xl:text-base">
                Sign In
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </li>
            )}
          </Link>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="2xl:hidden p-2 rounded-lg bg-white/80 backdrop-blur-lg shadow-lg border border-white/30 text-slate-700 hover:text-purple-600 transition-all duration-300 hover:scale-105"
        >
          {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="2xl:hidden bg-white/95 backdrop-blur-lg border-t border-white/30 shadow-xl z-[9999] w-full">
          <div className="max-w-6xl mx-auto p-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSubmit} className="relative group 2xl:hidden">
              <div className="relative bg-white/80 backdrop-blur-lg p-3 rounded-full shadow-lg border border-white/30 transition-all duration-500 group-hover:shadow-xl group-focus-within:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    className="bg-transparent focus:outline-none w-full text-slate-700 placeholder-slate-500 transition-all duration-300 focus:placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="ml-3 p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                    <FaSearch className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block">
                <div className="p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 text-slate-700 hover:text-purple-600 font-medium">
                  Home
                </div>
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block">
                <div className="p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 text-slate-700 hover:text-purple-600 font-medium">
                  About
                </div>
              </Link>
              {currentUser && (
                <Link to="/user/chat-history" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <div className="p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 text-slate-700 hover:text-purple-600 font-medium">
                    Chat History
                  </div>
                </Link>
              )}
              {currentUser && (
                <Link to="/user/transactions" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <div className="p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 text-slate-700 hover:text-purple-600 font-medium">
                    Transactions
                  </div>
                </Link>
              )}
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block">
                <div className="p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 text-slate-700 hover:text-purple-600 font-medium flex items-center gap-3">
                  {currentUser ? (
                    <>
                      <img
                        src={getImageUrl(currentUser.avatar)}
                        alt="avatar"
                        className="rounded-full h-8 w-8 object-cover border-2 border-white shadow-lg"
                      />
                      <span>Profile</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;