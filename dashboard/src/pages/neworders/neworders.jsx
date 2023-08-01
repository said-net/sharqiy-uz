import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";

function NewOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.order)
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
                orders?.map((o, i) => {
                    return (
                        <div key={i} className="flex items-center justify-between w-full p-[0_10px] rounded bg-white shadow-sm hover:shadow-md h-[50px] mb-[10px]">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border overflow-hidden">
                                    <img src={o?.image} alt="rasm" />
                                </div>
                                <p>{o?.product?.title?.slice(0, 12)}...</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default NewOrders;