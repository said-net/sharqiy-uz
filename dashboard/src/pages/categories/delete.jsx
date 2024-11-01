import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import axios from "axios";
import { FaQuestion } from "react-icons/fa";
import { API_LINK } from "../../config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setRefreshCategory } from "../../managers/category.manager";

function DeleteCategory({ select, setSelect }) {
    const [msg, setMsg] = useState({ error: false, msg: '' });
    const dp = useDispatch();
    function SubmitDelete() {
        axios.delete(API_LINK + "/category/delete/" + select?.id, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            if (ok) {
                dp(setRefreshCategory())
                setSelect({ del: false, edit: false, recovery: false });
            } else {
                setMsg({ error: true, msg });
            }
        }).catch(() => {
            setMsg({ error: true, msg: "Aloqani tekshirisb qayta urunib ko'ring!" });
        });
    }
    // 
    function SubmitRecovery() {
        axios.put(API_LINK + "/category/recovery/" + select?.id, {}, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            if (ok) {
                dp(setRefreshCategory())
                setSelect({ del: false, edit: false, recovery: false });
            } else {
                setMsg({ error: true, msg });
            }
        }).catch(() => {
            setMsg({ error: true, msg: "Aloqani tekshirisb qayta urunib ko'ring!" });
        });
    }
    return (
        <>
            <Dialog open={select?.del} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Kategoryani o'chirish - {select?.title}</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                        <p className="flex items-center"><FaQuestion />
                            Diqqat Kategoriya o'chirilsinmi?
                            Unga biriktirilgan barcha mahsulotlar o'chiriladi!
                        </p>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setSelect({ del: false, edit: false, recovery: false })} className="rounded ml-[10px]" color="orange">Bekor qilish</Button>
                        <Button className="rounded ml-[10px]" color="red" onClick={SubmitDelete}>O'chirish</Button>
                    </DialogFooter>
                </div>
            </Dialog>

            <Dialog open={select?.recovery} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Kategoryani tiklansinmi? - {select?.title}</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                        <p className="flex items-center"><FaQuestion />
                            Kategoriyani qayta tiklamoqchimisiz?
                        </p>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setSelect({ del: false, edit: false, recovery: false })} className="rounded ml-[10px]" color="orange">Bekor qilish</Button>
                        <Button className="rounded ml-[10px]" color="green" onClick={SubmitRecovery}>Tiklash</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default DeleteCategory;