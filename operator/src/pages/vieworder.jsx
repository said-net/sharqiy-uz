import { Dialog, DialogBody, DialogHeader, Input, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { FaBox, FaMoneyBill } from 'react-icons/fa6'
function ViewOrder({ open, setOpen }) {
    const [order, setOrder] = useState({});
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        if (open !== '') {
            axios(`${API_LINK}/operator/get-info-order/${open}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data, msg } = res.data;
                console.log(data);
                setIsLoad(true);
                if (!ok) {
                    toast.error(msg)
                } else {
                    setOrder(data);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!");
            })
        }
    }, [open]);
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#0000005b] backdrop-blur-sm">
            <div className="flex items-center justify-center w-[500px] bg-white shadow-sm  rounded flex-col p-[5px]">
                {!isLoad &&
                    <div className="flex items-center justify-center w-full">
                        <Spinner />
                        <p>KUTING...</p>
                    </div>
                }
                {isLoad && !order?.id && <p>Tarix mavjud emas!</p>}
                {isLoad && order?.id &&
                    <>
                        <DialogHeader className="w-full">
                            <h1 className="text-[16px]">Buyurtma uchun ID: {order?.id}</h1>
                        </DialogHeader>
                        <DialogBody className="w-full border-y">
                            <p className="text-black mb-[10px] border-b"><b>{order?.product?.title}</b></p>
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input label="Qancha mahsulot olinadi/dona" required variant="standard" onChange={e => !isNaN(e.target?.value) && setOrder({ ...order, count: +e?.target?.value, price: +e.target.value * (order?.product?.price + order?.product?.for_admins + order?.for_operators) })} value={order?.count} icon={<FaBox />} />
                            </div>
                            {/*  */}
                            <div className="flex items-start justify-start w-full mb-[10px] flex-col">
                                <p>Umumiy narx:</p>
                                <Input label="Umumiy narx" required disabled value={order?.price} icon={<FaMoneyBill />} />
                            </div>
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input label="Qancha mahsulot olinadi/dona" required variant="standard" onChange={e => setOrder({...order, name: e.target.value})} value={order?.count} icon={<FaBox />} />
                            </div>
                        </DialogBody>
                    </>
                }
            </div>
        </Dialog>
    );
}

export default ViewOrder;