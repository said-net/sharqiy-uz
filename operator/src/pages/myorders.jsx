import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Chip, IconButton, Option, Select, Spinner } from "@material-tailwind/react";
import { setRefreshOrders } from "../managers/order.manager";
import ViewOrder from "./vieworder";
import { BiRefresh } from "react-icons/bi";
function MyOrders() {
    const { refresh } = useSelector(e => e.order);
    const dp = useDispatch();
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [open, setOpen] = useState('');
    const [type, setType] = useState('pending')
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-my-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
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
            <div className="flex items-center justify-between w-full h-[50px] bg-white shadow-md rounded p-[0_10px] my-[10px]">
                {/* <h1 className="text-[12px] sm:text-[14px]">BUYURTMALAR</h1> */}
                <div className="flex items-center justify-center">
                    <Select onChange={e => setType(e)} value={type} label="Saralash">
                        <Option value="pending">Kutulmoqda</Option>
                        <Option value="reject">Rad etilgan</Option>
                        <Option value="archive">Arxivlangan</Option>
                        <Option value="success">Tekshiruvda</Option>
                        <Option value="sended">Yuborilgan</Option>
                        <Option value="delivered">Yetkazilgan</Option>
                    </Select>
                </div>
                <IconButton className="mr-[10px] rounded-[20px] text-[20px]" onClick={() => dp(setRefreshOrders())}>
                    <BiRefresh />
                </IconButton>
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
                            e?.status === type && <div key={i} onClick={() => setOpen(e?._id)} className={`flex items-center justify-between w-full h-[50px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-[0_10px] cursor-pointer`}>
                                <div className="flex items-center justify-start w-[33%] sm:w-[25%]">
                                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden  p-[5px]">
                                        <img src={e?.image} alt="rasm" />
                                    </div>
                                    <p className="text-[12px] sm:text-[15px]">{e?.product?.title?.slice(0, 15)}...</p>
                                </div>
                                <div className="flex items-center justify-center">
                                    {e?.status === 'reject' && <Chip className="rounded tracking-widest" color="red" value="Rad etilgan" />
                                    }
                                    {e?.status === 'archive' && <Chip className="rounded tracking-widest" color="deep-orange" value="Arxivlangan" />
                                    }
                                    {e?.status === 'pending' && <Chip className="rounded tracking-widest" color="orange" value="Kutulmoqda" />
                                    }
                                    {e?.status === 'success' && <Chip className="rounded tracking-widest" color="blue" value="Tekshiruvda" />
                                    }
                                    {e?.status === 'sended' && <Chip className="rounded tracking-widest" color="indigo" value="Yuborildi" />
                                    }
                                    {e?.status === 'delivered' && <Chip className="rounded tracking-widest" color="green" value="Yetkazilgan" />
                                    }
                                </div>
                                <div className="flex items-center justify-end w-[20%]">
                                    {e?.status === 'reject' && <s className="text-red-500">{Number(e?.comming_pay).toLocaleString()}</s>
                                    }
                                    {e?.status === 'archive' && <s className="text-red-500">{Number(e?.comming_pay).toLocaleString()}</s>
                                    }
                                    {e?.status === 'pending' && <p className="text-blue-500">~{Number(e?.comming_pay).toLocaleString()}</p>
                                    }
                                    {e?.status === 'success' && <p className="text-blue-500">~{Number(e?.comming_pay).toLocaleString()}</p>
                                    }
                                    {e?.status === 'sended' && <p className="text-indigo-500">~{Number(e?.comming_pay).toLocaleString()}</p>
                                    }
                                    {e?.status === 'delivered' && <p className="text-green-500">+{Number(e?.comming_pay).toLocaleString()}</p>
                                    }
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