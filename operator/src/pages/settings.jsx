import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaTelegram } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";

function Settings() {
    const [state, setState] = useState({ telegram: '' });
    const { telegram, refresh } = useSelector(e => e.auth);
    useEffect(() => {
        setState({ telegram });
    }, [refresh]);
    function Submit() {
        axios.post(`${API_LINK}/operator/set-info`, state, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'irng!")
        })
    }
    return (
        <div className="flex items-center justify-start flex-col mt-[20px] rounded w-ful ">
            <div className="flex items-center flex-col p-[20px] justify-start w-full max-w-[375px] bg-white h-[400px] shadow-sm rounded relative">
                <div className="flex items-center justify-center w-full max-w-[375px]">
                    <Input label="Telegram ID" variant="standard" value={state.telegram} onChange={e => setState({ ...state, telegram: e.target.value })} icon={<FaTelegram />} />
                </div>
                <div className="absolute bottom-[10px] left-0 w-full flex items-center justify-center">
                    <Button className="w-[90%] rounded" onClick={Submit}>Saqlash</Button>
                </div>
            </div>
        </div>
    );
}

export default Settings;