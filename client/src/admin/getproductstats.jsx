import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { FaBoxes, FaEye, FaNewspaper, FaTaxi } from "react-icons/fa";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { FaCircleCheck } from "react-icons/fa6";

function AdminProductStats() {
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { uId } = useSelector(e => e.auth);
    const [openFlow, setOpenFlow] = useState({ id: '', title: '' });

    useEffect(() => {
        axios(`${API_LINK}/product/get-stats-for-admins`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { data, ok } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib koring!")
        });
    }, []);

    function getAds(id) {
        axios(`${API_LINK}/product/get-ads-post/${id}`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg)
            }
        }).catch(err => {
            console.log(err);
            toast.error("Aloqani tekshirib qayta urunib koring!")
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-[0_10px]">
            <Link to={`/dashboard`} className="w-full underline">Ortga</Link>
            {/*  */}
            {isLoad && state[0] &&
                <div className="grid grid-cols-2 gap-[10px] my-[10px]">
                    {state?.map((p, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start flex-col w-[172px] h-[470px] p-[3px] bg-white shadow-md rounded relative">
                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div className="flex items-center justify-center w-full overflow-hidden h-[190px]">
                                    <img src={p?.image} alt="r" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full">
                                    <p className="w-full p-[0_2%] my-[10px]">
                                        {p?.title?.slice(0, 15) + '...'}
                                    </p>
                                    {/* stats */}
                                    <p className="flex items-center justify-start text-[13px]"><FaEye className="mr-[5px]" />Tashriflar: {p?.views} ta</p>

                                    <p className="flex items-center justify-start text-[13px]"><FaNewspaper className="mr-[5px]" />Yangi: {p?.pending} ta</p>

                                    <p className="flex items-center justify-start text-[13px]"><FaBoxes className="mr-[5px]" />Tayyor: {p?.success} ta</p>

                                    <p className="flex items-center justify-start text-[13px]"><FaTaxi className="mr-[5px]" />Yuborildi: {p?.sended} ta</p>

                                    <p className="flex items-center justify-start text-[13px]"><FaCircleCheck className="mr-[5px]" />Yetkazildi: {p?.delivered} ta</p>

                                    {/*  */}
                                    <div className="flex items-center justify-start w-full h-[20px]">
                                        {p?.old_price &&
                                            <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> <span className="text-[red]">-{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                        }
                                    </div>
                                    <p className=" w-full p-[0_2%] font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                    {/*  */}
                                    <div className="w-full h-[1px] bg-blue-gray-100"></div>
                                    <p className="text-[12px]">To'lov: <span className="text-[15px]">{Number(p?.for_admins).toLocaleString()} s'om</span></p>
                                    {/*  */}
                                    <span className="w-full h-[30px] border-[2px] rounded border-green-500 flex items-center justify-center uppercase tracking-[2px] mb-[10px]" onClick={() => setOpenFlow({ id: p?.id, title: p?.title })}>
                                        Oqim
                                    </span>
                                    {/*  */}
                                    <span className="w-full h-[30px] rounded bg-green-500 flex items-center justify-center uppercase tracking-[1px] mb-[10px] text-white shadow-md" onClick={() => getAds(p?.id)}>
                                        Reklama posti
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <Dialog open={openFlow?.id !== ''} className="p-[5px]">
                <DialogHeader>
                    <h1 className="text-[14px]">{openFlow?.title}</h1>
                </DialogHeader>
                <DialogBody className="border-y">
                    <Input label="Siz uchun oqim" disabled value={`https://sharqiy.uz/flow/${uId}/${openFlow.id}`} />
                </DialogBody>
                <DialogFooter>
                    <Button color="orange" className="rounded" onClick={() => setOpenFlow({ id: '', title: '' })}>Yopish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default AdminProductStats;