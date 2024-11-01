import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { API_LINK } from "../../config";
import { setRefreshProduct } from "../../managers/product.manager";
function AddValue({ select, setSelect }) {
    const [msg, setMsg] = useState({ error: false, msg: '' });
    const dp = useDispatch();
    const [value, setValue] = useState('');
    function Submit() {
        axios.put(API_LINK + "/product/add-value/" + select?.id, { value: +value }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            if (ok) {
                dp(setRefreshProduct());
                setSelect({ ...select, join_value: false })
            } else {
                setMsg({ error: true, msg });
            }
        }).catch((err) => {
            setMsg({ error: true, msg: "Aloqani tekshirisb qayta urunib ko'ring!" });
        });
    }
    return (
        <>
            <Dialog open={select?.join_value} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Mahsulot qo'shasizmi!</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                        <p className="">Tovarlar soni: {select?.old} ta</p>
                        <Input value={value} label="Tovar qo'shish" onChange={e => setValue(e.target.value)} type="number" />
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setSelect({ ...select, join_value: false })} className="rounded ml-[10px]" color="orange">Bekor qilish</Button>
                        <Button className="rounded ml-[10px]" color="red" onClick={Submit}>Qo'shish</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default AddValue;