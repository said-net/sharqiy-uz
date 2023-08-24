import { Chip, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Option, Select, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { TbTarget, TbTargetOff } from 'react-icons/tb'
function Admins() {
    const [search, setSearch] = useState('');
    const [admins, setAdmins] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [type, setType] = useState('id');
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-users`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setAdmins(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    function setTargetolog(id) {
        axios(`${API_LINK}/boss/set-targetolog/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                setRefresh(!refresh);
                toast.success(msg);
            }
        });
    }
    function removeTargetolog(id) {
        axios(`${API_LINK}/boss/remove-targetolog/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                setRefresh(!refresh);
                toast.success(msg);
            }
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[10px]">
            <div className="flex items-center justify-center w-full bg-white shadow-sm rounded mb-[10px] flex-col p-[10px_0]">
                <div className="flex items-center justify-center w-full p-[0_5px] mb-[10px]">
                    <Input label="Qidiruv: ID, Raqam, Ism" icon={<FaSearch />} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex items-center justify-center w-full p-[0_5px]">
                    <Select value={type} onChange={e => setType(e)} label="Qidiruv filteri">
                        <Option value="id">ID Orqali</Option>
                        <Option value="phone">Raqam Orqali</Option>
                    </Select>
                </div>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !admins[0] &&
                <p>Adminlar mavjud emas!</p>
            }
            {isLoad && admins[0] && admins?.filter(e => !search ? e : type === 'id' ? e?.id === Number(search) : e?.phone?.includes(search)).map((u, i) => {
                return (
                    <div key={i} className={`flex items-center justify-between w-full h-[40px] ${(i + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-50'} p-[0_10px]`}>
                        <p className="text-[12px] flex items-center w-[25%] sm:text-[16px]">ID: {u?.id}{u?.targetolog && <Chip className="text-[12px] p-[3px] font-light rounded ml-[10px]" value={'Target'} />}</p>
                        <p className="text-[12px] w-[33%] flex items-center justify-center sm:text-[16px]">{u?.name}</p>
                        <p className="text-[12px] w-[33%] flex items-center justify-end sm:text-[16px]">
                            {u?.phone}
                            <Menu>
                                <MenuHandler>
                                    <IconButton className="rounded h-[25px] w-[25px] ml-[10px]">
                                        <FaBars />
                                    </IconButton>
                                </MenuHandler>
                                <MenuList>
                                    {
                                        u?.targetolog &&
                                        <MenuItem className="flex items-center justify-center text-red-500" onClick={() => removeTargetolog(u?._id)}>
                                            <TbTargetOff />
                                            Targetologdan olish
                                        </MenuItem>
                                    }
                                    {
                                        !u?.targetolog &&
                                        <MenuItem className="flex items-center justify-center text-green-500" onClick={() => setTargetolog(u?._id)}>
                                            <TbTarget />
                                            Targetolog qlish
                                        </MenuItem>
                                    }
                                </MenuList>
                            </Menu>
                        </p>
                    </div>
                )
            })
            }
        </div>
    );
}

export default Admins;