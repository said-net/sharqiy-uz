import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { Option, Select, Spinner } from "@material-tailwind/react";

function StatUsers() {
    const [date, setDate] = useState('all');
    const [type, setType] = useState('sended');
    const [users, setUsers] = useState([]);
    const [isLoad, setIsLoad] = useState(false)
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-admin-stats/${date}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setUsers(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring! ")
        })
    }, [date])
    return (
        <div className="flex items-center justify-start flex-col w-full">
            {!isLoad && <Spinner />}
            {isLoad && !users[0] && <p>Sotuvlar yo'q</p>}
            {isLoad && users[0] &&
                <>
                    <div className="flex items-center justify-between w-full h-[50px] bg-white rounded shadow-sm my-[10px] p-[10px]">
                        <p className={`text-[12px] cursor-pointer ${date === 'all' ? 'text-black underline' : 'text-gray-500'}`} onClick={() => setDate('all')}>Umumiy</p>

                        <p className={`text-[12px] cursor-pointer ${date === 'month' ? 'text-black underline' : 'text-gray-500'}`} onClick={() => setDate('month')}>Oylik</p>

                        <p className={`text-[12px] cursor-pointer ${date === 'lastmonth' ? 'text-black underline' : 'text-gray-500'}`} onClick={() => setDate('lastmonth')}>Otgan oy</p>

                        <p className={`text-[12px] cursor-pointer ${date === 'week' ? 'text-black underline' : 'text-gray-500'}`} onClick={() => setDate('week')}>Haftalik</p>

                        <p className={`text-[12px] cursor-pointer ${date === 'today' ? 'text-black underline' : 'text-gray-500'}`} onClick={() => setDate('today')}>Bugun</p>

                        <p className={`text-[12px] cursor-pointer ${date === 'yesterday' ? 'text-black underline' : 'text-gray-500'}`} onClick={() => setDate('yesterday')}>Kecha</p>

                    </div>
                </>
            }
            {isLoad && users[0] &&
                <>
                    <div className="flex items-center justify-between w-full h-[50px] bg-white rounded shadow-sm mb-[10px] p-[10px]">
                        <Select onChange={e => setType(e)} value={type} label="Status bo'yicha saralash">
                            <Option value='reject'>Rad etilgan</Option>
                            <Option value='archive'>Arxivlangan</Option>
                            <Option value='pending'>Kutilmoqda</Option>
                            <Option value='success'>Dostavkaga tayyor</Option>
                            <Option value='sended'>Yetkazib berilmoqda</Option>
                            <Option value='delivered'>Yetkazib berilgan</Option>
                        </Select>
                    </div>
                </>
            }
            {isLoad && users[0] &&
                users?.sort((a, b) => type === 'reject' ?
                    (b.reject - a.reject) :
                    type === 'archive' ?
                        (b.archive - a.archive) :
                        type === 'pending' ?
                            (b.pending - a.pending) :
                            type === 'success' ?
                                (b.success - a.success) :
                                type === 'sended' ?
                                    (b.sended - a.sended) :
                                    type === 'delivered' ?
                                        (b.delivered - a.delivered) : null
                )?.map((u, i) => {
                    return (
                        <div className={`flex items-center justify-between p-[0_10px] w-full h-[50px] ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                            <p className="text-[13px]">N: {i + 1}</p>
                            <p className="text-[13px]">ID: {u?.id}</p>
                            <div className="flex items-center justify-center flex-col">
                                <p className="text-[13px]">{u?.name}</p>
                                <p className="text-[13px]">{u?.phone}</p>
                            </div>
                            <p className="text-[13px]">Soni: {
                                type === 'reject' ?
                                    u?.reject :
                                    type === 'archive' ?
                                        u?.archive :
                                        type === 'pending' ?
                                            u?.pending :
                                            type === 'success' ?
                                                u?.success :
                                                type === 'sended' ?
                                                    u?.sended :
                                                    type === 'delivered' ?
                                                        u?.delivered : null
                            }</p>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default StatUsers;