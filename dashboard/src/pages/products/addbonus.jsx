import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaBox, FaBoxes, FaCalendar } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_LINK } from "../../config";
import { useDispatch } from "react-redux";
import { setRefreshProduct } from "../../managers/product.manager";

function AddBonus({ open, setOpen }) {
    const [state, setState] = useState({ bonus_given: 0, bonus_count: 0, bonus_duration: 0, bonus_about: '' });
    const dp = useDispatch();
    function Submit() {
        if (state.bonus_given < 1 || state.bonus_count < 1 || state.bonus_duration < 1 || !state.bonus_about) {
            toast.error("Ma'lumotlarin to'g'ri to'ldiring!")
        } else {
            axios.post(API_LINK + '/product/set-bonus/' + open, state, {
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
                    setState({ bonus_given: 0, bonus_count: 0, bonus_duration: 0, bonus_about: '' });
                }
            })
        }
    }
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Bonus biriktirish</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y overflow-y-scroll">
                    {/* BONUSNI AKTIVLASH TIRISH UCHUN */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Sotib olish kerak / dona" required onChange={e => !isNaN(e.target.value) && setState({ ...state, bonus_count: Math.floor(e.target.value.trim()) })} value={state.bonus_count} icon={<FaBoxes />} />
                    </div>
                    {/* BONUSNI AKTIVLASH TIRISH UCHUN */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Bonus sifatida beriladi / dona" required onChange={e => !isNaN(e.target.value) && setState({ ...state, bonus_given: Math.floor(e.target.value.trim()) })} value={state.bonus_given} icon={<FaBox />} />
                    </div>
                    {/* BONUS HAQIDA BATAFSIL */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Textarea label="Bonus haqida batafsil" onChange={e => setState({ ...state, bonus_about: e.target.value })} value={state.bonus_about} />
                    </div>
                    {/* BONUSNI AKTIVLASH TIRISH UCHUN */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Bonus necha kun davom etadi?" required onChange={e => !isNaN(e.target.value) && setState({ ...state, bonus_duration: Math.floor(e.target.value.trim()) })} value={state.bonus_duration} icon={<FaCalendar />} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button onClick={() => setOpen('')} color="red" className="rounded mr-[10px]">BEKOR QILISH</Button>
                    <Button onClick={Submit} color="green" className="rounded" disabled={state.bonus_given < 1 || state.bonus_count < 1 || state.bonus_duration < 1 || !state.bonus_about}>SAQLaSH</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default AddBonus;