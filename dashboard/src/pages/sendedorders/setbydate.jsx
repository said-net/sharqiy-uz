import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import axios from "axios";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshOrder } from "../../managers/order.manager";
import { useState } from "react";

function SetByDate({ open, setOpen }) {
    const [date, setDate] = useState('');
    const dp = useDispatch();
    function Submit() {
        axios.post(`${API_LINK}/boss/set-status-by-date`, { date }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setDate('');
                setOpen(false);
                dp(setRefreshOrder());
            }
        });
    }
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <p className="text-[20px] text-black">Oy bo'yicha yetkazildi deb belgilash</p>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <div className="flex items-center justify-center w-full">
                        <Input label="OY-YIL" type="month" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full flex items-center justify-between">
                    <Button className="rounded" color="orange" onClick={() => setOpen(false)}>Ortga</Button>
                    <Button className="rounded" color="green" disabled={!date} onClick={Submit}>Tasdiqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default SetByDate;