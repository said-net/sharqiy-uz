import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Dialog, DialogBody, DialogHeader, IconButton, Input, Spinner, Textarea } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaMicrophone, FaX } from "react-icons/fa6";
import { FaPhone, FaUser } from "react-icons/fa";

function AdminRequests() {
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [select, setSelect] = useState({ open: false });
    useEffect(() => {
        setIsLoad(false);
        axios.get(`${API_LINK}/user/get-requests`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data);
            }
        }).catch(err => {
            console.log(err);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }, [refresh]);
    function setStatus() {
        axios.post(`${API_LINK}/user/set-status-my-sales`, {}, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setRefresh(!refresh);
            }
        })
    }
    return (

        <div className="flex items-center justify-start flex-col p-[10px]">
            <div className="flex items-center justify-between w-full mb-[10px]">
                <Link to={`/dashboard`} className="w-full underline">Ortga</Link>
                <Button className="rounded" onClick={setStatus}>Yangilarga o'tkazish</Button>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !state[0] && <p>So'rov mavjud emas!</p>}
            {isLoad && state[0] &&
                <>
                    <div className="flex items-center justify-between w-full h-[50px] mb-[10px] border-b-[2px]">
                        <p className="text-[12px] w-[24%] text-center">ID</p>
                        <p className="text-[12px] w-[24%] text-center">Maxsulot</p>
                        <p className="text-[12px] w-[24%] text-center">Mijoz</p>
                        <p className="text-[12px] w-[24%] text-center">Holat</p>

                    </div>
                    {state?.map((e, i) => {
                        return (
                            <div onClick={() => setSelect({ open: true, ...e })} key={i} className="flex items-center justify-between w-full h-[50px] mb-[10px] border-b-[2px]">
                                <p className="text-[12px]  w-[24%] text-center">ID: {e?.id}</p>
                                <p className="text-[12px]  w-[24%] text-center">{e?.title?.slice(0, 10)}...</p>
                                {/* <p className="text-[12px]">Operator: {e?.operator_id}</p> */}
                                <p className="text-[12px]  w-[24%] text-center">{e?.name}</p>
                                {e?.status === 'pending' && <p className="text-[12px] text-orange-500  w-[24%] text-center">Yangi</p>}
                                {/*  */}
                                {e?.status === 'reject' && <p className="text-[12px] text-red-500  w-[24%] text-center">Rad etilgan</p>}
                                {/*  */}
                                {e?.status === 'wait' && <p className="text-[12px] text-lime-500  w-[24%] text-center">Keyin oladi</p>}
                                {/*  */}
                                {e?.status === 'success' && <p className="text-[12px] text-blue-500  w-[24%] text-center">Tekshiruvda</p>}
                                {/*  */}
                                {e?.status === 'archive' && <p className="text-[12px] text-orange-500 w-[24%] text-center">Arxivlandi</p>}
                                {/*  */}
                                {e?.status === 'sended' && <p className="text-[12px] text-purple-500  w-[24%] text-center">Yetkazilmoqda</p>}
                                {/*  */}
                                {e?.status === 'delivered' && <p className="text-[12px] text-green-500  w-[24%] text-center">Yetkazilgan</p>}
                            </div>
                        )
                    })}
                </>
            }
            <Dialog open={select?.open} className="p-[0_10px]">
                <DialogHeader className="w-full flex items-center justify-between relative">
                    <h1 className="text-[16px]">{select?.title}</h1>
                    <div className="absolute top-[-20px] right-[-20px]">
                        <IconButton className="rounded-full" color="blue-gray" onClick={() => setSelect({ open: false })}>
                            <FaX />
                        </IconButton>
                    </div>
                </DialogHeader>
                <DialogBody className="border-y flex items-center justify-start flex-col">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={select?.name} label="Mijoz ismi" variant="standard" icon={<FaUser />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={select?.phone} label="Mijoz raqami" variant="standard" icon={<FaPhone />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Textarea value={select?.about} label="Izoh" variant="standard" />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={select?.operator_id} label="Operator" variant="standard" icon={<FaMicrophone />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={select?.date} label="Operator" variant="standard" icon={<FaMicrophone />} />
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
}

export default AdminRequests;