import { useEffect } from "react";
import Auth from "./components/auth";
import axios from "axios";
import { API_LINK } from "./config";
import { useSelector, useDispatch } from "react-redux";
import { setInfoAuth } from "./managers/auth.manager";
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import Categories from "./pages/categories/categories";
import Products from "./pages/products/products";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./pages/dashboard/dashboard";
import Operator from "./pages/operator/operator";
import Settings from "./pages/settings/settings";
import NewOrders from "./pages/neworders/neworders";
import SendedOrders from "./pages/sendedorders/sendedorders";
import HistoryOrders from "./pages/historyorders/historyorders";
import WaitOrders from "./pages/waitorders/waitorders";
import Chats from "./pages/chat/chats";
import SelectChat from "./pages/chat/selectchat";
import MenuSettings from "./pages/main/mainmenu";
import Competition from "./pages/competition/competition";
import CompetitionGetOne from "./pages/competition/getone";
import OperatorPays from "./pages/operatorpays/operatorpays";

function App() {
  const { refresh, phone } = useSelector(e => e.auth);
  const dp = useDispatch();
  document.title = phone ? `Ega: ${phone}` : 'Kirish';
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
          <Route path="/products" element={<Products />} />
          <Route path="/operators" element={<Operator />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-orders" element={<NewOrders />} />
          <Route path="/sended-orders" element={<SendedOrders />} />
          <Route path="/history-orders" element={<HistoryOrders />} />
          <Route path="/wait-orders" element={<WaitOrders />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/select-chat/:id" element={<SelectChat />} />
          <Route path="/main-menu" element={<MenuSettings />} />
          <Route path="/operator-pays" element={<OperatorPays />} />
          <Route path="/competition" element={<Competition />} />
          <Route path="/get-competition-one/:id" element={<CompetitionGetOne />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
        {/* <img src={BgPic} alt="BG" className="fixed bottom-0 left-0 z-[-1] opacity-10 w-full" /> */}
        <ToastContainer position="top-center" autoClose={2000} closeButton={false} style={{ zIndex: '9999999999' }} />
      </>
    );
  }
}

export default App;
