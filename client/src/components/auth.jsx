import { Dialog, DialogHeader } from "@material-tailwind/react";
import { useState } from "react";

function Auth({ open, setOpen }) {
    const [state, setState] = useState({ name: '', phone: '', password: '', role: 'buyer' })
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center w-full h-[100vh] bg-[#000000ab] backdrop-blur-sm">
            <div className="flex items-center justify-start flex-col w-[90%] rounded bg-white p-[5px]">
                <DialogHeader className="text-[15px] w-full relative">
                    <h1>Ro'yhatdan o'tish / Kirish </h1>
                </DialogHeader>
            </div>
        </Dialog>
    );
}

export default Auth;