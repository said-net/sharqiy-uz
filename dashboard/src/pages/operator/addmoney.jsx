import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";

function OperatorAddMoney({ open, setOpen }) {
    const [state, setState] = useState({ value: '', comment: '' });
    const [disable, setDisable] = useState(false);
    function Submit() {
        console.log(state);

        setDisable(true);
        axios.post(`${API_LINK}/boss/add-money-to-operator/${open?.id}`, state, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisable(false);
            if (!ok) {
                toast.error(msg);
            } else {
                setState({ value: '', comment: '' });
                setOpen({ id: '', name: '', open: false });
                toast.success(msg);
            }
        }).catch(() => {
            setDisable(false);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open?.open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Operator: {open?.name}</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <div className="flex items-center justify-start w-full mb-[10px]">
                        <Input type="number" label="Necha pul qo'shasiz? 5000 | -5000" onChange={e => setState({ ...state, value: e.target.value.trim() })} icon={<FaMoneyBill />} required />
                    </div>
                    <div className="flex items-center justify-start w-full">
                        <Textarea label="Kommentariya yozing" onChange={e => setState({ ...state, comment: e.target.value })} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button disabled={disable} onClick={() => setOpen({ open: false, name: '', id: '' })} className="rounded text-[11px] mr-[10px]" color="red">Bekor qilish</Button>
                    <Button disabled={!state?.value || !state?.comment || disable} className="rounded text-[11px]" onClick={Submit} color="green">Saqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default OperatorAddMoney;