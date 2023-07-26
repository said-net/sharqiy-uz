import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Categories from "./pages/categories";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetProductsByCategory from "./pages/getbycategory";
import Product from "./pages/product";
import Profile from "./profile/profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/categories" element={<Categories />} />
        <Route path="/get-by-category/:id" element={<GetProductsByCategory />} />
        <Route path="/product/:id" element={<Product />} />
        {/*  */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} closeButton={false} style={{ zIndex: '9999999999' }} />
    </>
  );
}

export default App;