import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaImage } from "react-icons/fa6";
import { API_LINK } from "../../config";
import { setRefreshProduct } from "../../managers/product.manager";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function AddMain({ open, setOpen, products }) {
    const [state, setState] = useState({ product: '', image: '' });
    const dp = useDispatch();
    function Submit() {
        const form = new FormData();
        form.append('product', state.product);
        form.append('image', state.image);
        axios.post(`${API_LINK}/main/create-post`, form, {
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
        }).catch(()=>{
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Reklama posti qo'shish</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input type="file" accept="image/*" label="Post rasmi" required onChange={e => setState({ ...state, image: e.target.files[0] })} icon={<FaImage />} />
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Select label="Maxsulotni tanlang" onChange={e => setState({ ...state, product: e })}>
                            {products?.map((e, i) => {
                                return (
                                    <Option key={i} value={e?.id}>{e?.title}</Option>
                                )
                            })}
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button className="rounded mr-[10px]" onClick={() => setOpen(false)} color="orange">Ortga</Button>
                    <Button className="rounded" color="green" disabled={!state?.image || !state?.product} onClick={Submit}>Saqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default AddMain;