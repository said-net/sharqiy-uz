import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Categories from "./pages/categories";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetProductsByCategory from "./pages/getbycategory";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/categories" element={<Categories />} />
        <Route path="/get-by-category/:id" element={<GetProductsByCategory />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} closeButton={false} style={{ zIndex: '9999999999' }} />
    </>
  );
}

export default App;