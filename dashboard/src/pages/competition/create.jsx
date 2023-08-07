import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaCalendar, FaImage, FaNewspaper } from "react-icons/fa";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshCategory } from "../../managers/category.manager";

function CreateCompetition({ open, setOpen }) {
    const [state, setState] = useState({ title: '', image: '', about: '', duration: '' });
    const dp = useDispatch()
    function Submit() {
        const form = new FormData();
        form.append('title', state.title);
        form.append('image', state.image);
        form.append('about', state.about);
        form.append('duration', state.duration);
        axios.post(`${API_LINK}/competition/create`, form, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setOpen(false);
                dp(setRefreshCategory())
            }
        })
    }
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <p className="text-[20px]">Konkurs hosil qilish va eskisini yakunlash</p>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Konkurs nomi" variant="standard" required onChange={e => setState({ ...state, title: e.target.value })} icon={<FaNewspaper />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input type="file" accept="image/*" variant="standard" label="Konkurs rasmi" required onChange={e => setState({ ...state, image: e.target.files[0] })} icon={<FaImage />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Textarea label="Konkurs haqida batafsil" variant="standard" required onChange={e => setState({ ...state, about: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Konkurs davomiyligi(Kun)" variant="standard" required onChange={e => setState({ ...state, duration: e.target.value })} icon={<FaCalendar />} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button onClick={() => setOpen(false)} className="rounded mr-[10px]" color="orange">Bekor qilish</Button>
                    <Button onClick={() => Submit()} className="rounded" disabled={!state.image || isNaN(state.duration) || !state.image || !state.about || state.duration < 1} color="green">Saqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default CreateCompetition;