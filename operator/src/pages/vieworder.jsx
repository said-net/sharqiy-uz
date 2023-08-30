import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { FaBox, FaBoxesStacked, FaGift, FaMoneyBill, FaPhone, FaUser, FaX } from 'react-icons/fa6';
import Regions from '../components/regions.json'
import Cities from '../components/cities.json'
import ConfirmChanges from "./confirmchanges";
function ViewOrder({ open, setOpen }) {
    const [order, setOrder] = useState({});
    const [select, setSelect] = useState({ open: false, del: false, wait: false, success: false });
    const disableAll = (order?.status !== 'wait' && order?.status !== 'pending' && order?.status !== 'success');
    const [disabed, setDisabled] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [history, setHistory] = useState([]);
    const [type, setType] = useState('order');
    useEffect(() => {
        setIsLoad(false);
        if (open !== '') {
            axios(`${API_LINK}/operator/get-info-order/${open}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data, msg, history } = res.data;
                setIsLoad(true);
                if (!ok) {
                    toast.error(msg)
                } else {
                    setOrder(data);
                    setHistory(history);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!");
            })
        }
    }, [open]);

    useEffect(() => {
        if (!order?.about || order?.about?.length < 4 || order?.count < 1 || !order?.region || !order?.city || !order?.phone || !order?.phone?.startsWith('+998')) {
            setDisabled(true)
        } else {
            setDisabled(false);
        }
    }, [order])
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#0000005b] backdrop-blur-sm">
            <div className="flex items-center justify-center sm:w-[500px] w-[97%] bg-white shadow-sm  rounded flex-col p-[5px]">
                {!isLoad &&
                    <div className="flex items-center justify-center w-full">
                        <Spinner />
                        <p>KUTING...</p>
                    </div>
                }
                {isLoad && !order?.id && <p>Tarix mavjud emas!</p> && JSON.stringify(order)}
                {isLoad && order?.id &&
                    <>
                        <DialogHeader className="w-full relative">
                            <div className="flex items-start justify-start flex-col">
                                <h1 className="text-[16px]">Buyurtma uchun ID: {order?.id}</h1>
                                <div className="flex items-center justify-center">
                                    <p onClick={() => setType('order')} className={`text-[14px] ${type === 'order' ? 'text-black underline' : 'text-gray-500'} font-light mr-[10px]`}>Buyurtma</p>
                                    <p onClick={() => setType('history')} className={`text-[14px] ${type === 'history' ? 'text-black underline' : 'text-gray-500'} font-light`}>Tarix</p>
                                </div>
                            </div>
                            <div className="absolute top-[-20px] right-[-10px]">
                                <IconButton onClick={() => setOpen('')} color="blue-gray" className="rounded-full">
                                    <FaX />
                                </IconButton>
                            </div>
                        </DialogHeader>
                        <DialogBody className="w-full border-y h-[500px] overflow-y-scroll">
                            {type === 'order' ?
                                <>
                                    <div className="flex items-start justify-start w-full mb-[10px] flex-col">
                                        <Input disabled={disableAll} label="Mahsulot nomi" variant="standard" required value={`${order?.product?.title}`} icon={<FaBox />} />
                                    </div>
                                    {/*  */}
                                    <div className="flex items-center justify-center w-full mb-[10px]">
                                        <Input disabled={disableAll} label="Qancha mahsulot olinadi/dona" required variant="standard" onChange={e => setOrder({ ...order, count: +e?.target?.value, price: +e.target.value * (order?.product?.price + order?.product?.for_admins + order?.for_operators), bonus_gived: order?.bonus ? Math.floor(+e.target.value / order?.bonus_count * order?.bonus_given) : 0 })} value={order?.count === 0 ? '' : order?.count} icon={<FaBoxesStacked />} type="number" />
                                    </div>
                                    {/*  */}
                                    <div className="flex items-start justify-start w-full mb-[10px] flex-col">
                                        <Input disabled={disableAll} label="Umumiy narx" variant="standard" required value={`${Number(order?.price).toLocaleString()} so'm`} icon={<FaMoneyBill />} />
                                    </div>
                                    {/*  */}
                                    <div className="flex items-start justify-start w-full mb-[10px] flex-col">
                                        <Input disabled={disableAll} label="Bonus beriladi" variant="standard" required value={`+${!isNaN(Number(order?.bonus_gived)) ? Number(order?.bonus_gived).toLocaleString() : 0} ta`} icon={<FaGift />} />
                                    </div>
                                    {/*  */}
                                    <div className="flex items-center justify-center w-full mb-[10px]">
                                        <Input disabled={disableAll} label="Mijoz ismi" required variant="standard" onChange={e => setOrder({ ...order, name: e.target.value })} value={order?.name} icon={<FaUser />} />
                                    </div>
                                    <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                        <Input disabled={disableAll} label="Raqami" required variant="standard" onChange={e => setOrder({ ...order, phone: e.target.value })} value={order?.phone} icon={<FaPhone />} />
                                        <a className="underline text-black" href={`tel:${order?.phone}`}>Qo'ng'iroq qilish</a>
                                    </div>
                                    <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                        <Select disabled={disableAll} variant="standard" label="Mijoz Manzili" onChange={e => setOrder({ ...order, region: +e, city: '' })} value={`${order?.region}`}>
                                            {Regions?.map((e, i) => {
                                                return <Option key={i} value={`${e?.id}`}>{e?.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                    <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                        <Select disabled={disableAll} variant="standard" label="Tuman" onChange={e => setOrder({ ...order, city: +e })} value={`${order?.city}`}>
                                            {Cities?.filter(c => c.region_id === order?.region)?.map((e, i) => {
                                                return <Option key={i} value={`${e?.id}`}>{e?.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                    <div className="flex items-start justify-center w-full mb-[10px] flex-col">
                                        <Textarea disabled={disableAll} label="Batafsil ma'lumot*" variant="standard" onChange={e => setOrder({ ...order, about: e?.target?.value })} value={order?.about} />
                                    </div>
                                </>
                                :

                                !history[0] ?
                                    <p>Tarix mavjud emas!</p>
                                    :
                                    history?.map((h, i) => {
                                        return (
                                            h?.id !== order?.id &&
                                            <div key={i} className={`flex items-center justify-start flex-col w-full h-[80px] ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                                <div className="flex items-center justify-between w-full h-[50px] border-b">
                                                    <p className="text-[12px]">ID: {h?.id}</p>
                                                    <p className="text-[12px]">{h?.product?.slice(0, 15)}...</p>
                                                    {h?.status === 'reject' && <Chip className="rounded tracking-widest font-light text-[10px]" color="red" value="Rad etilgan" />
                                                    }
                                                    {h?.status === 'archive' && <Chip className="rounded tracking-widest font-light text-[10px]" color="deep-orange" value="Arxivlangan" />
                                                    }
                                                    {h?.status === 'wait' && <Chip className="rounded tracking-widest font-light text-[10px]" color="deep-orange" value="Qayta aloqa" />
                                                    }
                                                    {h?.status === 'pending' && <Chip className="rounded tracking-widest font-light text-[10px]" color="orange" value="Kutulmoqda" />
                                                    }
                                                    {h?.status === 'success' && <Chip className="rounded tracking-widest font-light text-[10px]" color="blue" value="Tekshiruvda" />
                                                    }
                                                    {h?.status === 'sended' && <Chip className="rounded tracking-widest font-light text-[10px]" color="indigo" value="Yuborildi" />
                                                    }
                                                    {h?.status === 'delivered' && <Chip className="rounded tracking-widest font-light text-[10px]" color="green" value="Yetkazilgan" />
                                                    }
                                                </div>
                                                <p className="text-[12px] w-full">{h?.created}</p>
                                            </div>
                                        )
                                    })
                            }
                        </DialogBody>
                        <DialogFooter className="w-full flex items-center justify-between">
                            <Button disabled={disableAll} onClick={() => setSelect({ ...select, open: true, ...order, del: true })} color="red" className="rounded w-[100px] text-[12px]">Bekor</Button>
                            <Button disabled={disableAll} onClick={() => setSelect({ ...select, open: true, ...order, wait: true })} color="orange" className="rounded w-[100px] text-[12px]">Eslatma</Button>
                            {order?.status !== 'success' ? <Button disabled={disabed || disableAll} onClick={() => setSelect({ ...select, open: true, ...order, success: true })} color="green" className="rounded w-[100px] text-[12px]">Olindi</Button> : <Button disabled={disabed || disableAll} onClick={() => setSelect({ ...select, open: true, ...order, success: true })} color="green" className="rounded w-[100px] text-[12px]">Saqlash</Button>}
                        </DialogFooter>
                    </>
                }
            </div>
            <ConfirmChanges select={select} setSelect={setSelect} setOpen={setOpen} />
        </Dialog>
    );
}

export default ViewOrder;