import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { FaBox, FaBoxesStacked, FaCalendar, FaGift, FaHouse, FaLink, FaLocationDot, FaMoneyBillTransfer, FaMoneyBillTrendUp, FaMoneyBillWave, FaPhone, FaUser, FaUsers, FaXmark } from 'react-icons/fa6';
import Regions from '../../components/regions.json'
import Cities from '../../components/cities.json'
import { toast } from "react-toastify";
import RejectOrder from "./rejectorder";
import SendedOrder from "./sendedorder";
function ViewOrder({ open, setOpen }) {
    const [isLoad, setIsLoad] = useState(false);
    const [order, setOrder] = useState({});
    const [select, setSelect] = useState({ reject: false, sended: false, id: 0, _id: '' });
    useEffect(() => {
        if (open !== '') {
            setIsLoad(false);
            axios(`${API_LINK}/boss/get-info-order/${open}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { data, ok } = res.data;
                setIsLoad(true)
                if (ok) {
                    setOrder(data);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }, [open]);
    function getCheque(id) {
        axios(`${API_LINK}/boss/get-cheque-order/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            if (!ok) {
                toast.error("Nimadir xato");
            } else {
                window.open(data)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                {!isLoad && <Spinner />}
                {isLoad && !order?._id && <p>Tarix topilmadi!</p>}
                {isLoad && order?._id &&
                    <>
                        <DialogHeader className="w-full relative">
                            <p className="text-[16px]">Buyutma uchun ID: {order?.id}</p>
                            <div className="absolute top-[-5px] right-[-5px]">
                                <IconButton onClick={()=>setOpen('')} color="blue-gray" className="rounded-full">
                                    <FaXmark/>
                                </IconButton>
                            </div>
                        </DialogHeader>
                        <DialogBody className="w-full border-y h-[500px] overflow-y-scroll">
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Mahsulot" value={order?.title} icon={<FaBox />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Miqdori" value={order?.count + ' ta'} icon={<FaBoxesStacked />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Bonus" value={'+' + order?.bonus + ' ta'} icon={<FaGift />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Jami miqdori" value={(order?.bonus + order?.count) + ' ta'} icon={<FaBoxesStacked />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Umumiy narxi" value={Number(order?.price)?.toLocaleString() + " so'm"} icon={<FaMoneyBillWave />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Oqim" value={order?.flow ? "Mavjud!" : "Mavjud emas!"} icon={<FaLink />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Viloyat" value={Regions?.find(e => e.id === order?.region).name} icon={<FaLocationDot />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Tuman/Shaxar" value={Cities?.find(e => e.id === order?.city).name} icon={<FaHouse />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Mijoz" value={order?.name} icon={<FaUser />} />
                            </div>
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Raqami" value={order?.phone} icon={<FaPhone />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Buyurtma sanasi(Kun-Oy-Yil)" value={order?.date} icon={<FaCalendar />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Admin uchun" value={Number(order?.for_admin).toLocaleString() + " so'm"} icon={<FaMoneyBillTransfer />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Operator uchun" value={Number(order?.for_operator).toLocaleString() + " so'm"} icon={<FaMoneyBillTrendUp />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input variant="standard" label="Referal uchun" value={Number(order?.for_ref).toLocaleString() + " so'm"} icon={<FaUsers />} />
                            </div>
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Textarea variant="standard" label="Batfsil" value={order?.about} icon={<FaUsers />} />
                            </div>
                        </DialogBody>
                        <DialogFooter className="w-full">
                            <Button className="rounded mr-[10px]" color="red" onClick={() => setSelect({ ...select, reject: true, id: order?.id, _id: order?._id })}>Bekor</Button>
                            <Button className="rounded mr-[10px]" color="green" onClick={() => setSelect({ ...select, sended: true, id: order?.id, _id: order?._id })}>ok</Button>
                            <Button className="rounded mr-[10px]" color="blue" onClick={() => getCheque(order?._id)}>CHEK</Button>
                        </DialogFooter>
                    </>
                }
            </div>
            <RejectOrder select={select} setSelect={setSelect} setOpen={setOpen} />
            <SendedOrder select={select} setSelect={setSelect} setOpen={setOpen} />
        </Dialog>
    );
}

export default ViewOrder;