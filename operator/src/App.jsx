import { useDispatch, useSelector } from "react-redux";
import Auth from "./components/auth";
import { useEffect } from "react";
import axios from "axios";
import { API_LINK } from "./config";
import { setInfoAuth } from "./managers/auth.manager";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import NewOrders from "./pages/neworders";
import MyOrders from "./pages/myorders";
import WaitOrders from "./pages/wiatorders";
import Settings from "./pages/settings";
import SearchOrder from "./pages/search";
import Targetologs from "./pages/targetologs";
import HistoryPay from "./pages/historypay";
function App() {
  const { id, refresh, name } = useSelector(e => e.auth);
  const dp = useDispatch();
  document.title = name ? `Operator: ${name}` : 'Kirish';
  useEffect(() => {
    axios(`${API_LINK}/operator/verify-session`, {
      headers: {
        'x-auth-token': `Bearer ${localStorage.getItem('access')}`
      }
    }).then(res => {
      const { ok, data } = res.data;
      if (ok) {
        dp(setInfoAuth(data));
      }
    })
  }, [refresh])
  if (!id) {
    return (
      <>
        <Auth />
        <ToastContainer autoClose={2000} closeButton={false} position="top-center" style={{ zIndex: '9999999' }} />
      </>
    );
  } else {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/new-orders" element={<NewOrders />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wait-orders" element={<WaitOrders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/search" element={<SearchOrder />} />
          <Route path="/targetologs" element={<Targetologs />} />
          <Route path="/history-pay" element={<HistoryPay />} />
          <Route path="*" element={<NewOrders />} />
        </Routes>
        <ToastContainer autoClose={2000} closeButton={false} position="top-center" style={{ zIndex: '9999999' }} />

      </>
    );
  }
}

export default App;