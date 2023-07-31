import { Chip, IconButton } from "@material-tailwind/react";
import { FaCartShopping, FaGear, FaList, FaListCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const { name, balance } = useSelector(e => e.auth);
    const nv = useNavigate();
    const { pathname } = useLocation()
    return (
        <>
            <div className="w-full h-[80px]">
                <div className="flex items-center justify-between w-full fixed top-0 left-0 bg-white shadow-sm h-[80px] p-[0_2%] z-[999]">
                    <div className="flex items-start justify-start flex-col">
                        <h1 className="uppercase text-[23px]">{name}</h1>
                        <Chip className="rounded tracking-widest" value={`Hisob: ${Number(balance).toLocaleString()} so'm`} />
                    </div>
                    <div className="flex items-center justify-between sm:w-[200px]">
                        <div className="sm:flex items-center justify-center flex-col hidden">
                            <IconButton onClick={() => nv('/new-orders')} color="green" className="rounded-full text-[20px]">
                                <FaList />
                            </IconButton>
                            <p className="text-[12px]">Yangilar</p>
                        </div>
                        <div className="sm:flex items-center justify-center flex-col hidden">
                            <IconButton onClick={() => nv('/my-orders')} color="blue-gray" className="rounded-full text-[20px]">
                                <FaListCheck />
                            </IconButton>
                            <p className="text-[12px]">Egallangan</p>
                        </div>
                        <div className="flex items-center justify-center flex-col">
                            <IconButton onClick={() => nv('/my-orders')} color="indigo" className="rounded-full text-[20px]">
                                <FaGear />
                            </IconButton>
                            <p className="text-[12px]">Sozlamalar</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex sm:hidden items-center justify-around w-full fixed bottom-0 left-0 bg-white shadow-[0_-1px_3px] shadow-[#00000012] h-[50px] p-[0_2%] z-[999]">
                <div className={`flex items-center justify-center flex-col ${pathname === '/new-orders' ? 'text-black' : 'text-gray-500'}`} onClick={() => nv('/new-orders')}>
                    <FaList className="text-[25px]" />
                    <p className="text-[12px]">Yangilar</p>
                </div>
                <div className={`flex items-center justify-center flex-col ${pathname === '/my-orders' ? 'text-black' : 'text-gray-500'}`} onClick={() => nv('/my-orders')}>
                    <FaListCheck className="text-[25px]" />
                    <p className="text-[12px]">Egallangan</p>
                </div>
            </div>
        </>
    );
}

export default Navbar;