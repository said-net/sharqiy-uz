import { Chip, IconButton, Input, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaClock, FaPlus, FaSearch } from 'react-icons/fa'
import CreateCompetition from "./create";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { API_LINK } from "../../config";
import { useNavigate } from "react-router-dom";
import { BiRefresh } from 'react-icons/bi'
import { setRefreshCategory } from "../../managers/category.manager";
function Competition() {
    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.category);
    const nv = useNavigate()
    const dp = useDispatch()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/competition/get-all`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg, data } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setState(data)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full my-[20px]">
            <div className="flex items-center justify-between w-full h-[50px] bg-white rounded shadow-md p-[0_10px]">
                <div className="flex items-center justify-center w-[200px]">
                    <Input label="Qidiruv" onChange={e => setSearch(e.target.value)} icon={<FaSearch />} />
                </div>
                <div className="flex items-center justify-center">
                    <IconButton className="mr-[10px] rounded-[20px] text-[20px]" onClick={() => dp(setRefreshCategory())}>
                        <BiRefresh />
                    </IconButton>
                    <IconButton className="rounded-full text-[20px]" color="green" onClick={() => setOpenCreate(true)}>
                        <FaPlus />
                    </IconButton>
                </div>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !state[0] &&
                <p>Konkurslar mavjud emas!</p>
            }
            {isLoad && state[0] && !search &&
                <div className="flex items-center justify-around flex-col w-full mt-[20px]">
                    {state?.map((k, i) => {
                        return (
                            <div onClick={() => nv('/get-competition-one/' + k.id)} key={i} className="flex items-center justify-between w-full h-[80px] bg-white shadow-md mb-[10px] rounded hover:shadow-lg cursor-pointer p-[0_10px]">
                                <p className="text-[12px] sm:text-[14px]">{k?.title?.slice(0, 15)}...</p>
                                <div className="flex items-start justify-center flex-col">
                                    <p className="text-[12px] sm:text-[14px]">{k?.start} dan</p>
                                    <p className="text-[12px] sm:text-[14px]">{k?.end} gacha</p>
                                </div>
                                <Chip value={k?.ended ? 'Tugatilgan' : 'Jarayonda'} color={k?.ended ? 'red' : 'green'} className="rounded tracking-[2px] font-light" />
                            </div>
                        )
                    })}
                </div>
            }
            {isLoad && state[0] && search &&
                <div className="flex items-center justify-around flex-col w-full mt-[20px]">
                    {state?.map((k, i) => {
                        return (
                            k?.title?.toLowerCase()?.includes(search?.toLowerCase()) && <div onClick={() => nv('/get-competition-one/' + k.id)} key={i} className="flex items-center justify-between w-full h-[80px] bg-white shadow-md mb-[10px] rounded hover:shadow-lg cursor-pointer p-[0_10px]">
                                <p className="text-[12px] sm:text-[14px]">{k?.title?.slice(0, 15)}...</p>
                                <div className="flex items-start justify-center flex-col">
                                    <p className="text-[12px] sm:text-[14px]">{k?.start} dan</p>
                                    <p className="text-[12px] sm:text-[14px]">{k?.end} gacha</p>
                                </div>
                                <Chip value={k?.ended ? 'Tugatilgan' : 'Jarayonda'} color={k?.ended ? 'red' : 'green'} className="rounded tracking-[2px] font-light" />
                            </div>
                        )
                    })}
                </div>
            }
            <CreateCompetition open={openCreate} setOpen={setOpenCreate} />
        </div>
    );
}

export default Competition;