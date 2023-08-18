import { Button, Dialog, DialogFooter, DialogHeader } from "@material-tailwind/react";
import axios from "axios";
import { API_LINK } from "../config";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setRefreshOrders } from "../managers/order.manager";

function ConfirmChanges({ select, setSelect, setOpen }) {
    const dp = useDispatch();
    function Reject() {
        axios.post(`${API_LINK}/operator/set-status/${select?._id}`, { ...select, status: 'reject' }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setSelect({ del: false, view: false, success: false });
                setOpen('');
                setTimeout(() => {
                    dp(setRefreshOrders())
                }, 1000)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        });
    }

    function Wait() {
        axios.post(`${API_LINK}/operator/set-status/${select?._id}`, { ...select, status: 'wait' }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setSelect({ del: false, view: false, success: false });
                setOpen('');
                setTimeout(() => {
                    dp(setRefreshOrders())
                }, 1000)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        });
    }

    function Success() {
        axios.post(`${API_LINK}/operator/set-status/${select?._id}`, { ...select, status: 'success' }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setSelect({ del: false, view: false, success: false });
                setOpen('');
                setTimeout(() => {
                    dp(setRefreshOrders())
                }, 1000)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        });
    }

    return (
        <Dialog open={select?.open} size="xxl" className="flex items-center justify-center bg-[#0000005b] backdrop-blur-sm">
            <div className="flex items-center justify-center sm:w-[500px] w-[97%] bg-white shadow-sm  rounded flex-col p-[5px]">
                <DialogHeader className="w-full">
                    {select?.del && <h1 className="text-[15px]">Diqqat {select?.id} ID raqamli buyurtma bekor qilinsinmi? </h1>}
                    {select?.wait && <h1 className="text-[15px]">Diqqat {select?.id} ID raqamli buyurtma keyinroqqa o'tkizilsinmi? </h1>}
                    {select?.success && <h1 className="text-[15px]">Diqqat {select?.id} ID raqamli buyurtma {select?.status !== 'success' ? "tasdiqlansinmi?" : "taxrirlansinmi?"} </h1>}
                </DialogHeader>
                <DialogFooter className="w-full flex items-center justify-between">
                    <Button className="rounded" onClick={() => setSelect({ open: false, del: false, wait: false, success: false })}>Ortga</Button>
                    {select?.del && <Button onClick={Reject} color="red" className="rounded">OK</Button>}
                    {select?.wait && <Button onClick={Wait} color="orange" className="rounded">OK</Button>}
                    {select?.success && <Button onClick={Success} color="green" className="rounded">OK</Button>}
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default ConfirmChanges;