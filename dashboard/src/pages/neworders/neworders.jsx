import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { Button, Checkbox, IconButton, Input, Option, Select, Spinner } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import ViewOrder from "./view";
import { setRefreshOrder } from "../../managers/order.manager";
import { BiRefresh } from "react-icons/bi";
import Regions from '../../components/regions.json'
import { FaCheck, FaXmark } from "react-icons/fa6";
function NewOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.order);
    const [open, setOpen] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(0);
    const dp = useDispatch();
    const [region, setRegion] = useState('2');
    const [selecteds, setSelecteds] = useState([]);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('id')
    function SelectOrder(id, checked) {
        if (!checked && selecteds?.includes(id)) {
            setSelecteds([...selecteds?.map(s => {
                if (s !== id && s !== undefined) {
                    return s;
                }
            })])
        } else {
            setSelecteds([...selecteds, id]);
        }
    }
    function SelectAllOrders(checked) {
        if (checked && region) {
            const arr = [];
            orders?.filter(e => e.region === +region)?.forEach(o => {
                arr.push(o?._id)
            })
            setSelecteds(arr);
        } else if (!checked && region) {
            setSelecteds([]);
        }
    }
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
    useEffect(() => {
        let p = 0;
        let dp = 0;
        orders?.filter(e => e?.region === +region)?.forEach((o) => {
            p += o?.price
            dp += o?.delivery_price
        });
        setTotalPrice(p);
        setTotalDeliveryPrice(dp);
    }, [region]);
    function Submit(status) {
        axios.post(`${API_LINK}/boss/set-status-by-id`, { list: selecteds, status }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (ok) {
                toast.success(msg);
                dp(setRefreshOrder());
            } else {
                toast.error(msg);
            }
        }).catch(() => {
            toast.error(msg);
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[10px]">
            <div className="flex items-center justify-between w-[20cm] h-[50px] bg-white shadow-md rounded p-[0_10px]">
                <div className="flex items-center justify-center">
                    <Select value={region} onChange={e => setRegion(e)} label="Viloyat bo'yicha saralov">
                        {Regions?.map((e, i) => {
                            return (
                                <Option value={`${e?.id}`} key={i}>{e.name}</Option>
                            )
                        })}
                    </Select>
                    <div className="flex items-center justify-center w-[200px]">
                        <Input label="Qidiruv: Raqam, ID" onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Select value={type} onChange={e => setType(e)} label="Filter">
                        <Option value="id">ID Orqali</Option>
                        <Option value="phone">Raqam Orqali</Option>
                    </Select>
                </div>
                <div className="flex items-center justify-between w-[150px]">
                    <IconButton onClick={() => Submit('reject')} disabled={!selecteds?.filter(e => e !== undefined)[0]} className="rounded text-[20px] font-sans" color="red">
                        <FaXmark />
                    </IconButton>
                    <IconButton onClick={() => Submit('sended')} disabled={!selecteds?.filter(e => e !== undefined)[0]} className="rounded text-[20px] font-sans" color="green">
                        <FaCheck />
                    </IconButton>
                    <IconButton className=" rounded-[20px] text-[20px]" onClick={() => dp(setRefreshOrder())}>
                        <BiRefresh />
                    </IconButton>
                </div>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !orders[0] && <h1>Yangi buyurtmalar mavjud emas!</h1>}
            {isLoad && orders[0] &&
                <div className="flex items-center justify-start flex-col w-[20cm] bg-white shadow-sm p-[5px]">
                    <div className="flex items-center justify-center w-full h-[50px] border rounded">
                        <div className="flex">
                            <Checkbox disabled={!region} onChange={e => SelectAllOrders(e.target.checked)} />
                        </div>
                        <div className="flex items-center justify-between w-full p-[0_10px]">
                            <p className="text-[12px] w-[14%] text-center">ID/Maxsulot/Soni</p>
                            <p className="text-[12px] w-[14%] text-center">Bonus</p>
                            <p className="text-[12px] w-[14%] text-center">Mijoz</p>
                            <p className="text-[12px] w-[14%] text-center">Operator</p>
                            <p className="text-[12px] w-[14%] text-center">Izoh</p>
                            <p className="text-[12px] w-[14%] text-center">Manzil</p>
                            <p className="text-[12px] w-[14%] text-center">Summa</p>
                        </div>
                    </div>
                    {orders?.filter(e => !region ? e : e?.region === +region).filter(e => !search ? e : type === 'id' ? e?.id === +search : e?.phone?.includes(search))?.map((o, i) => {
                        return (
                            <div key={i} className="flex items-center justify-center w-full py-[10px] border border-gray-400">
                                <div className="flex">
                                    <Checkbox onChange={e => SelectOrder(o?._id, e.target.checked)} checked={selecteds?.includes(o?._id)} />
                                </div>
                                <div onClick={() => setOpen(o?._id)} className={`flex items-center justify-between w-full p-[0_10px] bg-white} cursor-pointer`}>
                                    <div className="flex items-center justify-center flex-col w-[14%]">
                                        <p className="mr-[10px] text-[12px] ">#{o?.id}</p>
                                        {/* <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border overflow-hidden">
                                            <img src={o?.image} alt="rasm" />
                                        </div> */}
                                        <p className="text-[12px] ">{o?.title} {o?.count} ta</p>
                                    </div>

                                    <p className="w-[14%] hidden md:inline text-[12px] text-center">+{o?.bonus} ta</p>
                                    <div className="flex items-center justify-center flex-col w-[14%]">
                                        <p className="text-[12px] text-center">{o?.name}</p>
                                        <p className="text-[12px] text-center">{o?.phone}</p>
                                    </div>
                                    <div className="flex items-center justify-center flex-col w-[14%]">
                                        <p className="text-[12px] text-center">{o?.operator_name}</p>
                                        <p className="text-[12px] text-center">{o?.operator_phone}</p>
                                    </div>
                                    <p className="w-[14%] text-[12px] text-center">{o?.about}</p>
                                    <p className="w-[14%] text-[12px] text-center">{o?.location}</p>
                                    <p className="w-[14%] text-[12px]  text-end">{Number(o?.price).toLocaleString()} so'm</p>
                                </div>
                            </div>

                        )
                    })}
                </div>
            }

            <div className="flex items-start justify-center w-[20cm] flex-col h-[50px] bg-white p-[10px]">
                <p className="text-[12px]">Dostavka uchun umumiy: {Number(totalDeliveryPrice).toLocaleString()} so'm</p>
                <p className="text-[12px]">Umumiy narx: {Number(totalPrice).toLocaleString()} so'm</p>
            </div>
            <ViewOrder open={open} setOpen={setOpen} />
        </div>
    );
}

export default NewOrders;