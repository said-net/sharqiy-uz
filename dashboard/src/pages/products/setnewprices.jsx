import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import axios from "axios";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshProduct } from "../../managers/product.manager";
function SetNewPrices({ open, setOpen }) {
    const dp = useDispatch();
    function Submit() {
        axios.post(`${API_LINK}/product/set-new-prices/${open?.id}`, { price: open?.price, new_price: open?.new_price }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefreshProduct());
                setOpen({ id: '', price: '', new_price: '' });
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urinib ko'ring!")
        })
    }
    return (
        <Dialog open={open?.id !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Narxni o'zgartirish</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <Input value={open?.price} label="Eski narxi" onChange={e => !isNaN(e.target.value) && setOpen({ ...open, price: Math.floor(e.target.value.trim()) })} required />
                    <div className="my-[10px]"></div>
                    <Input value={open?.new_price} label="Yangi narxi" onChange={e => !isNaN(e.target.value) && setOpen({ ...open, new_price: Math.floor(e.target.value.trim()) })} required />
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button onClick={() => setOpen({ id: '', price: 0, new_price: 0 })} className="rounded ml-[10px]" color="orange">Bekor qilish</Button>
                    <Button disabled={open?.new_price < 10 || !open?.price} className="rounded ml-[10px]" color="green" onClick={Submit}>Saqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default SetNewPrices;