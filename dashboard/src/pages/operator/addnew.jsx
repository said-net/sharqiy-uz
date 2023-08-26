import { Avatar, Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaLock, FaPhone, FaSave, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { API_LINK } from "../../config";
import { setRefreshOperator } from "../../managers/operator.manager";
import { toast } from 'react-toastify'


function AddNew({ open, setOpen }) {
    const [state, setState] = useState({ name: '', phone: '+998', password: '#fff' });
    const [msg, setMsg] = useState({ error: false, msg: '' });
    const dp = useDispatch();
    function Submit() {
        const { name, phone, password } = state
        if (!name || !phone || !password) {
            toast.error("Qatorlarni to'ldiring!")
        } else {
            const form = new FormData();
            form.append('name', name)
            form.append('phone', phone)
            form.append('password', password)
            axios.post(API_LINK + '/operator/create', form, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, msg } = res.data
                if (ok) {
                    dp(setRefreshOperator());
                    setOpen(false)
                    setState({ name: '', phone: '+998', password: '' });
                    toast.success(msg)
                } else {
                    setMsg({ error: true, msg })
                }
            }).catch(() => {
                toast.error('Aloqani tekshirib qayta urinib ko\'ring\'')
            });
        }
    }
    return (
        <>
            <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Yangi operator qo'shish</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                        <div className="flex items-center justify-start w-full mb-[10px]">
                            <Input label="Ism kirgizing!" onChange={e => setState({ ...state, name: e.target.value.trim() })} icon={<FaUser />} required />
                        </div>
                        <div className="flex items-center justify-start w-full mb-[10px]">
                            <Input label="Telfon raqam kirgizning!" onChange={e => setState({ ...state, phone: e.target.value.trim() })} value={state.phone} required icon={<FaPhone />} />
                        </div>
                        <div className="flex items-center justify-start w-full mb-[10px]">
                            <Input label="Parol kirgizing!" onChange={e => setState({ ...state, password: e.target.value.trim() })} icon={<FaLock />} required />
                        </div>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => { setOpen(false); setState({ name: '', phone: '', password: '' }) }} color="red" className="rounded">Bekor qilish</Button>
                        <IconButton onClick={Submit} className="rounded ml-[20px] text-[20px]" color="green" disabled={!state.name || !state.phone} >
                            <FaSave />
                        </IconButton>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default AddNew;