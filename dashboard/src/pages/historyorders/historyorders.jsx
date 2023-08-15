import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { FaPhone, FaSearch, FaThList } from "react-icons/fa";
import { FaBars, FaCheck, FaXmark } from "react-icons/fa6";

function HistoryOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.order);
    const [search, setSearch] = useState('');
    const [openOperator, setOpenOperator] = useState({ phone: '', name: '', id: '' })
    function getChequeOrder(id) {
        axios(`${API_LINK}/boss/get-cheque-order/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { data, ok } = res.data;
            if (ok) {
                window.open(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }
    useEffect(() => {
        setIsLoad(false);
        setOrders([]);
        setSearch('');
        axios(`${API_LINK}/boss/get-history-orders`, {
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
            {isLoad && !search && orders[0] &&
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
                                {/*  */}
                                {o?.status === 'reject' && <p className="w-[40%] md:w-[20%] text-[12px] md:text-[15px] text-end text-red-500"><s>Narx: {Number(o?.price).toLocaleString()} so'm</s></p>}
                                {/*  */}
                                {o?.status === 'sended' && <p className="w-[40%] md:w-[20%] text-[12px] md:text-[15px] text-end text-blue-500">Narx: ~{Number(o?.price).toLocaleString()} so'm</p>}
                                {/*  */}
                                {o?.status === 'delivered' && <p className="w-[40%] md:w-[20%] text-[12px] md:text-[15px] text-end text-green-500">Narx: +{Number(o?.price).toLocaleString()} so'm</p>}
                                <Menu>
                                    <MenuHandler>
                                        <IconButton className="rounded-full" color="blue-gray">
                                            <FaBars />
                                        </IconButton>
                                    </MenuHandler>
                                    <MenuList>
                                        <MenuItem className="flex items-center" onClick={() => getChequeOrder(o?._id)}>
                                            <FaThList className="mr-[10px]" />
                                            Chek
                                        </MenuItem>
                                        <MenuItem className="flex items-center" onClick={() => setOpenOperator({ name: o?.operator_name, phone: o?.operator_phone, id: o?.id })}>
                                            <FaPhone className="mr-[10px]" />
                                            Operator
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>
                        )
                    })}
                </div>
            }
            {isLoad && search && orders[0] &&
                <div className="flex items-center justify-start flex-col w-full bg-white shadow-sm p-[5px]">
                    {orders?.map((o, i) => {
                        return (
                            String(o?.id).includes(search) && <div key={i} onClick={() => setOpen(o?._id)} className={`flex items-center justify-between w-full p-[0_10px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-200'} shadow-sm h-[50px] cursor-pointer`}>
                                <div className="flex items-center justify-center">
                                    <p className="mr-[10px] text-[12px] md:text-[15px]">ID: {o?.id}</p>
                                    <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border overflow-hidden">
                                        <img src={o?.image} alt="rasm" />
                                    </div>
                                    <p className="text-[12px] md:text-[16px]">{o?.title?.slice(0, 12)}...</p>
                                </div>
                                <p className="w-[20%] hidden md:inline">Miqdor: {o?.count} ta</p>
                                <p className="w-[20%] hidden md:inline">Bonus: +{o?.bonus} ta</p>
                                {/*  */}
                                {o?.status === 'reject' && <p className="w-[40%] md:w-[20%] text-[12px] md:text-[15px] text-end text-red-500"><s>Narx: {Number(o?.price).toLocaleString()} so'm</s></p>}
                                {/*  */}
                                {o?.status === 'sended' && <p className="w-[40%] md:w-[20%] text-[12px] md:text-[15px] text-end text-blue-500">Narx: ~{Number(o?.price).toLocaleString()} so'm</p>}
                                {/*  */}
                                {o?.status === 'delivered' && <p className="w-[40%] md:w-[20%] text-[12px] md:text-[15px] text-end text-green-500">Narx: +{Number(o?.price).toLocaleString()} so'm</p>}
                                <Menu>
                                    <MenuHandler>
                                        <IconButton className="rounded-full" color="blue-gray">
                                            <FaBars />
                                        </IconButton>
                                    </MenuHandler>
                                    <MenuList>
                                        <MenuItem className="flex items-center" onClick={() => getChequeOrder(o?._id)}>
                                            <FaThList className="mr-[10px]" />
                                            Chek
                                        </MenuItem>
                                        <MenuItem className="flex items-center" onClick={() => setOpenOperator({ name: o?.operator_name, phone: o?.operator_phone, id: o?.id })}>
                                            <FaPhone className="mr-[10px]" />
                                            Operator
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>
                        )
                    })}
                </div>
            }
            <Dialog open={openOperator?.name !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <p>#{openOperator?.id} ID buyurtma uchun Operator</p>
                    </DialogHeader>
                    <DialogBody className="border-y w-full">
                        <p className="text-black">Ismi: {openOperator?.name}</p>
                        <p className="text-black">Raqami: {openOperator?.phone}</p>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setOpenOperator({ phone: '', name: '', id: '' })} className="rounded" color="orange">Yopish</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </div>
    );
}

export default HistoryOrders;