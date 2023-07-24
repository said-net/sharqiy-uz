import { IconButton, Input } from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaComment, FaUser, FaUserPlus, FaYoutube } from 'react-icons/fa6'
import { FaBoxes, FaHome, FaSearch } from 'react-icons/fa'
import { useState } from "react";
function Navbar() {
    const { pathname } = useLocation();
    const [type, setType] = useState('link');

    const nv = useNavigate()
    return (
        <>
            <div className="w-full h-[100px]">
                <nav className="flex items-center justify-between w-full fixed top-0 left-0 z-[9999] bg-[#ffffffe6] backdrop-blur-[10px] h-[100px] shadow-sm p-[0_2%]">
                    <h1 className="text-[30px] text-blue-gray-500">SHARQIY.UZ</h1>
                    <div className="lg:flex items-center justify-between w-[500px] hidden ">
                        {type === 'link' &&
                            <>
                                <Link to='/' className={`duration-300 ${pathname !== '/' ? 'text-blue-gray-500' : 'text-blue-gray-900 translate-y-[-10px]'}`}>Asosiy</Link>
                                <Link to='/videos' className={`duration-300 ${pathname !== '/videos' ? 'text-blue-gray-500' : 'text-blue-gray-900 translate-y-[-10px]'}`}>Videolar</Link>
                                <Link to='/categories' className={`duration-300 ${pathname !== '/categories' ? 'text-blue-gray-500' : 'text-blue-gray-900 translate-y-[-10px]'}`}>Kataloglar</Link>
                                <Link to='/messanger' className={`duration-300 ${pathname !== '/messanger' ? 'text-blue-gray-500' : 'text-blue-gray-900 translate-y-[-10px]'}`}>Messanger</Link>
                            </>
                        }
                        {type === 'search' &&
                            <div className="flex items-center justify-center w-full">
                                <Input label="Qidiruv" icon={<FaSearch />} className="" />
                            </div>
                        }
                    </div>
                    <div className="flex items-center justify-end lg:justify-between w-[100px]">
                        {type === 'link' && <IconButton className="rounded-full" onClick={() => { setType('search') }} color="blue-gray" >
                            <FaSearch className="text-[20px]" />
                        </IconButton>}
                        {type === 'search' && <IconButton className="rounded-full" onClick={() => setType('link')} color="blue-gray">
                            <FaBars className="text-[20px]" />
                        </IconButton>}
                        <IconButton color="blue-gray" className="rounded hidden lg:inline-block">
                            <FaUser className="text-[20px]" />
                        </IconButton>
                    </div>
                </nav>
            </div>
            <div className="flex lg:hidden items-center justify-between w-full h-[80px] fixed bottom-0 left-0 z-[9999] bg-[#ffffffe6] backdrop-blur-[10px] -shadow-sm p-[0_2%]">
                {type === 'link' && <>
                    <div className={`duration-300 flex items-center justify-center w-[50px] h-[50px] rounded-full border ${pathname === '/' && 'translate-y-[-10px] shadow-md'}`} onClick={() => nv('/')}>
                        <FaHome className="text-[30px] text-orange-500" />
                    </div>
                    <div className={`duration-300 flex items-center justify-center w-[50px] h-[50px] rounded-full border ${pathname === '/videos' && 'translate-y-[-10px] shadow-md'}`} onClick={() => nv('/videos')}>
                        <FaYoutube className="text-[30px] text-red-500" />
                    </div>
                    <div className={`duration-300 flex items-center justify-center w-[50px] h-[50px] rounded-full border ${pathname === '/categories' && 'translate-y-[-10px] shadow-md'}`} onClick={() => nv('/categories')}>
                        <FaBoxes className="text-[30px] text-cyan-500" />
                    </div>
                    <div className={`duration-300 flex items-center justify-center w-[50px] h-[50px] rounded-full border ${pathname === '/messanger' && 'translate-y-[-10px] shadow-md'}`} onClick={() => nv('/messanger')}>
                        <FaComment className="text-[30px] text-blue-500" />
                    </div>
                    <div className={`duration-300 flex items-center justify-center w-[50px] h-[50px] rounded-full border ${pathname === '/profile' && 'translate-y-[-10px] shadow-md'}`} onClick={() => nv('/profile')}>
                        <FaUser className="text-[30px] text-blue-gray-500" />
                    </div>
                </>}
                {type === 'search' && <div className="flex items-center justify-center w-full">
                    <Input label="Qidiruv" ref={focus} icon={<FaSearch />} className="" />
                </div>}
            </div>
        </>
    );
}

export default Navbar;