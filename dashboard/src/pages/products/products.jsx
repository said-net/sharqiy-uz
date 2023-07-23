import { Button, IconButton, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaSearch } from 'react-icons/fa'
import AddProduct from "./addnew";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
function Products() {
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [products, setProducts] = useState([]);
    const { refresh } = useSelector(e => e.product);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/product/getall-from-admin`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg, data } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setProducts(data);
            }
        }).catch(() => {
            setIsLoad(false);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }, [refresh]);
    
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <div className="flex items-center justify-between w-full my-[10px] bg-white rounded-[10px] shadow-md h-[75px] border p-[0_10px]">
                <div className="flex items-center justify-center w-[200px] md:w-[400px] ">
                    <Input label="Qidirish: Nomi" value={search} onChange={e => setSearch(e.target.value)} icon={<FaSearch />} />
                </div>
                <Button onClick={() => setOpenAdd(true)} className="hidden sm:inline-block rounded">Yangi qo'shish</Button>
                <IconButton onClick={() => setOpenAdd(true)} className="sm:hidden inline-block rounded-full text-[20px]">
                    <FaPlusCircle />
                </IconButton>
                <AddProduct open={openAdd} setOpen={setOpenAdd} />
            </div>
        </div>
    );
}

export default Products;