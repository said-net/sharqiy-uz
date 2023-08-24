import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { IconButton, Option, Select, Spinner } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import ViewOrder from "./view";
import { setRefreshOrder } from "../../managers/order.manager";
import { BiRefresh } from "react-icons/bi";
import Regions from '../../components/regions.json'
function NewOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.order);
    const [open, setOpen] = useState('');
    const dp = useDispatch();
    const [region, setRegion] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-new-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { data, ok } = res.data;
            console.log(data[0]);
            setIsLoad(true)
            if (ok) {
                setOrders(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[10px]">
            <div className="flex items-center justify-between w-full h-[50px] bg-white shadow-md rounded p-[0_10px]">
                <div className="flex items-center justify-center w-[250px]">
                    <Select value={region} onChange={e => setRegion(e)} label="Viloyat bo'yicha saralov">
                        {Regions?.map((e, i) => {
                            return (
                                <Option value={e?.id} key={i}>{e.name}</Option>
                            )
                        })}
                    </Select>
                </div>
                <IconButton className=" rounded-[20px] text-[20px]" onClick={() => dp(setRefreshOrder())}>
                    <BiRefresh />
                </IconButton>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !orders[0] && <h1>Yangi buyurtmalar mavjud emas!</h1>}
            {isLoad && orders[0] &&
                <div className="flex items-center justify-start flex-col w-full bg-white shadow-sm p-[5px]">
                    {orders?.filter(e =>  !region ? e : e?.region === +region )?.map((o, i) => {
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
                            </div>
                        )
                    })}
                </div>
            }
            <ViewOrder open={open} setOpen={setOpen} />
        </div>
    );
}

export default NewOrders;