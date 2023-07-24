import { Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { FaBars, FaBell, FaBox, FaCaretLeft, FaComment, FaList, FaUsers } from "react-icons/fa";
import { BiLogOut, BiSolidDashboard } from 'react-icons/bi'
import { useDispatch, useSelector } from "react-redux";
import { setInfoAuth, setRefreshAuth } from "../managers/auth.manager";
import { useLocation, useNavigate } from "react-router-dom";
function Navbar() {
    const { phone, name } = useSelector(e => e.auth);
    // 
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
        }, 1500)
    }
    return (
        <div className="w-full h-[100px]">
            <nav className="w-full h-[100px] flex items-center justify-between fixed top-0 left-0 bg-[#ffffffba] backdrop-blur-md shadow-md rounded z-[999] p-[0_2%]">
                <div className="flex items-start justify-start flex-col">
                    <h1 className="text-[20px]">{name}</h1>
                    <Chip className=" rounded" value={phone} color="green" />
                </div>
                <div className="flex items-center justify-between w-[200px]">
                    <div className="flex items-center justify-center relative">
                        <IconButton color="orange" className="rounded-full text-[20px]">
                            <FaBell />
                        </IconButton>
                        <span className="absolute top-[-5px] bg-red-500 right-[-5px] w-[10px] h-[10px] rounded-full" />
                    </div>
                    <div className="flex items-center justify-center relative">
                        <IconButton color="light-blue" className="rounded-full text-[20px]">
                            <FaComment />
                        </IconButton>
                        <span className="absolute top-[-5px] bg-red-500 right-[-5px] w-[10px] h-[10px] rounded-full" />
                    </div>
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
                            <MenuItem onClick={() => nv('/operators')} className="flex items-center justify-start">
                                <FaUsers className="mr-[10px]" />
                                Operatorlar
                                {pathname === '/operators' && <FaCaretLeft />}
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