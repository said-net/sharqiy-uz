import { Dialog, DialogBody, DialogHeader, Spinner, Input, DialogFooter, Button } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { FaBox, FaClock, FaIdCard, FaMoneyBill, FaPhone, FaTaxi } from "react-icons/fa";
import { FaCircleCheck, FaMoneyBillTransfer, FaXmark } from "react-icons/fa6";

function OperatorStats({ open, setOpen }) {
    const [type, setType] = useState('');
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState({});
    useEffect(() => {
        if (open !== '') {
            console.log('ok');
            setIsLoad(false);
            axios(`${API_LINK}/boss/get-operator-stats/${open}/${type}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data, msg } = res.data;
                setIsLoad(true);
                if (!ok) {
                    toast.error(msg);
                } else {
                    setState(data)
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            });
        }
    }, [type]);

    useEffect(() => {
        if (open !== '') {
            setType('all')
        } else {
            setType('');
        }
    }, [open])
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px] flex">Operator: {!isLoad ? <Spinner /> : state?.name}</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y overflow-y-scroll h-[500px]">
                    <div className="flex items-center justify-between w-full">
                        <p className={`${type === 'all' ? 'text-black underline' : 'text-gray-500'} cursor-pointer`} onClick={() => setType('all')}>Barchasi</p>

                        <p className={`${type === 'month' ? 'text-black underline' : 'text-gray-500'} cursor-pointer`} onClick={() => setType('month')}>Shu oy</p>

                        <p className={`${type === 'last_month' ? 'text-black underline' : 'text-gray-500'} cursor-pointer`} onClick={() => setType('last_month')}>O'tgan oy</p>

                        <p className={`${type === 'today' ? 'text-black underline' : 'text-gray-500'} cursor-pointer`} onClick={() => setType('today')}>Bugun</p>

                        <p className={`${type === 'yesterday' ? 'text-black underline' : 'text-gray-500'} cursor-pointer`} onClick={() => setType('yesterday')}>Kecha</p>
                    </div>
                    {!isLoad && <Spinner />}
                    {isLoad && !state?.name && <p>Operator topilmadi!</p>}
                    {isLoad && state?.name &&
                        <div className="flex items-center justify-start flex-col w-full border-t">
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"ID"} value={state?.id} icon={<FaIdCard />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"Raqami"} value={state?.phone} icon={<FaPhone />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"Rad etilgan sotuvlar"} value={state?.reject + ' ta'} icon={<FaXmark />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"Keyin oladi sotuvlari"} value={state?.wait + ' ta'} icon={<FaClock />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"Dostavkaga tayyor"} value={state?.success + ' ta'} icon={<FaBox />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"Yetkazilmoqda"} value={state?.sended + ' ta'} icon={<FaTaxi />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"Yetkazilgan"} value={state?.delivered + ' ta'} icon={<FaCircleCheck />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"Operator uchun"} value={Number(state?.profit).toLocaleString() + ' so\'m'} icon={<FaMoneyBill />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full my-[10px]">
                                <Input variant="standard" label={"Kompaniya uchun"} value={Number(state?.company_profit).toLocaleString() + ' so\'m'} icon={<FaMoneyBillTransfer />} />
                            </div>
                        </div>
                    }
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button className="rounded" color="orange" onClick={() => setOpen('')}>Yopish</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default OperatorStats;