import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { FaQuestion } from "react-icons/fa";
import axios from "axios";
import { API_LINK } from "../../config";
import { setRefreshOperator } from "../../managers/operator.manager";


function BanOperator({ select, setSelect }) {
    const [msg, setMsg] = useState({ error: false, msg: '' });  
    const dp = useDispatch()

    function Submit() {
        axios.put(API_LINK + '/operator/set-ban/' + select?._id , {},  {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            console.log(res.data);
            if (ok) {
                dp(setRefreshOperator());
                setSelect({ ban: false, edit: false, banned: false });
            } else {
                setMsg({ error: true, msg });
            }
        }).catch((err) => {
            console.log(err);
            setMsg({ error: true, msg: "Aloqani tekshirisb qayta urunib ko'ring!" });
        });
    }

    return (
        <>
            <Dialog open={select?.ban} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Operatorga ban berasizmi - {select?.name}</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                        <p className="flex items-center"><FaQuestion />
                            Diqqat Operatorga ban berilsinmi?
                        </p>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setSelect({ banned: false, edit: false})} className="rounded ml-[10px]" color="orange">Bekor qilish</Button>
                        <Button className="rounded ml-[10px]" color="red" onClick={Submit}
                        >Ban berish</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default BanOperator;