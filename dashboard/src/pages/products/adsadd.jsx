import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { API_LINK } from "../../config";
import { setRefreshProduct } from "../../managers/product.manager";
import { toast } from "react-toastify";
function AdsAdd({ open, setOpen }) {
    const dp = useDispatch();
    const [state, setState] = useState({ about: '', image: '' });
    function Submit() {
        const form = new FormData();
        form.append('about', state.about);
        form.append('image', state.image);
        axios.post(API_LINK + "/product/set-ads/" + open, form, {
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
        });
    }
    return (
        <>
            <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Reklama posti qo'shish</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input type="file" label="Post rasmi" required accept="image/*" onChange={e => setState({ ...state, image: e.target.files[0] })} />
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <Textarea type="text" label="Post matni" required onChange={e => setState({ ...state, about: e.target.value })} />
                        </div>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setOpen('')} className="rounded ml-[10px]" color="orange">Bekor qilish</Button>
                        <Button className="rounded ml-[10px]" color="green" disabled={!state?.image || state?.about?.length < 20} onClick={Submit}>Saqlash</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default AdsAdd;