import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import Sell from "./pages/Sell";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Category from "./pages/Category";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/account" element={<PrivateRoute />}>
            <Route path="/account" element={<ProfilePage />} />
          </Route>

          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/category/:categoryName" element={<Category/>} />
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />

          <Route path="/sells" element={<PrivateRoute />}>
            <Route path="/sells" element={<Sell />} />
          </Route>

          <Route path="/edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<UpdateListing />} />
          </Route>
          
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
