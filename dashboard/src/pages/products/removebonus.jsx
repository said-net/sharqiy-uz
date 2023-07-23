import { Button, Dialog, DialogFooter, DialogHeader } from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_LINK } from "../../config";
import { useDispatch } from "react-redux";
import { setRefreshProduct } from "../../managers/product.manager";

function RemoveBonus({ open, setOpen }) {
    const dp = useDispatch();
    function Submit() {
        axios.post(API_LINK + '/product/remove-bonus/' + open, {}, {
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
                setOpen('');
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Bonus tizimi olib tashlansinmi?</h1>
                </DialogHeader>
                <DialogFooter className="w-full">
                    <Button onClick={() => setOpen('')} color="red" className="rounded mr-[10px]">BEKOR QILISH</Button>
                    <Button onClick={Submit} color="green" className="rounded">OLISH</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default RemoveBonus;