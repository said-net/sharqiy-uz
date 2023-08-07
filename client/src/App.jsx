import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Categories from "./pages/categories";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetProductsByCategory from "./pages/getbycategory";
import Product from "./pages/product";
import Profile from "./user/profile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { API_LINK } from "./config";
import { setInformations } from "./managers/authManager";
import Settings from "./user/settings";
import VideoPlayers from "./pages/video";
import Search from './pages/search'
import Chat from "./pages/chat";
import Home from "./pages/home";
import AdminNavbar from "./admin/navbar";
import NotAuth from "./user/notauth";
import AdminMain from "./admin/main";
import AdminMarket from "./admin/market";
import Flow from "./pages/flow";
import Refferer from "./pages/ref";
import AdminStats from "./admin/stats";
import AdminRefs from "./admin/refs";

function App() {
  const { refresh, id } = useSelector(e => e.auth);
  const dp = useDispatch()
  const { pathname } = useLocation();
  useEffect(() => {
    axios(`${API_LINK}/user/verify-auth`, {
      headers: {
        'x-user-token': `Bearer ${localStorage.getItem('access')}`
      }
    }).then(res => {
      const { ok, data } = res.data;
      if (ok) {
        dp(setInformations(data))
      }
    })
  }, [refresh]);
  return (
    <>
      {!pathname.includes('/dashboard') &&
        <>
          <Navbar />
          <Routes>
            <Route path="/categories" element={<Categories />} />
            <Route path="/get-by-category/:id" element={<GetProductsByCategory />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/flow/:flow/:id" element={<Flow />} />
            <Route path="/videos" element={<VideoPlayers />} />
            <Route path="/search/:search" element={<Search />} />
            {/*  */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/messanger" element={<Chat />} />
            <Route path="/ref/:id" element={<Refferer />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <ToastContainer position="top-center" autoClose={2000} closeButton={false} style={{ zIndex: '9999999999' }} />
        </>}
      {pathname.includes('/dashboard') &&
        <>
          {!id ? <NotAuth /> :
            <>
              <AdminNavbar />
              <Routes>
                <Route path="/dashboard" element={<AdminMain />} />
                <Route path="/dashboard/market" element={<AdminMarket />} />
                <Route path="/dashboard/stats" element={<AdminStats />} />
                <Route path="/dashboard/refs" element={<AdminRefs />} />
              </Routes>
              <ToastContainer position="top-center" autoClose={2000} closeButton={false} style={{ zIndex: '9999999999' }} />
            </>
          }
        </>
      }
    </>
  );
}

export default App;