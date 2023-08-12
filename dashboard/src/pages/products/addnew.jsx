import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, List, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBox, FaBoxes, FaImages, FaMoneyBill, FaMoneyCheck, FaPercent, FaRegFrown, FaYoutube } from 'react-icons/fa'
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshProduct } from "../../managers/product.manager";
function AddProduct({ open, setOpen }) {
    const [msg, setMsg] = useState({ error: false, msg: '' });
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState({ title: '', about: '', images: [], video: '', price: '', original_price: '', category: '', value: '', for_admins: '' });
    const [disableBtn, setDisableBtn] = useState(false);
    const dp = useDispatch();
    const [waitBtn, setWaitBtn] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        if (open) {
            axios(`${API_LINK}/category/getall`).then(res => {
                setIsLoad(true);
                const { ok, data } = res.data;
                if (ok) {
                    setCategories(data);
                }
            }).catch(() => {
                alert("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }, [open]);
    useEffect(() => {
        const { title, category, images, about, price, original_price, video, value } = state;
        if (!title || !category || ![...images][0] || !about || !price || !original_price || !video || !value) {
            setDisableBtn(true)
        } else {
            setDisableBtn(false)
        }
    }, [state]);
    //
    function Submit() {
        const { title, category, images, about, price, original_price, value, video, for_admins } = state;
        if (!title || !category || ![...images][0] || !about || !price || !original_price || !value || !video, !for_admins) {
            toast.error("Qatorlarni to'ldiring!")
        } else {
            setWaitBtn(true)
            const form = new FormData();
            form.append('title', title);
            form.append('about', about);
            form.append('category', category);
            form.append('price', price);
            form.append('original_price', original_price);
            form.append('value', value);
            form.append('video', video);
            form.append('for_admins', for_admins);
            [...images].forEach(image => {
                form.append('images', image)
            });
            axios.post(API_LINK + '/product/create', form, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, msg } = res.data;
                setWaitBtn(false)
                if (!ok) {
                    toast.error(msg);
                } else {
                    toast.success(msg);
                    dp(setRefreshProduct());
                    setOpen(false);
                    setState({ title: '', about: '', images: [], video: '', price: 0, original_price: 0, category: '', value: '', for_admins: '' });
                }
            }).catch(() => {
                setWaitBtn(false)
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Yangi mahsulot qo'shish</h1>
                </DialogHeader>
                {!isLoad ?
                    <div className="flex items-center justify-center w-full h-[400px]">
                        <Spinner />
                    </div> :
                    !categories[0] ?
                        <div className="flex items-center justify-center w-full h-[400px] flex-col">
                            <FaRegFrown className="text-[200px] text-blue-gray-200" />
                            <p className="capitalize text-blue-gray-200">Kategoriyalar mavjud emas!</p>
                        </div> :
                        <DialogBody className="w-full border-y overflow-y-scroll h-[450px]">
                            <div className="flex items-center justify-start flex-col w-full">
                                <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                                {/* TITLE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Mahsulot nomi" required onChange={e => setState({ ...state, title: e.target.value })} value={state.title} icon={<FaBox />} />
                                </div>
                                {/* IMAGES */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input type="file" accept="image/*" multiple label="Mahsulot rasmlari!" required onChange={e => { setState({ ...state, images: e.target.files }) }} icon={<FaImages />} />
                                </div>
                                {/* ABOUT */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Textarea label="Batafsil ma'lumot*" onChange={e => setState({ ...state, about: e.target.value })} value={state.about} />
                                </div>
                                {/* CATEGORY */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Select label="Kategoriyani tanlang!" onChange={e => setState({ ...state, category: e })} value={state.category}>
                                        {categories?.map(({ id, title }, i) => {
                                            return (
                                                <Option key={i} value={id} className="flex items-center">
                                                    {title}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                </div>
                                {/* ORIGINAL PRICE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Asl narxi/dona" required onChange={e => setState({ ...state, original_price: e.target.value })} type="number" value={state.original_price} icon={<FaMoneyBill />} />
                                </div>
                                {/* SOLD PRICE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Sotuv narxi/dona" required onChange={e => setState({ ...state, price: e.target.value })} type="number" value={state.price} icon={<FaMoneyCheck />} />
                                </div>
                                {/* SOLD PRICE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Adminlar uchun" required onChange={e => setState({ ...state, for_admins: e.target.value })} type="number" value={state.for_admins} icon={<FaPercent />} />
                                </div>
                                {/* VALUE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Nechta mahsulot mavjud" required onChange={e => setState({ ...state, value: e.target.value })} type="number" value={state.value} icon={<FaBoxes />} />
                                </div>
                                {/* VIDEO */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Youtube link" required onChange={e => setState({ ...state, video: e.target.value.trim() })} value={state.video} icon={<FaYoutube />} />
                                </div>
                            </div>
                        </DialogBody>
                }
                <DialogFooter className="w-full">
                    <Button onClick={() => setOpen(false)} className="rounded mr-[10px]" color="red">Bekor qilish</Button>
                    <Button onClick={Submit} className="rounded" color="green" disabled={disableBtn || waitBtn}>Saqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default AddProduct;