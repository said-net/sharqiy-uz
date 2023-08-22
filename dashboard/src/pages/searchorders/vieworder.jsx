import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { FaBox, FaBoxesStacked, FaGift, FaIdCard, FaMoneyBill, FaPhone, FaTelegram, FaUser, FaX } from 'react-icons/fa6';
import Regions from '../../components/regions.json'
import Cities from '../../components/cities.json'
import { toast } from "react-toastify";
function ViewOrder({ open, setOpen }) {
    const [order, setOrder] = useState({});
    const [isLoad, setIsLoad] = useState(false);
    const [wait, setWait] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        if (open !== '') {
            axios(`${API_LINK}/boss/view-info-order/${open}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data, msg } = res.data;
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
    function Submit() {
        setWait(true);
        const { name, count, price, bonus_gived, phone, region, city, about } = order;
        axios.put(`${API_LINK}/boss/edit-info-order/${open}`, { name, count, price, bonus_gived, phone, region, city, about }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            setWait(false);
            if (!ok) {
                toast.error(msg)
            } else {
                toast.success(msg);
                setOpen('');
                setOrder({});
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#0000005b] backdrop-blur-sm">
            <div className="flex items-center justify-center sm:w-[500px] w-[97%] bg-white shadow-sm  rounded flex-col p-[5px]">
                {!isLoad &&
                    <div className="flex items-center justify-center w-full">
                        <Spinner />
                        <p>KUTING...</p>
                    </div>
                }
                {isLoad && !order?.id && <p>Tarix mavjud emas!</p>}
                {isLoad && order?.id &&
                    <>
                        <DialogHeader className="w-full relative">
                            <h1 className="text-[16px] mr-[10px]">Buyurtma uchun ID: {order?.id}</h1>
                            {order?.status === 'reject' && <Chip className="rounded tracking-widest" color="red" value="Rad etilgan" />
                            }
                            {order?.status === 'archive' && <Chip className="rounded tracking-widest" color="deep-orange" value="Arxivlangan" />
                            }
                            {order?.status === 'wait' && <Chip className="rounded tracking-widest" color="deep-orange" value="Qayta aloqa" />
                            }
                            {order?.status === 'pending' && <Chip className="rounded tracking-widest" color="orange" value="Kutulmoqda" />
                            }
                            {order?.status === 'success' && <Chip className="rounded tracking-widest" color="blue" value="Tekshiruvda" />
                            }
                            {order?.status === 'sended' && <Chip className="rounded tracking-widest" color="indigo" value="Yuborildi" />
                            }
                            {order?.status === 'delivered' && <Chip className="rounded tracking-widest" color="green" value="Yetkazilgan" />
                            }
                            <div className="absolute top-[-20px] right-[-10px]">
                                <IconButton onClick={() => setOpen('')} color="blue-gray" className="rounded-full">
                                    <FaX />
                                </IconButton>
                            </div>
                        </DialogHeader>
                        <DialogBody className="w-full border-y h-[500px] overflow-y-scroll">
                            <div className="flex items-start justify-start w-full mb-[10px] flex-col">
                                <Input label="Mahsulot nomi" variant="standard" required value={`${order?.product?.title}`} icon={<FaBox />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input label="Qancha mahsulot olinadi/dona" required variant="standard" onChange={e => setOrder({ ...order, count: +e?.target?.value, price: +e.target.value * (order?.product?.price + order?.product?.for_admins + order?.for_operators), bonus_gived: order?.bonus ? Math.floor(+e.target.value / order?.bonus_count * order?.bonus_given) : 0 })} value={order?.count === 0 || !order?.count ? '' : order?.count} icon={<FaBoxesStacked />} type="number" />
                            </div>
                            {/*  */}
                            <div className="flex items-start justify-start w-full mb-[10px] flex-col">
                                <Input label="Umumiy narx" variant="standard" required value={`${Number(order?.price).toLocaleString()} so'm`} icon={<FaMoneyBill />} />
                            </div>
                            {/*  */}
                            <div className="flex items-start justify-start w-full mb-[10px] flex-col">
                                <Input label="Bonus beriladi" variant="standard" required value={`+${!isNaN(Number(order?.bonus_gived)) ? Number(order?.bonus_gived).toLocaleString() : 0} ta`} icon={<FaGift />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input label="Mijoz ismi" required variant="standard" onChange={e => setOrder({ ...order, name: e.target.value })} value={order?.name} icon={<FaUser />} />
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Input label="Raqami" required variant="standard" onChange={e => setOrder({ ...order, phone: e.target.value })} value={order?.phone} icon={<FaPhone />} />
                                <a className="underline text-black" href={`tel:${order?.phone}`}>Qo'ng'iroq qilish</a>
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Select variant="standard" label="Mijoz Manzili" onChange={e => setOrder({ ...order, region: +e, city: '' })} value={`${order?.region}`}>
                                    {Regions?.map((e, i) => {
                                        return <Option key={i} value={`${e?.id}`}>{e?.name}</Option>
                                    })}
                                </Select>
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Select variant="standard" label="Tuman" onChange={e => setOrder({ ...order, city: +e })} value={`${order?.city}`}>
                                    {Cities?.filter(c => c.region_id === order?.region)?.map((e, i) => {
                                        return <Option key={i} value={`${e?.id}`}>{e?.name}</Option>
                                    })}
                                </Select>
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Textarea label="Batafsil ma'lumot*" variant="standard" onChange={e => setOrder({ ...order, about: order?.target?.value })} value={order?.about} />
                            </div>
                            {/* ADMIN */}
                            <p className="w-full flex items-center justify-between mb-[10px]">
                                <span className="w-[40%] h-[2px] bg-gray-300"></span>
                                ADMIN
                                <span className="w-[40%] h-[2px] bg-gray-300"></span>
                            </p>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Input label="Admin ID" required variant="standard" value={order?.admin?.id} icon={<FaIdCard />} />
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Input label="Admin ismi" required variant="standard" value={order?.admin?.name} icon={<FaUser />} />
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Input label="Admin raqami" required variant="standard" value={order?.admin?.phone} icon={<FaPhone />} />
                                <a className="underline text-black" href={`tel:${order?.admin?.phone}`}>Qo'ng'iroq qilish</a>
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Input label="Admin telegram ID si" required variant="standard" value={order?.admin?.telegram} icon={<FaTelegram />} />
                            </div>
                            {/* ADMIN */}
                            <p className="w-full flex items-center justify-between mb-[10px]">
                                <span className="w-[40%] h-[2px] bg-gray-300"></span>
                                OPERATOR
                                <span className="w-[40%] h-[2px] bg-gray-300"></span>
                            </p>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Input label="Operator ID" required variant="standard" value={order?.operator?.id} icon={<FaIdCard />} />
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Input label="Operator ID" required variant="standard" value={order?.operator?.name} icon={<FaUser />} />
                            </div>
                            <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                <Input label="Operator Raqami" required variant="standard" value={order?.operator?.phone} icon={<FaIdCard />} />
                                <a className="underline text-black" href={`tel:${order?.operator?.phone}`}>Qo'ng'iroq qilish</a>
                            </div>
                        </DialogBody>
                        <DialogFooter className="w-full">
                            <Button onClick={Submit} disabled={wait} color="green" className="rounded w-[100px] text-[12px]">Saqlash</Button>
                        </DialogFooter>
                    </>
                }
            </div>
        </Dialog>
    );
}

export default ViewOrder;