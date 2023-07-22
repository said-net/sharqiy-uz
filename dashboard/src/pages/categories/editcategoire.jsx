import { Avatar, Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { API_LINK } from "../../config";
import { setRefreshCategory } from "../../managers/category.manager";
import { FaImage, FaList, FaPen, FaSave } from "react-icons/fa";

function EditCategory({ select, setSelect }) {
    const dp = useDispatch();
    const [msg, setMsg] = useState({ error: false, msg: '' });
    function Submit() {
        const { title, background, image, imgs } = select
        function App() {
            if (!imgs) {
                const data = new FormData()
                data.append('title', title)
                data.append('background', background)
                return data
            } else {
                const data = new FormData()
                data.append('title', title)
                data.append('background', background)
                data.append('image', imgs)
                return data
            }
        }
        axios.put(`${API_LINK}/category/edit/${select.id}`, App(), {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            if (ok) {
                dp(setRefreshCategory())
                setSelect(false)
                setSelect({ image: '', title: '', background: '#fff' });
            } else {
                setMsg({ error: true, msg });
            }
        }).catch(() => {
            setMsg({ error: true, msg: "Aloqani tekshirisb qayta urunib ko'ring!" });
        });
    }
    return (
        <>
            <Dialog open={select.edit} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Kategorya o'zgartirish</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                        <div className="flex items-center justify-start w-full mb-[10px]">
                            {select.imgs ?  
                                <Avatar size="xl" src={URL.createObjectURL(select.imgs)} alt="avatar" withBorder={true} className="p-[10px]" style={{ background: select.background }} />
                                :
                                <div className="flex items-center justify-center w-[50px] h-[50px] border rounded-full">
                                    <FaImage className="text-[25px]" />
                                </div>
                            }
                            <label htmlFor="image" className="flex items-center justify-center ml-[20px] rounded p-[5px_10px] bg-[#4e5e7b] text-white shadow-lg">
                                <input onChange={e => setSelect({ ...select, imgs: e.target.files[0] })} type="file" id="image" accept="image/*" className="hidden" />
                                <FaImage className="mr-[10px]" />
                                Rasm tanlash
                            </label>
                        </div>
                        <div className="flex items-center justify-start w-full mb-[10px]">
                            <Input label="Nomi" value={select?.title} onChange={e => setSelect({ ...select, title: e.target.value })} required icon={<FaList />} />
                        </div>
                        <div className="flex items-center justify-start w-full mb-[10px]">
                            <Input type="color" onKeyPress={e => e.key === 'Enter' && Submit()} label="Orqa foni" value={select?.background} onChange={e => setSelect({ ...select, background: e.target.value })} required icon={<FaPen />} />
                        </div>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => { setSelect(false); setSelect({ del: false, edit: '', id: '', title: '', background: '', image: ''}) }} color="red" className="rounded">Bekor qilish</Button>
                        <IconButton className="rounded ml-[20px] text-[20px]" color="green" disabled={!select.image || !select.title} onClick={Submit}>
                            <FaSave />
                        </IconButton>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default EditCategory;

 