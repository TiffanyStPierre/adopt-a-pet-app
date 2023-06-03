import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Browse from './pages/Browse';
import CreateListing from './pages/CreateListing';
import ForgotPassword from './pages/ForgotPassword';
import HowItWorks from './pages/HowItWorks';
import Listing from './pages/Listing';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Contact from './pages/Contact';
import Header from './components/Header';
import Footer from './components/Footer';


function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/browse' element={<Browse />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/how-it-works' element={<HowItWorks />} />
          <Route path='/:listingId' element={<Listing />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/contact/:listerId' element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
