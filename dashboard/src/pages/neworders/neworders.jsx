import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import ViewOrder from "./view";

function NewOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.order);
    const [open, setOpen] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-new-orders`, {
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
        })
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[10px]">
            {!isLoad && <Spinner />}
            {isLoad && !orders[0] && <h1>Yangi buyurtmalar mavjud emas!</h1>}
            {isLoad && orders[0] &&
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