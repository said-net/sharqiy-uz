import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Spinner } from "@material-tailwind/react";
import { FaX } from 'react-icons/fa6'
import { setRefreshOperator } from "../../managers/operator.manager";
import { BiRefresh } from "react-icons/bi";
function OperatorPays() {
    const [list, setList] = useState([]);
    const [isLoad, setisLoad] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e.operator);
    const [select, setSelect] = useState({ id: '', status: '' });
    function setStatus(st) {
        if (st === 'reject') {
            axios.post(`${API_LINK}/boss/set-operator-pay-status`, { status: 'reject', id: select?.id }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`,
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                if (!ok) {
                    toast.error(msg)
                } else {
                    toast.warning(msg);
                    dp(setRefreshOperator())
                    setSelect({ id: '', status: '' })
                }
            }).catch(err => {
                console.log(err);
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            });
        } else if (st === 'success') {
            axios.post(`${API_LINK}/boss/set-operator-pay-status`, { status: 'success', id: select?.id }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`,
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                if (!ok) {
                    toast.error(msg)
                } else {
                    toast.success(msg);
                    dp(setRefreshOperator())
                    setSelect({ id: '', status: '' })
                }
            }).catch(err => {
                console.log(err);
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            });
        }
    }
    useEffect(() => {
        setisLoad(false)
        axios(`${API_LINK}/boss/get-operator-pays`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`,
            }
        }).then(res => {
            setisLoad(true)
            const { ok, data, msg } = res.data;
            if (!ok) {
                toast.error(msg)
            } else {
                setList(data)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh])
    return (
        <div className="flex items-center justify-between w-full flex-col mt-[20px]">
            <div className="flex items-center justify-end w-full h-[50px] bg-white shadow-md rounded mb-[10px]">
                <IconButton className="mr-[10px] rounded-[20px] text-[20px]" onClick={() => dp(setRefreshOperator())}>
                    <BiRefresh />
                </IconButton>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !list[0] &&
                <p>Pul chiqarish uchun sorovlar mavjud emas!</p>
            }
            {isLoad && list[0] &&
                list?.map((l, i) => {
                    return (
                        <div onClick={() => setSelect({ id: l?._id, status: '', ...l })} className="flex items-center justify-between w-full mb-[10px] h-[70px] bg-white shadow-md rounded p-[0_10px] cursor-pointer" key={i}>
                            <div className="flex items-center justify-center">
                                No: {i + 1}.
                            </div>
                            <div className="flex items-center justify-center flex-col">
                                <p className="text-[13px]">{l?.from?.name}</p>
                                <p className="text-[13px]">{l?.from?.phone}</p>
                            </div>
                            <div className="flex items-center justify-center flex-col">
                                <p className="text-[13px]">{Number(l?.count).toLocaleString()} so'm</p>
                                <p className="text-[13px]">{(Number(l?.card))}</p>
                            </div>
                        </div>
                    )
                })
            }
            <Dialog open={select?.id !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full relative flex items-center justify-between">
                        <p className="text-[20px]">Operator uchun to'lov</p>
                        <IconButton onClick={() => setSelect({ id: '', status: '' })}>
                            <FaX />
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className="text-black">Operator: {select?.from?.name}</p>
                        <p className="text-black">Raqami: {select?.from?.phone}</p>
                        <p className="text-black">Karta: {select?.card}</p>
                        <p className="text-black">Summa: {Number(select?.count).toLocaleString()} so'm</p>
                        <p className="text-[20px] text-black border-t">DIQQAT to'ov qilgach to'landi tugmasini rad etilsa rad etildi tugmasini bosing!</p>
                    </DialogBody>
                    <DialogFooter className="flex items-center justify-between w-full">
                        <Button className="rounded" color="red" onClick={() => setStatus('reject')}>Rad etildi</Button>
                        <Button className="rounded" color="green" onClick={() => setStatus('success')}>To'landi</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </div>
    );
}

export default OperatorPays;