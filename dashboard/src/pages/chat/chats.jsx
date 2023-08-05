import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Chats() {
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.chat);
    const nv = useNavigate()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/chat/get-chats`, {
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
    return (
        <div className="flex items-center justify-start flex-col w-full min-h-[500px] bg-white mt-[10px] rounded shadow-sm p-[10px]">
            {!isLoad && <p>Kuting...</p>}
            {isLoad && !state[0] && <p>Habarlar mavjud emas!</p>}
            {isLoad && state[0] &&
                state.map((e, i) => {
                    return (
                        <div onClick={() => nv('/select-chat/' + e._id)} className="flex items-center justify-between w-full mb-[10px] border h-[50px] rounded p-[0_10px] cursor-pointer hover:shadow-md" key={i}>
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white border">
                                    <p className="text-[30px]">{e?.from?.name?.slice(0, 1)}</p>
                                </div>
                                <p className="ml-[10px]">{e?.from?.name}</p>
                            </div>
                            <p>{e?.sender === 'user'?'Buyurtmachi: ':'Siz: '}{e?.message?.slice(0, 10)}...</p>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Chats;