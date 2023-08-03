import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { FaBars, FaCheck, FaXmark } from "react-icons/fa6";

function SendedOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.order);
    const [search, setSearch] = useState('');
    const [select, setSelect] = useState({ reject: false, delivered: false });
    useEffect(() => {
        if (!search) {
            setIsLoad(false);
            setOrders([]);
            axios(`${API_LINK}/boss/get-sended-orders`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { data, ok } = res.data;
                setIsLoad(true)
                if (ok) {
                    setOrders(data);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            });
        }
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[10px]">
            <div className="flex items-center justify-between w-full h-[70px] bg-white mb-[10px] shadow-sm p-[0_10px]">
                <div className="flex items-center justify-center w-[200px] ">
                    <Input type="search" value={search} onChange={e => setSearch(e.target.value)} label="Qidiruv: ID" icon={<FaSearch />} />
                </div>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !orders[0] && <h1>Buyurtmalar yuborilmagan!</h1>}
            {isLoad && orders[0] && !search &&
                <div className="flex items-center justify-start flex-col w-full bg-white shadow-sm p-[5px]">
                    {orders?.map((o, i) => {
                        return (
                            <div key={i} onClick={() => setOpen(o?._id)} className={`flex items-center justify-between w-full p-[0_10px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-200'} shadow-sm h-[50px] cursor-pointer`}>
                                <div className="flex items-center justify-center">
                                    <p className="mr-[10px] text-[12px] md:text-[15px]">ID: {o?.id}</p>
                                    <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border overflow-hidden">
                                        <img src={o?.image} alt="rasm" />
                                    </div>
                                    <p className="text-[12px] md:text-[16px]">{o?.title?.slice(0, 12)}...</p>
                                </div>
                                <p className="w-[20%] hidden md:inline">Miqdor: {o?.count} ta</p>
                                <p className="w-[20%] hidden md:inline">Bonus: +{o?.bonus} ta</p>
                                <p className="w-[40%] md:w-[20%] text-[12px] md:text-[15px] text-end">Narx: {Number(o?.price).toLocaleString()} so'm</p>
                                <Menu>
                                    <MenuHandler>
                                        <IconButton className="rounded-full" color="blue-gray">
                                            <FaBars />
                                        </IconButton>
                                    </MenuHandler>
                                    <MenuList>
                                        <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, reject: true, id: o?._id })}>
                                            <FaCheck className="mr-[10px]" />
                                            Yetgazildi
                                        </MenuItem>
                                        <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, delivered: true, id: o?._id })}>
                                            <FaXmark className="mr-[10px]" />
                                            Qaytarildi
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default SendedOrders;