import { useEffect } from "react";
import Auth from "./components/auth";
import axios from "axios";
import { API_LINK } from "./config";
import { useSelector, useDispatch } from "react-redux";
import { setInfoAuth } from "./managers/auth.manager";
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import Categories from "./pages/categories/categories";
import BgPic from './assets/bg.png'
import Posts from "./pages/posts/posts";
function App() {
  const { refresh, phone } = useSelector(e => e.auth);
  const dp = useDispatch()
  useEffect(() => {
    axios(`${API_LINK}/boss/verify`, {
      headers: {
        'x-auth-token': `Bearer ${localStorage.getItem('access')}`
      }
    }).then((res) => {
      const { ok, data } = res.data;
      if (ok) {
        dp(setInfoAuth(data));
      }
    })
  }, [refresh]);
  if (!phone) {
    return (
      <>
        <Auth />
      </>
    );
  } else {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/categories" element={<Categories />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
        <img src={BgPic} alt="BG" className="fixed bottom-0 left-0 z-[-1] opacity-10 w-full" />
      </>
    );
  }
}

export default App;