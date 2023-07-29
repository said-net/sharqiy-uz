import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotAuth from "./notauth";
import { FaCalendar, FaCartShopping, FaGear, FaGears, FaHeart, FaLocationDot, FaPhone, FaTelegram, FaUser } from 'react-icons/fa6'
import { BiLogOut } from 'react-icons/bi'
import { setInformations, setRefreshAuth } from "../managers/authManager";
import Regions from '../components/regions.json'
import { Link } from "react-router-dom";
import axios from "axios";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Chip, Spinner } from "@material-tailwind/react";
import { MdRemoveShoppingCart } from 'react-icons/md'
function Profile() {
    const { id, name, phone, telegram, location, created } = useSelector(e => e.auth);
    const [type, setType] = useState('profile');
    const [isLoad, setIsLoad] = useState(false);
    const [history, setHistory] = useState([]);
    const dp = useDispatch();
    function LogOut() {
        if (window.confirm('Profildan chiqishni hohlaysizmi?')) {
            localStorage.removeItem('access');
            setTimeout(() => {
                dp(setInformations({
                    name: '',
                    phone: '',
                    id: '',
                    role: '',
                    created: '',
                    balance: 0,
                    telegram: 0,
                    location: ''
                }))
                dp(setRefreshAuth());
            }, 1000);
        }
    }
    useEffect(() => {
        setIsLoad(false);
        if (type === 'history') {
            axios(`${API_LINK}/user/get-shop-history`, {
                headers: {
                    'x-user-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data, msg } = res.data;
                setIsLoad(true);
                if (!ok) {
                    toast.error(msg);
                } else {
                    setHistory(data);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }, [type]);
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            {!id &&
                <NotAuth />
            }
            {
                id && <>
                    {/* NAV */}
                    <div className="flex items-center justify-around w-full bg-white h-[60px] rounded shadow-sm mb-[20px]">
                        {/*  */}
                        <p onClick={() => setType('profile')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'profile' ? 'text-black underline' : 'text-gray-500'}`}><FaUser className="text-[16px]" />Profilim</p>
                        {/*  */}
                        <p onClick={() => setType('history')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'history' ? 'text-black underline' : 'text-gray-500'}`}><FaCartShopping className="text-[16px]" />Tarix</p>
                        {/*  */}
                        <p onClick={() => setType('saved')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'saved' ? 'text-black underline' : 'text-gray-500'}`}><FaHeart className="text-[16px]" />Saqlangan</p>
                        {/*  */}
                        <p onClick={() => LogOut()} className={`text-[12px] flex items-center justify-center flex-col ${type === 'exit' ? 'text-black underline' : 'text-gray-500'}`}><BiLogOut className="text-[20px]" />Chiqish</p>
                    </div>
                    {/* PROFILE */}
                    {type === 'profile' &&
                        <div className="flex items-start justify-start flex-col w-full bg-white shadow-sm p-[10px] rounded">
                            {/*  */}
                            <h1 className="text-[25px] font-bold mb-[10px]">Salom {name}!</h1>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaUser className="mr-[5px]" />Ismingiz: <span className="text-cyan-800 ml-[5px]">{name}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaPhone className="mr-[5px]" />Raqamingiz: <span className="text-cyan-800 ml-[5px]">{phone}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaTelegram className="mr-[5px]" />Telegram: <span className="text-cyan-800 ml-[5px]">{telegram ? telegram : 'Kiritilmagan!'}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaLocationDot className="mr-[5px]" />Hududingiz: <span className="text-cyan-800 ml-[5px]">{Regions.find(e => e.id === location)?.name}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaCalendar className="mr-[5px]" />Saytda: <span className="text-cyan-800 ml-[5px]">{created}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaGear className="mr-[5px]" /><Link to='/settings' className="underline text-cyan-500 mr-[5px]">Sozlamar</Link> bo'limi orqali o'zgartirish mumkin!</p>
                        </div>
                    }
                    {/* HISTORY */}
                    {type === 'history' &&
                        <div className="flex items-center justify-start flex-col w-full">
                            {!isLoad && <Spinner />}
                            {isLoad && !history[0] &&
                                <div className="flex items-center justify-center w-full min-h-[300px] flex-col">
                                    <MdRemoveShoppingCart className="text-[100px] text-gray-500" />
                                    <p className="text-gray-500">Sizda buyurtmalar mavjud emas!</p>
                                </div>
                            }
                            {isLoad && history[0] &&
                                <>
                                    {history?.map((e, i) => {
                                        return (
                                            <div className={`flex items-center justify-between  w-full h-[50px] border ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border overflow-hidden">
                                                        <img src={e?.image} alt="rasm" />
                                                    </div>
                                                    <p>{e?.product?.title?.slice(0, 12)}...</p>
                                                </div>
                                                <p>{e?.count ? e?.count : 0} ta</p>
                                                {e?.status === 'reject' && <Chip className="rounded" color="red" value={'Rad etildi'} />}
                                                {e?.status === 'pending' && <Chip className="rounded" color="blue" value={'Kutulmoqda'} />}
                                                {e?.status === 'success' && <Chip className="rounded" color="cyan" value={'Yuborildi'} />}
                                                {e?.status === 'success' && <Chip className="rounded" color="green" value={'Yetkazildi'} />}
                                            </div>
                                        )
                                    })}
                                </>
                            }
                        </div>
                    }
                    {/*  */}
                </>
            }

        </div>
    );
}

export default Profile;