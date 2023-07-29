import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBox, FaBoxes, FaMoneyBill, FaMoneyCheck, FaYoutube } from 'react-icons/fa'
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshProduct } from "../../managers/product.manager";


function EditProduct({ select, setSelect }) {
    const [msg, setMsg] = useState({ error: false, msg: '' });
    const [isLoad, setIsLoad] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [disableBtn, setDisableBtn] = useState(false);
    const [categories, setCategories] = useState([]);
    console.log(select?.category);
    const dp = useDispatch();

    useEffect(() => {
        setIsLoad(false)
        axios.get(API_LINK + '/category/getall').then(res => {
            setIsLoad(true)
            const { ok, data } = res.data
            if (ok) {
                setCategories(data)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urinib ko'ring!")
        })
    }, [])
    function Submit() {
        const { title, category, about, price, original_price, value, video } = select;
        if (!title || !about || !price || !original_price || !value || !video) {
            toast.error("Qatorlarni to'ldiring!")
        } else {
            const form = new FormData();
            form.append('title', title);
            form.append('about', about);
            form.append('category', newCategory ? newCategory : category);
            form.append('price', price);
            form.append('original_price', original_price);
            form.append('value', value);
            form.append('video', video);
            axios.put(API_LINK + '/product/edit/' + select?.id, form, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data, msg } = res.data;
                if (!ok) {
                    toast.error(msg);
                } else {
                    toast.success(msg);
                    dp(setRefreshProduct());
                    setSelect({ ...select, edit: false });
                }
            }).catch((err) => {
                console.log(err);
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }
    return (
        <>
            <Dialog open={select.edit} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Taxrirlash</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y overflow-y-scroll h-[450px]">
                        {!isLoad ? <Spinner /> :
                            <div className="flex items-center justify-start flex-col w-full">
                                <p className={`text-center mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`} onClick={() => setMsg({ error: false, msg: '' })}>{msg.msg}</p>
                                {/* TITLE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Mahsulot nomi" required onChange={e => setSelect({ ...select, title: e.target.value })} value={select.title} icon={<FaBox />} />
                                </div>
                                {/* ABOUT */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Textarea label="Batafsil ma'lumot*" onChange={e => setSelect({ ...select, about: e.target.value })} value={select.about} />
                                </div>
                                {/* CATEGORY */}
                                <div className="flex items-center flex-col justify-center w-full mb-[10px]">
                                    <p className="text-black w-full">Joriy kategoriya: {categories?.find(e => e.id === select?.category)?.title}</p>
                                    <Select label="Yangi kategoriya tanlash!" onChange={e => setNewCategory(e)} value={newCategory}>
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
                                    <Input label="Asl narxi/dona" required onChange={e => !isNaN(e.target.value) && setSelect({ ...select, original_price: Math.floor(e.target.value.trim()) })} value={select.original_price} icon={<FaMoneyBill />} />
                                </div>
                                {/* SOLD PRICE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Sotuv narxi/dona" required onChange={e => !isNaN(e.target.value) && setSelect({ ...select, price: Math.floor(e.target.value.trim()) })} value={select.price} icon={<FaMoneyCheck />} />
                                </div>
                                {/* VALUE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Nechta mahsulot mavjud" required onChange={e => !isNaN(e.target.value) && setSelect({ ...select, value: Math.floor(e.target.value.trim()) })} value={select.value} icon={<FaBoxes />} />
                                </div>
                                {/* VALUE */}
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input label="Youtube link" required onChange={e => setSelect({ ...select, video: e.target.value.trim() })} value={select.video} icon={<FaYoutube />} />
                                </div>
                            </div>
                        }
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setSelect({ edit: false, del: false, })} className="rounded mr-[10px]" color="red">Bekor qilish</Button>
                        <Button onClick={Submit} className="rounded" color="green" disabled={disableBtn}>Saqlash</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default EditProduct;