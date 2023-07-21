import { Avatar, Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaImage, FaList, FaPen, FaSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setRefreshCategory } from "../../managers/category.manager";
import { API_LINK } from "../../config";

function AddCategory({ open, setOpen }) {
    const [state, setState] = useState({ title: '', image: '', background: '#fff' });
    const dp = useDispatch();
    const [msg, setMsg] = useState({ error: false, msg: '' });

    // 

    function Submit() {
        const form = new FormData();
        form.append('image', state.image);
        form.append('title', state.title);
        form.append('background', state.background);
        axios.post(`${API_LINK}/category/create`, form, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                dp(setRefreshCategory());
                setOpen(false);
                setState({ image: '', title: '', background: '#fff' });
            } else {
                setMsg({ error: true, msg });
            }
        }).catch(() => {
            setMsg({ error: true, msg: "Aloqani tekshirisb qayta urunib ko'ring!" });
        });
    }
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Yangi kategoriya qo'shish</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                    <div className="flex items-center justify-start w-full mb-[10px]">
                        {state.image ?
                            <Avatar size="xl" src={URL.createObjectURL(state.image)} alt="avatar" withBorder={true} className="p-[10px]" style={{ background: state.background }} />
                            :
                            <div className="flex items-center justify-center w-[50px] h-[50px] border rounded-full">
                                <FaImage className="text-[25px]" />
                            </div>
                        }
                        <label htmlFor="image" className="flex items-center justify-center ml-[20px] rounded p-[5px_10px] bg-[#4e5e7b] text-white shadow-lg">
                            <input onChange={e => setState({ ...state, image: e.target.files[0] })} type="file" id="image" accept="image/*" className="hidden" />
                            <FaImage className="mr-[10px]" />
                            Rasm tanlash
                        </label>
                    </div>
                    <div className="flex items-center justify-start w-full mb-[10px]">
                        <Input label="Nomi" value={state?.title} onChange={e => setState({ ...state, title: e.target.value })} required icon={<FaList />} />
                    </div>
                    <div className="flex items-center justify-start w-full mb-[10px]">
                        <Input type="color" onKeyPress={e => e.key === 'Enter' && Submit()} label="Orqa foni" value={state?.background} onChange={e => setState({ ...state, background: e.target.value })} required icon={<FaPen />} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button onClick={() => { setOpen(false); setState({ image: '', title: '' }) }} color="red" className="rounded">Bekor qilish</Button>
                    <IconButton className="rounded ml-[20px] text-[20px]" color="green" disabled={!state.image || !state.title} onClick={Submit}>
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default AddCategory;