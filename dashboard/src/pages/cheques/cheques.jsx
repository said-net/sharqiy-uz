import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";

function Cheques() {
    const [cheques, setCheques] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-all-cheques`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setCheques(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urinib ko'ring!")
        })
    }, []);
    return (
        <div className="flex items-center justify-center w-full flex-col p-[10px]">
            {!isLoad && <Spinner />}
            {isLoad && !cheques[0] && <p>Yangi cheklar mavjud emas!</p>}
            {isLoad && cheques[0] &&
                <div className="grid grid-cols-2 gap-[5px]">
                    {cheques?.map((c, i) => {
                        return (
                            <div className="flex items-start justify-start flex-col p-[10px] w-[9cm] h-[9.03cm] bg-white border border-black" key={i}>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">ID: {c?.id} | {c?.date}</p>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">Mijoz: {c?.name} | {c?.phone}</p>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">Maxsulot: {c?.title}</p>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">Miqdori: {c?.count} ta | Bonus: +{c?.bonus} ta</p>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">Manzil: {c?.location}</p>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">Izoh: {c?.about}</p>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">Operator: {c?.operator_name} | {c?.operator_phone}</p>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">Call markaz: +998339306464</p>
                                <p className="py-[6px] border-b border-black w-full text-[12px]">Narxi: {Number(c?.price)?.toLocaleString()} so'm | Dostavka: {Number(c?.delivery_price)?.toLocaleString()} so'm</p>
                                {/* <p className="py-[6px] border-b border-black w-full text-[12px]"></p> */}
                                <p className="py-[10px] w-full text-[12px]">Umumiy narx: {Number(c?.delivery_price + c?.price)?.toLocaleString()} so'm</p>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default Cheques;