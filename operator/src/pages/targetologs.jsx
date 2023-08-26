import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import Regions from '../components/regions.json';

function Targetologs() {
    const [id, setId] = useState(localStorage.getItem('targetolog') || '');
    const [refresh, setRefresh] = useState(false);
    const [orders, setOrders] = useState([]);
    const [owner, setOwner] = useState({});
    useEffect(() => {
        if (id) {
            localStorage.setItem('targetolog', id);
            setOrders([]);
            setOwner([]);
            axios(`${API_LINK}/operator/get-targetolog-orders/${id}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, msg, data, owner } = res.data;
                if (!ok) {
                    toast.error(msg);
                } else {
                    setOrders(data);
                    console.log(data);
                    setOwner(owner);
                }
            }).catch((err) => {
                console.log(err);
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            });
        }
    }, [refresh]);
    function Take(ids) {
        axios.post(`${API_LINK}/operator/take-new-order/${ids}`, {}, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
                setTimeout(() => {
                    setRefresh(!refresh)
                }, 1000)
            } else {
                toast.success(msg);
                setTimeout(() => {
                    setRefresh(!refresh)
                }, 1000)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!А")
        });
    }
    return (
        <div className="flex items-center justify-center w-full flex-col">
            <div className="flex items-center justify-between w-full h-[50px] bg-white rounded shadow my-[10px] p-[0_10px]">
                <div className="flex items-center justify-center w-[65%]">
                    <Input label="Targtolog ID si" onChange={e => setId(e.target.value)} value={id} />
                </div>
                <Button disabled={!id} onClick={() => setRefresh(!refresh)}>Qidirish</Button>
            </div>
            {owner?.id &&
                <div className="flex items-center justify-between w-full h-[50px] bg-[white] rounded p-[0_10px] shadow-sm mb-[10px]">
                    <p>ID: {owner?.id}</p>
                    <p>{owner?.phone}</p>
                    <p>{owner?.name}</p>
                </div>
            }
            {!orders[0] && <p>Buyurtmalar mavjud emas</p>}
            {orders[0] &&
                <div className="flex items-center justify-normal flex-col w-full bg-white p-[10px] rounded-[10px] shadow-sm">
                    {orders.map((e, i) => {
                        return (
                            <div key={i} className={`flex items-center justify-start w-full h-[80px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-100'} p-[0_10px] flex-col`}>
                                <div className="flex items-center justify-between w-full border-b">
                                    <div className="flex items-start justify-start w-[30%] flex-col">
                                        <p className="text-[12px]">ID:{e?.oid}</p>
                                        <p className="text-[12px]">{e?.phone}</p>
                                    </div>
                                    <div className="flex items-center justify-start w-[33%] sm:w-[25%]">
                                        <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden  p-[5px]">
                                            <img src={e?.image} alt="rasm" />
                                        </div>
                                        <p className="text-[12px] sm:text-[15px]">{e?.product?.title?.slice(0, 15)}...</p>
                                    </div>
                                    <div className="hidden sm:flex items-center justify-start w-[25%]">
                                        <p>{Regions.find(r => r.id === e?.region)?.name}</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Button className="rounded text-[12px] w-[70px]
                                        p-[0] h-[30px]" color="red" onClick={() => Take(e.id)}>Olish</Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-[13px]">{e?.created}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}
export default Targetologs;