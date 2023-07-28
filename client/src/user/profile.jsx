import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotAuth from "./notauth";
import { FaCalendar, FaCartShopping, FaGear, FaGears, FaHeart, FaLocationDot, FaPhone, FaTelegram, FaUser } from 'react-icons/fa6'
import { BiLogOut } from 'react-icons/bi'
import { setInformations, setRefreshAuth } from "../managers/authManager";
import Regions from '../components/regions.json'
import { Link } from "react-router-dom";
function Profile() {
    const { id, name, phone, telegram, location, created } = useSelector(e => e.auth);
    const [type, setType] = useState('profile');
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
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            {!id &&
                <NotAuth />
            }
            {
                id && <>
                    <div className="flex items-center justify-around w-full bg-white h-[60px] rounded shadow-sm">
                        {/*  */}
                        <p onClick={() => setType('profile')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'profile' ? 'text-black underline' : 'text-gray-500'}`}><FaUser className="text-[16px]" />Profilim</p>
                        {/*  */}
                        <p onClick={() => setType('history')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'history' ? 'text-black underline' : 'text-gray-500'}`}><FaCartShopping className="text-[16px]" />Tarix</p>
                        {/*  */}
                        <p onClick={() => setType('saved')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'saved' ? 'text-black underline' : 'text-gray-500'}`}><FaHeart className="text-[16px]" />Saqlangan</p>
                        {/*  */}
                        <p onClick={() => LogOut()} className={`text-[12px] flex items-center justify-center flex-col ${type === 'exit' ? 'text-black underline' : 'text-orange-500'}`}><BiLogOut className="text-[20px]" />Chiqish</p>
                    </div>
                    {/*  */}
                    {type === 'profile' &&
                        <div className="flex items-start justify-start flex-col w-full bg-white shadow-sm p-[10px] mt-[20px] rounded">
                            {/*  */}
                            <h1 className="text-[25px] font-bold mb-[10px]">Salom {name}!</h1>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaUser className="mr-[5px]" />Ismingiz: <span className="text-cyan-800 ml-[5px]">{name}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaPhone className="mr-[5px]" />Raqamingiz: <span className="text-cyan-800 ml-[5px]">{phone}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaTelegram className="mr-[5px]" />Telegram: <span className="text-cyan-800 ml-[5px]">{telegram ? telegram : 'Kiritilmagan!'}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaLocationDot className="mr-[5px]" />Hududingiz: <span className="text-cyan-800 ml-[5px]">{Regions.find(e=>e.id === location)?.name}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaCalendar className="mr-[5px]" />Saytda: <span className="text-cyan-800 ml-[5px]">{created}</span></p>
                            {/*  */}
                            <p className=" mb-[10px] flex items-center"><FaGear className="mr-[5px]" /><Link to='/settings' className="underline text-cyan-500 mr-[5px]">Sozlamar</Link> bo'limi orqali o'zgartirish mumkin!</p>
                        </div>
                    }
                </>
            }

        </div>
    );
}

export default Profile;