import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Chip, Input, Option, Select, Spinner } from "@material-tailwind/react";
import { setRefreshOrders } from "../managers/order.manager";
import ViewOrder from "./vieworder";
import { BiRefresh, BiSearch } from "react-icons/bi";
function MyOrders() {
    const { refresh } = useSelector(e => e.order);
    const dp = useDispatch();
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [open, setOpen] = useState('');
    const [type, setType] = useState('pending')
    const [search, setSearch] = useState('')
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-my-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
            // console.log(data[0]);
            if (!ok) {
                toast.error(msg)
            } else {
                setOrders(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <div className="flex items-center justify-between w-full p-[5px] bg-white shadow-md rounded my-[10px] flex-col">
                {/* <h1 className="text-[12px] sm:text-[14px]">BUYURTMALAR</h1> */}

                <div className="flex items-center justify-center w-full mb-[10px]">
                    <Select onChange={e => setType(e)} value={type} label="Saralash">
                        <Option value="pending">Kutulmoqda</Option>
                        <Option value="reject">Rad etilgan</Option>
                        <Option value="archive">Arxivlangan</Option>
                        <Option value="success">Tekshiruvda</Option>
                        <Option value="sended">Yuborilgan</Option>
                        <Option value="delivered">Yetkazilgan</Option>
                    </Select>
                    <Button className="w-full text-[11px] flex items-center justify-center" onClick={() => dp(setRefreshOrders())}>
                        Yangilash
                        <BiRefresh />
                    </Button>
                </div>
                <div className="flex items-center justify-center w-full">
                    <Input onChange={e => setSearch(e.target.value)} value={search} icon={<BiSearch />} label="Qidiruv: ID, Raqam" />
                </div>
            </div>

            {!isLoad && <Spinner />}
            {isLoad && !orders[0] &&
                <div className="flex items-center justify-start flex-col w-full">
                    <h1>Olingan buyurtmalar mavjud emas :-(</h1>
                </div>
            }
            {isLoad && orders[0] &&
                <div className="flex items-center justify-normal flex-col w-full bg-white p-[10px] rounded-[10px] shadow-sm">
                    {orders.map((e, i) => {
                        return (
                            !search ?
                                e?.status === type && <div key={i} onClick={() => setOpen(e?._id)} className={`flex items-center justify-start w-full h-[80px] flex-col ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-[0_10px] cursor-pointer`}>
                                    <div className="flex items-center justify-between w-full border-b">
                                        <div className="flex items-start justify-start flex-col">
                                            <p className="text-[12px]">ID: {e?.id}</p>
                                            <p className="text-[12px]">{e?.phone}</p>
                                        </div>
                                        <div className="flex items-center justify-start w-[33%] sm:w-[25%]">
                                            <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden  p-[5px]">
                                                <img src={e?.image} alt="rasm" />
                                            </div>
                                            <p className="text-[12px] sm:text-[15px]">{e?.product?.title?.slice(0, 15)}...</p>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {e?.status === 'reject' && <Chip className="rounded tracking-widest text-[9px]" color="red" value="Rad etilgan" />
                                            }
                                            {e?.status === 'archive' && <Chip className="rounded tracking-widest text-[9px]" color="deep-orange" value="Arxivlangan" />
                                            }
                                            {e?.status === 'pending' && <Chip className="rounded tracking-widest text-[9px]" color="orange" value="Kutulmoqda" />
                                            }
                                            {e?.status === 'success' && <Chip className="rounded tracking-widest text-[9px]" color="blue" value="Tekshiruvda" />
                                            }
                                            {e?.status === 'sended' && <Chip className="rounded tracking-widest text-[9px]" color="indigo" value="Yuborildi" />
                                            }
                                            {e?.status === 'delivered' && <Chip className="rounded tracking-widest text-[9px]" color="green" value="Yetkazilgan" />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-start w-full">
                                        <p className="text-[12px]">{e?.created}</p>
                                    </div>
                                </div> :
                                search && (Number(search) === e?.id || e?.phone?.includes(search)) && e?.status === type && <div key={i} onClick={() => setOpen(e?._id)} className={`flex items-center justify-start w-full h-[80px] flex-col ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-[0_10px] cursor-pointer`}>
                                <div className="flex items-center justify-between w-full border-b">
                                    <div className="flex items-start justify-start flex-col">
                                        <p className="text-[12px]">ID: {e?.id}</p>
                                        <p className="text-[12px]">{e?.phone}</p>
                                    </div>
                                    <div className="flex items-center justify-start w-[33%] sm:w-[25%]">
                                        <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden  p-[5px]">
                                            <img src={e?.image} alt="rasm" />
                                        </div>
                                        <p className="text-[12px] sm:text-[15px]">{e?.product?.title?.slice(0, 15)}...</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        {e?.status === 'reject' && <Chip className="rounded tracking-widest text-[9px]" color="red" value="Rad etilgan" />
                                        }
                                        {e?.status === 'archive' && <Chip className="rounded tracking-widest text-[9px]" color="deep-orange" value="Arxivlangan" />
                                        }
                                        {e?.status === 'pending' && <Chip className="rounded tracking-widest text-[9px]" color="orange" value="Kutulmoqda" />
                                        }
                                        {e?.status === 'success' && <Chip className="rounded tracking-widest text-[9px]" color="blue" value="Tekshiruvda" />
                                        }
                                        {e?.status === 'sended' && <Chip className="rounded tracking-widest text-[9px]" color="indigo" value="Yuborildi" />
                                        }
                                        {e?.status === 'delivered' && <Chip className="rounded tracking-widest text-[9px]" color="green" value="Yetkazilgan" />
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center justify-start w-full">
                                    <p className="text-[12px]">{e?.created}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <ViewOrder open={open} setOpen={setOpen} />
        </div>
    );
}

export default MyOrders;