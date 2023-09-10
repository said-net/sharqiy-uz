import { Button, Input, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { FaPhone, FaUsers } from "react-icons/fa";

function Settings() {
    const [state, setState] = useState({ for_operators: 0, for_ref: 0 });
    const [delivery, setDelivery] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [type, setType] = useState('settings');
    function editValue(id, value) {
        setDelivery(delivery.map(deli => {
            if (deli?.id === +id) {
                return { ...deli, price: +value };
            } else {
                return deli;
            }
        }));
    }
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/setting/get-settings`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data, delivery } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data);
                setDelivery(delivery);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, []);
    function Submit() {
        axios.post(`${API_LINK}/setting/set-settings`, state, {
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
        })
    }
    function SubmitDelivery() {
        axios.post(`${API_LINK}/setting/set-delivery`, { list: delivery }, {
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
            toast.error("Aloqani tekshirib qayta urinib ko'ring!")
        })
    }
    return (
        <div className="flex items-center justify-normal flex-col w-full" >
            <h1 className="text-[20px] bg-white p-[10px_20px] rounded-[0_0_10px_10px] shadow-md mb-[20px]">SOZLAMALAR</h1>
            <div className="flex items-center justify-start flex-col w-[370px] bg-white rounded-[10px] min-h-[500px] shadow-sm p-[10px] relative">
                {!isLoad && <Spinner />}
                {isLoad &&
                    <>
                        <div className="flex items-center justify-between w-full mb-[10px]">
                            <p className={`cursor-pointer ${type === 'settings' ? 'text-black underline' : 'text-gray-500'}`} onClick={() => setType('settings')}>Sozlamalar</p>
                            <p className={`cursor-pointer ${type === 'delivery' ? 'text-black underline' : 'text-gray-500'}`} onClick={() => setType('delivery')}>Dostavka</p>
                        </div>
                        {type === 'settings' &&
                            <>
                                <div className="flex items-start justify-start w-full flex-col mb-[10px]">
                                    <h1>Operatorlar uchun summa*</h1>
                                    <Input label="Summani kiriting" required onChange={e => setState({ ...state, for_operators: e.target.value })} value={state.for_operators} onKeyPress={e => e.key === 'Enter' && Submit()} icon={<FaPhone />} />
                                </div>
                                <div className="flex items-start justify-start w-full flex-col">
                                    <h1>Referal uchun summa*</h1>
                                    <Input label="Summani kiriting" required onChange={e => setState({ ...state, for_ref: e.target.value })} value={state.for_ref} onKeyPress={e => e.key === 'Enter' && Submit()} icon={<FaUsers />} />
                                </div>
                            </>
                        }
                        {type === 'delivery' &&
                            delivery[0] && delivery?.map((d, i) => {
                                return (
                                    <div key={i} className="flex items-center justify-center w-full mb-[10px]">
                                        <Input label={`Hudud: ${d?.name}`} value={d?.price} onChange={e => editValue(d?.id, e.target.value)} />
                                    </div>
                                )
                            })
                        }
                    </>
                }
                {type === 'settings' && <div className="absolute bottom-[10px] left-0 w-full p-[10px]">
                    <Button onClick={Submit} fullWidth className="rounded" color="red">Saqlash</Button>
                </div>}
                {type === 'delivery' &&
                    <Button onClick={SubmitDelivery} fullWidth className="rounded" color="red">Saqlash</Button>
                }
            </div>
        </div>
    );
}

export default Settings;