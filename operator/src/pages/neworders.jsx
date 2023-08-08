import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { BiRefresh } from 'react-icons/bi'
import { Button, IconButton, Spinner } from "@material-tailwind/react";
import Regions from '../components/regions.json';
import { setRefreshOrders } from "../managers/order.manager";
function NewOrders() {
    const { refresh } = useSelector(e => e.order);
    const dp = useDispatch();
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [isLoadBtn, setIsLoadBtn] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-new-orders`, {
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

    function Take(id) {
        setIsLoadBtn(true);
        axios.post(`${API_LINK}/operator/take-new-order/${id}`, {}, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setIsLoadBtn(false);
            if (!ok) {
                toast.error(msg);
                setTimeout(() => {
                    dp(setRefreshOrders());
                }, 1000)
            } else {
                toast.success(msg);
                setTimeout(() => {
                    dp(setRefreshOrders());
                }, 1000)
            }
        }).catch(() => {
            setIsLoadBtn(false);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!А")
        });
    }
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
                    <h1>Yangi buyurtmalar mavjud emas :-(</h1>
                </div>
            }
            {isLoad && orders[0] &&
                <div className="flex items-center justify-normal flex-col w-full bg-white p-[10px] rounded-[10px] shadow-sm">
                    {orders.map((e, i) => {
                        return (
                            <div key={i} className={`flex items-center justify-between w-full h-[50px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-[0_10px] `}>
                                <div className="flex items-center justify-start w-[33%] sm:w-[25%]">
                                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden  p-[5px]">
                                        <img src={e?.image} alt="rasm" />
                                    </div>
                                    <p className="text-[12px] sm:text-[15px]">{e?.product?.title?.slice(0, 15)}...</p>
                                </div>
                                <div className="hidden sm:flex items-center justify-start w-[25%]">
                                    <p>{Regions.find(r => r.id === e?.region)?.name}</p>
                                </div>
                                {/* <div className="flex items-center justify-start w-[25%]">
                                    <p>{e?.name}</p>
                                </div> */}
                                <div className="flex items-center justify-center w-[10%]">
                                    <p>~{Number(e?.comming_pay).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center justify-center">
                                    <Button className="rounded" color="red" disabled={isLoadBtn} onClick={() => Take(e.id)}>Olish</Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default NewOrders;