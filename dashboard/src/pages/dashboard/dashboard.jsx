import { Button, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { FaBoxes, FaMoneyBill, FaMoneyCheck, FaShoppingCart } from 'react-icons/fa'
import { FaClock, FaList, FaMoneyBillTransfer, FaMoneyBillTrendUp, FaPhone, FaUsers, FaUsersGear } from 'react-icons/fa6'
import { TbReload, TbTruckDelivery } from 'react-icons/tb'
import Formatter from "../../components/formatter";
import { GiCash } from 'react-icons/gi'
function Dashboard() {
    const [filter, setFilter] = useState('all');
    const [isLoad, setIsLoad] = useState(false);
    const [data, setData] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-dashboard/${filter}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setData(data);
            }
        })
    }, [filter]);

    const cNameType = "flex items-center justify-start w-[90%] sm:w-[300px] h-[100px] shadow-md rounded-[10px] bg-white relative p-[4px] m-[10px] hover:shadow-lg";

    const cNameIcon = "flex items-center justify-center w-[50px] h-[50px] rounded-full text-[30px] mr-[10px] ";

    return (
        <div className="flex items-center justify-start flex-col p-[10px]">
            <div className="flex items-center justify-between w-full bg-white p-[10px] rounded shadow-md mb-[20px]">
                <h1>Statistika</h1>
                {filter === 'all' && <h1>Barchasi</h1>}
                {filter !== 'all' && <h1>Barchasi</h1>}
                <Button className="rounded" color="blue-gray">Filterlash</Button>
            </div>
            {!isLoad &&
                <div className="flex items-center justify-center w-full h-[400px] bg-white mt-[20px] rounded shadow-lg">
                    <Spinner />
                    <h1>Kuting...</h1>
                </div>
            }
            {isLoad && filter === 'all' &&
                <div className="flex items-center w-full justify-center flex-wrap">
                    {/* DEPOSIT */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-purple-400'}>
                            <FaMoneyBill className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Umumiy invest</p>
                            <h1 className="text-[25px]"><Formatter value={data?.deposit} style={{ margin: 0 }} /><sub className="text-blue-gray-300">so'm</sub></h1>
                        </div>
                    </div>
                    {/* SOTUV */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-blue-400'}>
                            <FaMoneyCheck className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Umumiy sotuvlar</p>
                            <h1 className="text-[25px]"><Formatter value={data?.sales} style={{ margin: 0 }} /><sub className="text-blue-gray-300">so'm</sub></h1>
                        </div>
                    </div>
                    {/* PROFIT */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-green-400'}>
                            <FaMoneyBillTrendUp className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Umumiy foyda</p>
                            <h1 className="text-[25px]"><Formatter value={data?.profit} style={{ margin: 0 }} /><sub className="text-blue-gray-300">so'm</sub></h1>
                        </div>
                    </div>
                    {/* KATEGORIYALAR */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-blue-gray-400'}>
                            <FaList className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Kategoriyalar</p>
                            <h1 className="text-[25px]"><Formatter value={data?.categories} style={{ margin: 0 }} /><sub className="text-blue-gray-300">hil</sub></h1>
                        </div>
                    </div>
                    {/* MAHSULOT TURI */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-orange-400'}>
                            <FaBoxes className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Mahsulotlar</p>
                            <h1 className="text-[25px]"><Formatter value={data?.products} style={{ margin: 0 }} /><sub className="text-blue-gray-300">hil</sub></h1>
                        </div>
                    </div>
                    {/* Umumiy sotuvlar */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-teal-400'}>
                            <FaShoppingCart className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Sotuvlar</p>
                            <h1 className="text-[25px]"><Formatter value={data?.shops} style={{ margin: 0 }} /><sub className="text-blue-gray-300">ta</sub></h1>
                        </div>
                    </div>
                    {/*Yetkazib berildi */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-purple-400'}>
                            <TbTruckDelivery className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Yetkazib berildi</p>
                            <h1 className="text-[25px]"><Formatter value={data?.delivered} style={{ margin: 0 }} /><sub className="text-blue-gray-300">ta</sub></h1>
                        </div>
                    </div>
                    {/* YETKAZISH KUTULMOQDA */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-cyan-400'}>
                            <FaClock className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Yetkazib Berish Kutulmoqda</p>
                            <h1 className="text-[25px]"><Formatter value={data?.waiting} style={{ margin: 0 }} /><sub className="text-blue-gray-300">ta</sub></h1>
                        </div>
                    </div>
                    {/* RAD ETILDI & QAYTARILDI */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-red-400'}>
                            <TbReload className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Qaytarildi</p>
                            <h1 className="text-[25px]"><Formatter value={data?.rejected} style={{ margin: 0 }} /><sub className="text-blue-gray-300">ta</sub></h1>
                        </div>
                    </div>

                    {/* BUYURTMACHILAR & ADMINLAR */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-lime-400'}>
                            <FaUsers className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Adminlar & Foydalanuvchilar</p>
                            <h1 className="text-[25px]"><Formatter value={data?.users} style={{ margin: 0 }} /><sub className="text-blue-gray-300">ta</sub></h1>
                        </div>
                    </div>
                    {/* ADMINLAR HISOBI */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-blue-gray-400'}>
                            <GiCash className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Adminlar hisobi</p>
                            <h1 className="text-[25px]"><Formatter value={data?.adminsBalance} style={{ margin: 0 }} /><sub className="text-blue-gray-300">so'm</sub></h1>
                        </div>
                    </div>
                    {/* OPERATORLAR */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-blue-400'}>
                            <FaPhone className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Operatorlar</p>
                            <h1 className="text-[25px]"><Formatter value={data?.operators} style={{ margin: 0 }} /><sub className="text-blue-gray-300">ta</sub></h1>
                        </div>
                    </div>
                    {/* OPERATORLAR HISOBI */}
                    <div className={cNameType}>
                        <div className={cNameIcon + 'bg-green-400'}>
                            <FaMoneyBillTransfer className="text-white" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <p className="text-blue-gray-500">Operatorlar hisobi</p>
                            <h1 className="text-[25px]"><Formatter value={data?.operatorsBalance} style={{ margin: 0 }} /><sub className="text-blue-gray-300">so'm</sub></h1>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Dashboard;