import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Chip, Spinner } from "@material-tailwind/react";
import Regions from '../components/regions.json';
import { setRefreshOrders } from "../managers/order.manager";
import ViewOrder from "./vieworder";
function MyOrders() {
    const { refresh } = useSelector(e => e.order);
    const dp = useDispatch();
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [open, setOpen] = useState('');
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
            <h1 className="bg-white p-[10px_20px] rounded-[0_0_10px_10px] text-[20px] mb-[20px]">MENING BUYURTMALARIM</h1>
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
                            <div key={i} onClick={() => setOpen(e?._id)} className={`flex items-center justify-between w-full h-[50px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-[0_10px] cursor-pointer`}>
                                <div className="flex items-center justify-start w-[33%] sm:w-[25%]">
                                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden  p-[5px]">
                                        <img src={e?.image} alt="rasm" />
                                    </div>
                                    <p className="text-[12px] sm:text-[15px]">{e?.product?.title?.slice(0, 15)}...</p>
                                </div>
                                <div className="flex items-center justify-center">
                                    {e?.status === 'reject' && <Chip className="rounded tracking-widest" color="red" value="Rad etilgan" />
                                    }
                                    {e?.status === 'pending' && <Chip className="rounded tracking-widest" color="blue" value="Kutulmoqda" />
                                    }
                                    {e?.status === 'success' && <Chip className="rounded tracking-widest" color="blue" value="Yuborilgan" />
                                    }
                                    {e?.status === 'delivered' && <Chip className="rounded tracking-widest" color="green" value="Yetkazilgan" />
                                    }
                                </div>
                                <div className="flex items-center justify-end w-[20%]">
                                    {e?.status === 'reject' && <s className="text-red-500">{Number(e?.comming_pay).toLocaleString()}</s>
                                    }
                                    {e?.status === 'pending' && <p className="text-blue-500">~{Number(e?.comming_pay).toLocaleString()}</p>
                                    }
                                    {e?.status === 'success' && <p className="text-blue-500">~{Number(e?.comming_pay).toLocaleString()}</p>
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