import { Avatar, Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Option, Select, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaImage, FaList, FaSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { API_LINK } from "../../config";
import { setRefreshPost } from "../../managers/post.manager";

function AddPost({ open, setOpen, categories }) {
    const [state, setState] = useState({ title: '', image: '', about: '', category: '' });
    const dp = useDispatch();
    const [msg, setMsg] = useState({ error: false, msg: '' });
    // 
    function Submit() {
        const form = new FormData();
        form.append('image', state.image);
        form.append('title', state.title);
        form.append('about', state.about);
        form.append('category', state.category);
        axios.post(`${API_LINK}/post/create`, form, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                dp(setRefreshPost());
                setOpen(false);
                setState({ title: '', image: '', about: '', category: '' });
            } else {
                setMsg({ error: true, msg });
            }
        }).catch(() => {
            setMsg({ error: true, msg: "Please check the connections!" });
        });
    }
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Add new post</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                    <div className="flex items-center justify-start w-full mb-[10px]">
                        <div className="flex items-center justify-center w-[200px] h-[150px] overflow-hidden border rounded">
                            {!state.image ?
                                <FaImage className="text-[50px]" />
                                :
                                <img src={URL.createObjectURL(state.image)} alt="From pic" />
                            }
                        </div>
                        <label htmlFor="image" className="flex items-center justify-center ml-[20px] rounded p-[5px_10px] bg-[#4e5e7b] cursor-pointer text-white shadow-lg">
                            <input onChange={e => setState({ ...state, image: e.target.files[0] })} type="file" id="image" accept="image/*" className="hidden" />
                            <FaImage className="mr-[10px]" />
                            Select image
                        </label>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-full mb-[10px]">
                        <Input onKeyPress={e => e.key === 'Enter' && Submit()} label="Title" value={state?.title} onChange={e => setState({ ...state, title: e.target.value })} required icon={<FaList />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-full mb-[10px]">
                        <Textarea label="Description" onChange={e => setState({ ...state, about: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-full mb-[10px]">
                        <Select label="Select a category" onChange={e => setState({ ...state, category: e })}>
                            {categories?.map((category, key) => {
                                return (
                                    <Option key={key} value={category?.id}>
                                        <Avatar src={category?.image} alt="Pics" size="sm" className="w-[20px] h-[20px] mr-[10px]" />
                                        {category?.title}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button onClick={() => { setOpen(false); setState({ image: '', title: '' }) }} color="red" className="rounded">Close</Button>
                    <IconButton className="rounded ml-[20px] text-[20px]" color="green" disabled={!state.image || !state.title || !state.category || !state.about} onClick={Submit}>
                        <FaSave />
                    </IconButton>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default AddPost;