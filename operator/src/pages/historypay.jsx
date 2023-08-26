import { Chip, IconButton, Popover, PopoverContent, PopoverHandler, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { FaQuestionCircle } from "react-icons/fa";

function HistoryPay() {
    const [isLoad, setIsLoad] = useState(false);
    const [pays, setPays] = useState([]);
    const [refresh, setRefresh] = useState(true);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-pays`, {
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
                setPays(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[10px]">
            {!isLoad && <Spinner />}
            {isLoad && !pays[0] && <p>Tarix mavjud emas!</p>}
            {isLoad && pays[0] &&
                pays?.map((p, i) => {
                    return (
                        <div key={i} className="flex items-center justify-start flex-col w-full p-[10px] bg-white mb-[10px]">
                            <div className="flex items-center justify-between w-full bg-white border-b pb-[5px] mb-[5px]">
                                <p className={p?.count > 0 ? 'text-green-500' : 'text-red-500'}>{p?.count > 0 ? '+' + p?.count : p?.count}</p>
                                {p?.count > 0 && <Chip className="rounded" value="Qo'shilgan" />}
                                {p?.count < 0 && <Chip color="red" className="rounded" value="Yechilgan" />}
                                <Popover>
                                    <PopoverHandler>
                                        <IconButton className="w-[20px] h-[20px] rounded-full">
                                            <FaQuestionCircle className="text-white" />
                                        </IconButton>
                                    </PopoverHandler>
                                    <PopoverContent className="z-[999]">
                                        <p>Batafsil: {p?.comment}</p>
                                        {p?.card && <p>Karta: {p?.card}</p>}
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <p className="text-[12px] w-full">{p?.created}</p>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default HistoryPay;