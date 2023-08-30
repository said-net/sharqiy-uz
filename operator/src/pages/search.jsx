import { Button, Chip, Input, Option, Select } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import ViewOrder from "./vieworder";

function SearchOrder() {
    const [search, setSearch] = useState('');
    const [isLoad, setIsLoad] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(``);
    const [type, setType] = useState('id');
    useEffect(() => {
        if (search !== '') {
            setIsLoad(false);
            axios(`${API_LINK}/operator/search-base/${search}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data, msg } = res.data;
                setIsLoad(true);
                console.log(data);
                // console.log(data[0]);
                if (!ok) {
                    toast.error(msg)
                } else {
                    setOrders(data);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!");
            });
        }
    }, [refresh]);
    useEffect(() => {
        if (!search) {
            setOrders([]);
        }
    }, [search]);
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <div className="flex items-center justify-between w-full p-[10px] bg-white my-[10px] shadow-sm flex-col">
                <div className="flex items-center justify-center mb-[10px] w-full">
                    <Input label="Qidiruv: ID, Raqam" onChange={e => setSearch(e.target.value)} value={search} icon={<BiSearch />} />
                </div>
                <div className="flex items-center justify-center w-full">
                    <Select onChange={e => setType(e)} label="Qidiruv filteri" value={type}>
                        <Option value="id">ID Orqali</Option>
                        <Option value="phone">Raqam Orqali</Option>
                    </Select>
                    <Button className="flex items-center justify-center" disabled={!search} onClick={() => setRefresh(!refresh)}>
                        Qidirish<BiSearch />
                    </Button>
                </div>

            </div>
            {!search && <p>Mahsulot ID yoki Haridor raqamini yozing!</p>}
            {search && !isLoad && <p>Qidiruv tugmasini bosing!</p>}
            {search && isLoad && !orders[0] && <p>Buyurtmalar topilmadi!</p>}
            {search && isLoad && orders[0] &&
                <div className="flex items-center justify-normal flex-col w-full bg-white p-[10px] rounded-[10px] shadow-sm">
                    {orders?.filter(o => type === 'id' ? o.id === Number(search) : o?.phone?.includes(search))?.map((e, i) => {
                        return (
                            <div key={i} onClick={() => setOpen(e?._id)} className={`flex items-center justify-between w-full h-[50px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-[0_10px] cursor-pointer`}>
                                <div className="flex items-start justify-start flex-col">
                                    <p className="text-[12px]">ID: {e?.id}</p>
                                    <p className="text-[12px]">{e?.phone}</p>
                                </div>
                                <div className="flex items-center justify-start w-[33%] sm:w-[25%]">
                                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden  p-[5px]">
                                        <img src={e?.image} alt="rasm" />
                                    </div>
                                    <p className="text-[12px] sm:text-[15px]">{e?.product?.title?.slice(0, 15)}...</p>
                                </div>
                                <div className="flex items-center justify-center">
                                    {e?.status === 'reject' && <Chip className="rounded tracking-widest" color="red" value="Rad etilgan" />
                                    }
                                    {e?.status === 'archive' && <Chip className="rounded tracking-widest" color="deep-orange" value="Arxivlangan" />
                                    }
                                    {e?.status === 'wait' && <Chip className="rounded tracking-widest" color="deep-orange" value="Qayta aloqa" />
                                    }
                                    {e?.status === 'pending' && <Chip className="rounded tracking-widest" color="orange" value="Kutulmoqda" />
                                    }
                                    {e?.status === 'success' && <Chip className="rounded tracking-widest" color="blue" value="Tekshiruvda" />
                                    }
                                    {e?.status === 'sended' && <Chip className="rounded tracking-widest" color="indigo" value="Yuborildi" />
                                    }
                                    {e?.status === 'delivered' && <Chip className="rounded tracking-widest" color="green" value="Yetkazilgan" />
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <ViewOrder open={open} setOpen={setOpen} />
        </div>
    );
}

export default SearchOrder;