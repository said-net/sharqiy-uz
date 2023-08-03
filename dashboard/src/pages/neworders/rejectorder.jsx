import { Button, Dialog, DialogFooter } from "@material-tailwind/react";
import axios from "axios";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshOrder } from "../../managers/order.manager";

function RejectOrder({ select, setSelect, setOpen }) {
    const dp = useDispatch();
    function Submit() {
        axios.post(`${API_LINK}/boss/set-status-order/${select?._id}`, { status: 'reject' }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.warning(msg);
                setSelect({ ...select, reject: false, id: 0, _id: '' });
                setOpen('');
                dp(setRefreshOrder());
            }
        })
    }
    return (
        <Dialog open={select?.reject} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <p className="text-[20px] text-black">#{select?.id} raqamli buyurtma bekor qilinsinmi?</p>
                <DialogFooter className="w-full flex items-center justify-between">
                    <Button className="rounded" color="orange" onClick={() => setSelect({ ...select, reject: false, id: 0, _id: '' })}>Ortga</Button>
                    <Button className="rounded" color="red" onClick={Submit}>Tasdiqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default RejectOrder;