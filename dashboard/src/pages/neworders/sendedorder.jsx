import { Button, Dialog, DialogFooter } from "@material-tailwind/react";
import axios from "axios";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshOrder } from "../../managers/order.manager";
import { useState } from "react";

function SendedOrder({ select, setSelect, setOpen }) {
    const dp = useDispatch();
    const [success, setSuccess] = useState('');
    const [disabled, setDisabled] = useState(false);
    function Submit() {
        setDisabled(true)
        axios.post(`${API_LINK}/boss/set-status-order/${select?._id}`, { status: 'sended' }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setDisabled(false)
            const { ok, msg, data } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setSuccess(data)
            }
        }).catch(() => {
            setDisabled(false)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }
    function Close() {
        setSelect({ ...select, sended: false, id: 0, _id: '' });
        setOpen('');
        dp(setRefreshOrder());
    }
    return (
        <Dialog open={select?.sended} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                {!success && <p className="text-[20px] text-black">#{select?.id} raqamli buyurtma buyurtmachiga yuborildimi?</p>}
                {success && <p className="text-[20px] text-black">#{select?.id} raqamli buyurtma buyurtmachiga yuborildi! Chekni olishingiz mumkin!</p>}
                <DialogFooter className="w-full flex items-center justify-between">
                    {!success &&
                        <>
                            <Button className="rounded" color="orange" onClick={() => { setSelect({ ...select, sended: false, id: 0, _id: '' }) }} disabled={disabled}>Ortga</Button>
                            <Button disabled={disabled} className="rounded" color="green" onClick={Submit}>Tasdiqlash</Button>
                        </>
                    }
                    {success &&
                        <>
                            <Button className="rounded" color="orange" onClick={Close} disabled={disabled}>Ortga</Button>
                            <Button className="rounded" color="green" onClick={() => window.open(success)} disabled={disabled}>Chekni olish</Button>
                        </>
                    }
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default SendedOrder;