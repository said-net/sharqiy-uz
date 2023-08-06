import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaImage } from "react-icons/fa6";
import { API_LINK } from "../../config";
import { setRefreshProduct } from "../../managers/product.manager";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function DeleteMain({ open, setOpen }) {
    const dp = useDispatch();
    function Submit() {
        axios.delete(`${API_LINK}/main/delete-post/${open}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            if (ok) {
                dp(setRefreshProduct());
                setOpen('')
                toast.success(msg)
            } else {
                toast.error(msg)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Reklama posti o'chirilsinmi?</h1>
                </DialogHeader>
                <DialogFooter className="w-full">
                    <Button className="rounded mr-[10px]" onClick={() => setOpen('')} color="orange">Ortga</Button>
                    <Button className="rounded" color="red" onClick={Submit}>O'chirish</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default DeleteMain;