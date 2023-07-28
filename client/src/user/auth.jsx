import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshAuth } from "../managers/authManager";
import Regions from '../components/regions.json';
function Auth({ open, setOpen }) {
    const auth_info = JSON.parse(localStorage.getItem('auth_info'));
    const [state, setState] = useState({ phone: auth_info?.phone ? auth_info?.phone : '+998', code: '', role: 'buyer', ref_id: localStorage.getItem('ref_id'), name: '', location: '' });
    const [wait, setWait] = useState(false);
    const [refr, setRefr] = useState(false);
    const [enableForm, setEnableForm] = useState(false);
    const dp = useDispatch();
    function RequestSMS() {
        setWait(true);
        axios.post(`${API_LINK}/user/request-sms`, state).then(res => {
            const { ok, msg, data } = res.data;
            setWait(false);
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                localStorage.setItem('auth_info', JSON.stringify({ ...data, phone: state.phone }));
                setRefr(!refr);
                setEnableForm(true);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    // 
    function VerifyCode() {
        setWait(true);
        const form = {
            phone: state.phone,
            code: state.code,
            name: state.name,
            location: state.location
        }
        axios.post(`${API_LINK}/user/verify-code`, form).then(res => {
            const { ok, msg, token } = res.data;
            setWait(false);
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                localStorage.setItem('access', token);
                setOpen(false);
                setTimeout(() => {
                    dp(setRefreshAuth());
                }, 1000)
            }
        });
    }

    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center w-full h-[100vh] bg-[#000000ab] backdrop-blur-sm">
            <div className="flex items-center justify-start flex-col w-[90%] rounded bg-white p-[5px]">
                <DialogHeader className="text-[15px] w-full relative">
                    <h1>Ro'yhatdan o'tish / Kirish </h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <p className="text-center text-[20px]">{state?.role === 'buyer' && 'Haridor sifatida kirish'}</p>
                    <p className="text-center text-[20px]">{state?.role === 'seller' && 'Reklamachi sifatida kirish'}</p>
                    <div className="flex items-center justify-center w-full mb-[10px] relative">
                        <Input type="tel" label="Raqamingiz" required onChange={e => setState({ ...state, phone: e.target.value })} value={state.phone} />
                        <button disabled={state?.phone?.length < 13} className={`absolute right-[5px] w-[100px] h-[30px] ${state?.phone?.length < 13 ? 'bg-light-blue-200' : 'bg-light-blue-500'} text-white rounded `} onClick={RequestSMS} >Kodni olish</button>
                        {/* </div> */}
                    </div>
                    {enableForm && <>
                        <div className="flex items-center justify-center w-full mb-[10px] relative">
                            <Input disabled={state?.phone?.length < 13} type="tel" label="SMS kod" required onChange={e => setState({ ...state, code: e.target.value })} value={state.code} />
                        </div>
                        {/*  */}
                        {auth_info?.new === true &&
                            <>
                                <div className="flex items-center justify-center w-full mb-[10px] relative">
                                    <Input type="text" label="Ismingiz" required onChange={e => setState({ ...state, name: e.target.value })} value={state.name} />
                                </div>
                                {/*  */}
                                <div className="flex items-center justify-center w-full mb-[10px] relative">
                                    <Select label="Hududingiz" value={state.location} onChange={e => setState({ ...state, location: e })}>
                                        {Regions?.map((e, i) => {
                                            return <Option key={i} value={`${e?.id}`}>{e?.name}</Option>
                                        })}
                                    </Select>
                                </div>
                            </>
                        }
                    </>}
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button onClick={() => setOpen(false)} color="orange" className="rounded mr-[10px]">Yopish</Button>
                    <Button onClick={VerifyCode} color="green" className="rounded w-[170px]" disabled={state?.phone?.length < 13 || state?.code?.length < 4 || auth_info?.new && !state?.name || auth_info?.new && !state.location}>Kirish</Button>
                </DialogFooter>
            </div>
            {wait &&
                <div className="flex items-center justify-center w-full h-[100vh] bg-[#0000008b] backdrop-blur-sm fixed top-0 left-0">
                    <h1 className="text-white text-[24px]">Kuting...</h1>
                </div>
            }
        </Dialog>
    );
}

export default Auth;