import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateListing from "./pages/AdminCreateListing";
import AdminTransactions from "./pages/AdminTransactions";
import RevenueReport from "./pages/RevenueReport";
import AdminChatHistory from "./pages/AdminChatHistory";
import AdminChatDetail from "./pages/AdminChatDetail";
import UserChatHistory from "./pages/UserChatHistory";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetCode from "./pages/VerifyResetCode";
import AdminLogin from "./pages/AdminLogin";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AdminProfile from "./pages/AdminProfile";
import AdminVerifyOTP from "./pages/AdminVerifyOTP";
import UserTransactions from "./pages/UserTransactions";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      {/* User Routes with Header */}
      <Route path="/" element={<><Header /><Home /></>} />
      <Route path="/sign-in" element={<><Header /><SignIn /></>} />
      <Route path="/sign-up" element={<><Header /><SignUp /></>} />
      <Route path="/forgot-password" element={<><Header /><ForgotPassword /></>} />
      <Route path="/verify-reset-code" element={<><Header /><VerifyResetCode /></>} />
      <Route path="/about" element={<><Header /><About /></>} />
      <Route path="/listing/:listingId" element={<><Header /><Listing /></>} />
      <Route path="/search" element={<><Header /><Search /></>} />
      <Route path="/user/chat-history" element={<><Header /><UserChatHistory /></>} />
      <Route path="/user/transactions" element={<><Header /><UserTransactions /></>} />
      
      <Route element={<PrivateRoute />}>
        {/* <Route path="/dashboard" element={<><Header /><UserDashboard /></>} /> */}
        <Route path="/profile" element={<><Header /><Profile /></>} />
        <Route path="/create-listing" element={<><Header /><CreateListing /></>} />
        <Route path="/update-listing/:listingId" element={<><Header /><UpdateListing /></>} />
      </Route>
      
      {/* Admin Routes with AdminLayout (No User Header) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/verify-otp" element={<AdminVerifyOTP />} />
      <Route path="/admin" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
      <Route path="/admin/profile" element={<AdminPrivateRoute><AdminProfile /></AdminPrivateRoute>} />
      <Route path="/admin/create-listing" element={<AdminPrivateRoute><AdminCreateListing /></AdminPrivateRoute>} />
      <Route path="/admin/edit-listing/:listingId" element={<AdminPrivateRoute><AdminCreateListing /></AdminPrivateRoute>} />
      <Route path="/admin/transactions" element={<AdminPrivateRoute><AdminTransactions /></AdminPrivateRoute>} />
      <Route path="/admin/revenue-report" element={<AdminPrivateRoute><RevenueReport /></AdminPrivateRoute>} />
      <Route path="/admin/chat-history" element={<AdminPrivateRoute><AdminChatHistory /></AdminPrivateRoute>} />
      <Route path="/admin/chat/:chatId" element={<AdminPrivateRoute><AdminChatDetail /></AdminPrivateRoute>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App