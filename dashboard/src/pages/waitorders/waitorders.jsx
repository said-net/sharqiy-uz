import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { Button, Dialog, DialogFooter, DialogHeader, Spinner } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshOrder } from "../../managers/order.manager";

function WaitOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.order);
    const [open, setOpen] = useState(false);
    const dp = useDispatch()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-wait-orders`, {
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
    function Submit() { 
        axios.post(`${API_LINK}/boss/set-status-to-new`, { }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setOpen(false);
                dp(setRefreshOrder());
            }
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[10px]">
            {!isLoad && <Spinner />}
            {isLoad && !orders[0] && <h1>Eslatma buyurtmalar mavjud emas!</h1>}
            {isLoad && orders[0] &&
                <div className="flex items-center justify-start flex-col w-full bg-white shadow-sm p-[5px]">
                    <div className="flex items-center justify-end w-full h-[50px]">
                        <Button onClick={() => setOpen(true)} className="rounded" color="blue-gray">Yangilarga o'tkazish</Button>
                    </div>
                    {orders?.map((o, i) => {
                        return (
                            <div key={i} className={`flex items-center justify-between w-full p-[0_10px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-200'} shadow-sm h-[50px] cursor-pointer`}>
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
            <Dialog size="xl" open={open}>
                <DialogHeader>
                    <p>Barcha eslatmalar yangi buyurtmalar qatoriga o'tkazilsinmi?</p>
                </DialogHeader>
                <DialogFooter>
                    <Button color="blue-gray" className="rounded mr-[10px]" onClick={() => setOpen(false)}>Ortga</Button>
                    <Button color="blue" className="rounded" onClick={Submit}>O'tkazish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default WaitOrders;