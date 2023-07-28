import { Route, Routes } from "react-router-dom";
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

function App() {
  const { refresh } = useSelector(e => e.auth);
  const dp = useDispatch()
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
    <div>
      <Navbar />
      <Routes>
        <Route path="/categories" element={<Categories />} />
        <Route path="/get-by-category/:id" element={<GetProductsByCategory />} />
        <Route path="/product/:id" element={<Product />} />
        {/*  */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} closeButton={false} style={{ zIndex: '9999999999' }} />
    </div>
  );
}

export default App;