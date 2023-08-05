import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { IconButton, Input, Spinner } from "@material-tailwind/react";
import { setRefreshChat } from "../../managers/chat.manager";
import { FaTelegram } from "react-icons/fa6";

function SelectChat() {
    const { id } = useParams();
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.chat);
    const [state, setState] = useState([]);
    const [msg, setMsg] = useState('');
    const dp = useDispatch()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/chat/select-chat/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { data, ok } = res.data;
            setIsLoad(true)
            if (ok) {
                setState(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);

    function SendMessage() {
        axios.post(`${API_LINK}/chat/new-boss-message/${id}`, { message: msg }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                dp(setRefreshChat());
                setMsg('');
            }
        })
    }

    return (
        <div className="flex items-center justify-normal flex-col w-full">
            {!isLoad && <Spinner />}
            {isLoad && !state[0] && <p>Mavjud emas!</p>}
            {isLoad && state[0] &&
                <>
                    <div className="flex items-center justify-start flex-col-reverse w-full h-[70vh] overflow-y-scroll border bg-white mt-[10px] rounded p-[10px]">
                        {
                            state?.map((m, i) => {
                                return (
                                    m?.from === 'user' ? <div className="flex w-full mb-[3px] items-center justify-start" key={i}>
                                        <p className={`p-[10px] ${m?.from === 'user' ? 'bg-blue-gray-500' : 'bg-blue-gray-300'} rounded-[10px_10px_10px_0px] text-white`} key={i}>{m?.message}</p>
                                    </div>
                                        : <div className="flex w-full mb-[3px] items-center justify-end" key={i}>
                                            <p className={`p-[10px] ${m?.from === 'user' ? 'bg-blue-gray-500' : 'bg-blue-gray-200'} rounded-[10px_10px_0_10px] text-white`} key={i}>{m?.message}</p>
                                        </div>
                                )
                            })
                        }
                    </div>
                    <div className="flex items-center justify-center w-full h-[50px] fixed bottom-[0px] left-0 bg-white">
                        <div className="flex items-center justify-center w-[80%]">
                            <Input label="Habaringiz" variant="standard" value={msg} onChange={e => setMsg(e.target.value)} />
                        </div>
                        <IconButton color="blue-gray" className="rounded-full text-[20px]" disabled={!msg} onClick={SendMessage}>
                            <FaTelegram />
                        </IconButton>
                    </div>
                </>
            }
        </div>
    );
}

export default SelectChat;