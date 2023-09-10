import { Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { FaBars, FaBox, FaCaretLeft, FaComment, FaGift, FaHistory, FaList, FaSearch, FaShoppingBag, FaShoppingCart, FaUsers } from "react-icons/fa";
import { BiListUl, BiLogOut, BiSolidDashboard } from 'react-icons/bi'
import { useDispatch, useSelector } from "react-redux";
import { setInfoAuth, setRefreshAuth } from "../managers/auth.manager";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarDay, FaClockRotateLeft, FaCreditCard, FaDownLeftAndUpRightToCenter, FaGear, FaGears, FaUpRightAndDownLeftFromCenter, FaUserSecret } from "react-icons/fa6";
import { useState } from "react";
function Navbar() {
    const { phone, name } = useSelector(e => e.auth);
    // 
    const [open, setOpen] = useState(false);
    const nv = useNavigate();
    const dp = useDispatch();
    const { pathname } = useLocation()
    // 
    function LogOut() {
        localStorage.removeItem('access');
        setTimeout(() => {
            dp(setInfoAuth({ name: '', phone: '', id: '' }));
        }, 1000);
        setTimeout(() => {
            dp(setRefreshAuth());
        }, 1500);
    }
    return (
        <div className={`w-full ${open ? 'h-[100px]' : 'h-0'} ${pathname === '/get-all-cheques' ? 'hidden' : ''} duration-500 mb-[50px] lg:mb-0`}>
            {!open ?
                <div onClick={()=>setOpen(!open)} className="flex items-center justify-center bg-blue-gray-500 rounded cursor-pointer w-[40px] h-[40px] absolute left-[10px] top-[5px]">
                    <FaUpRightAndDownLeftFromCenter className=" text-[white] text-[20]" />
                </div> :
                <div onClick={()=>setOpen(!open)} className="flex items-center justify-center bg-blue-gray-500 rounded cursor-pointer w-[40px] h-[40px] absolute left-[10px] top-[105px]">
                    <FaDownLeftAndUpRightToCenter className=" text-[white] text-[20]" />
                </div>
            }
            <nav className={`duration-500 w-full ${open ? 'h-[100px]' : 'h-0'} flex items-center justify-between fixed top-0 left-0 bg-[#ffffffba] backdrop-blur-md shadow-md rounded z-[999] p-[0_2%] overflow-hidden`}>
                <div className="flex items-start justify-start flex-col">
                    <h1 className="text-[20px]">{name}</h1>
                    <Chip className=" rounded" value={phone} color="green" />
                </div>
                <div className="flex items-center justify-between w-[200px]">
                    <IconButton onClick={() => nv('/get-all-cheques')} className="rounded-full text-[20px]" color="deep-orange">
                        <BiListUl />
                    </IconButton>
                    <IconButton onClick={() => nv('/operator-pays')} className="rounded-full text-[20px]">
                        <FaCreditCard />
                    </IconButton>
                    <div className="flex items-center justify-center relative">
                        <Menu>
                            <MenuHandler>
                                <IconButton color="orange" className="rounded-full text-[20px]">
                                    <FaShoppingBag />
                                </IconButton>
                            </MenuHandler>
                            <MenuList>
                                <MenuItem className="flex items-center" onClick={() => nv('/new-orders')}>
                                    <FaShoppingCart className="mr-[10px]" />
                                    Yangi buyurtmalar
                                </MenuItem>
                                <MenuItem className="flex items-center" onClick={() => nv('/sended-orders')}>
                                    <FaCalendarDay className="mr-[10px]" />
                                    Yuborilganlar
                                </MenuItem>
                                <MenuItem className="flex items-center" onClick={() => nv('/wait-orders')}>
                                    <FaClockRotateLeft className="mr-[10px]" />
                                    Eslatmalar
                                </MenuItem>
                                <MenuItem className="flex items-center" onClick={() => nv('/history-orders')}>
                                    <FaList className="mr-[10px]" />
                                    Tarix
                                </MenuItem>
                                <MenuItem className="flex items-center" onClick={() => nv('/search-order')}>
                                    <FaSearch className="mr-[10px]" />
                                    Qidiruv
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        {/* <span className="absolute top-[-5px] bg-red-500 right-[-5px] w-[10px] h-[10px] rounded-full" /> */}
                    </div>
                    {/* <div className="flex items-center justify-center relative">
                        <IconButton onClick={() => nv('/chats')} color="light-blue" className="rounded-full text-[20px]">
                            <FaComment />
                        </IconButton>
                        
                    </div> */}
                    <Menu>
                        <MenuHandler>
                            <IconButton className="rounded-full text-[20px]" color="teal">
                                <FaBars />
                            </IconButton>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem onClick={() => nv('/')} className="flex items-center justify-start">
                                <BiSolidDashboard className="mr-[10px]" />
                                Dashboard
                                {pathname === '/' && <FaCaretLeft />}
                            </MenuItem>
                            <MenuItem onClick={() => nv('/categories')} className="flex items-center justify-start">
                                <FaList className="mr-[10px]" />
                                Kategoriyalar
                                {pathname === '/categories' && <FaCaretLeft />}
                            </MenuItem>
                            <MenuItem onClick={() => nv('/products')} className="flex items-center justify-start">
                                <FaBox className="mr-[10px]" />
                                Mahsulotlar
                                {pathname === '/products' && <FaCaretLeft />}
                            </MenuItem>
                            <MenuItem onClick={() => nv('/main-menu')} className="flex items-center justify-start">
                                <FaGears className="mr-[10px]" />
                                Bosh ekran
                                {pathname === '/main-menu' && <FaCaretLeft />}
                            </MenuItem>
                            <MenuItem onClick={() => nv('/operators')} className="flex items-center justify-start">
                                <FaUsers className="mr-[10px]" />
                                Operatorlar
                                {pathname === '/operators' && <FaCaretLeft />}
                            </MenuItem>
                            <MenuItem onClick={() => nv('/settings')} className="flex items-center justify-start">
                                <FaGear className="mr-[10px]" />
                                Sozlamalar
                                {pathname === '/settings' && <FaCaretLeft />}
                            </MenuItem>
                            <MenuItem onClick={() => nv('/admins')} className="flex items-center justify-start">
                                <FaUserSecret className="mr-[10px]" />
                                Adminlar
                                {pathname === '/admins' && <FaCaretLeft />}
                            </MenuItem>
                            <MenuItem onClick={() => nv('/competition')} className="flex items-center justify-start">
                                <FaGift className="mr-[10px]" />
                                Konkurs
                                {pathname === '/competition' && <FaCaretLeft />}
                            </MenuItem>
                            <div className="w-full h-[1px] bg-blue-gray-200"></div>
                            <MenuItem onClick={LogOut} className="flex items-center justify-start text-red-400">
                                <BiLogOut className="mr-[10px]" />
                                Chiqish
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;