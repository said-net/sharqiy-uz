import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Chip, IconButton, Spinner } from "@material-tailwind/react";
import Regions from '../components/regions.json';
import { setRefreshOrders } from "../managers/order.manager";
import ViewOrder from "./vieworder";
import { BiRefresh } from "react-icons/bi";
function Wait() {
    const { refresh } = useSelector(e => e.order);
    const dp = useDispatch();
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [open, setOpen] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-wait-orders`, {
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
            <div className="flex items-center justify-between w-full h-[50px] bg-white shadow-md rounded p-[0_10px] my-[20px]">
                <h1 className="text-[12px] sm:text-[14px]">YANGI BUYURTMALAR</h1>
                <IconButton className="mr-[10px] rounded-[20px] text-[20px]" onClick={() => dp(setRefreshOrders())}>
                    <BiRefresh />
                </IconButton>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !orders[0] &&
                <div className="flex items-center justify-start flex-col w-full">
                    <h1>Eslatmalar mavjud emas :-)</h1>
                </div>
            }
            {isLoad && orders[0] &&
                <div className="flex items-center justify-normal flex-col w-full bg-white p-[10px] rounded-[10px] shadow-sm">
                    {orders.map((e, i) => {
                        return (
                            <div key={i} onClick={() => setOpen(e?._id)} className={`flex items-center justify-start w-full h-[80px] flex-col ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-[0_10px] cursor-pointer`}>
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

                                        {e?.status === 'wait' && <Chip className="rounded tracking-widest text-[10px]" color="light-blue" value="Eslatma" />
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

export default Wait;