import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, List, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBox, FaBoxes, FaImages, FaMoneyBill, FaMoneyCheck, FaRegFrown, FaYoutube } from 'react-icons/fa'
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshProduct } from "../../managers/product.manager";


function EditProduct({select, setSelect}) {
    const [msg, setMsg] = useState({ error: false, msg: '' });
    const [isLoad, setIsLoad] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const dp = useDispatch();

    function Submit() {
        const { title, category, images, about, price, original_price, value, video } = select;
        if (!title || !category || ![...images][0] || !about || !price || !original_price || !value || !video) {
            toast.error("Qatorlarni to'ldiring!")
        } else {
            const form = new FormData();
            form.append('title', title);
            form.append('about', about);
            form.append('category', category);
            form.append('price', price);
            form.append('original_price', original_price);
            form.append('value', value);
            form.append('video', video);
            axios.put(API_LINK+'/product/create', form, {
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
                    setOpen(false);
                    setState({ title: '', about: '', images: [], video: '', price: 0, original_price: 0, category: '', value: '' });
                }
            }).catch(()=>{
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }
    return ( 
        <>

        </>
     );
}

export default EditProduct;