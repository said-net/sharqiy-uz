import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_LINK } from "../../config";
import { FaBox, FaBoxes, FaCashRegister, FaCreditCard, FaMoneyBill, FaMoneyBillAlt, FaMoneyCheck, FaShoppingCart, FaSuitcase } from "react-icons/fa";
import { SiCashapp } from 'react-icons/si'
import Formatter from "../../components/formatter";
function StatProduct({ open, setOpen }) {
    const [isLoad, setIsLoad] = useState(false);
    const [product, setProduct] = useState({});
    useEffect(() => {
        if (open !== '') {
            setIsLoad(false);
            axios(API_LINK + '/product/getone-from-admin/' + open, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, msg, data } = res.data;
                setIsLoad(true);
                if (ok) {
                    setProduct(data);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            });
        }
    }, [open]);
    const p = product
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">STATISTIKA</h1>
                </DialogHeader>
                {!isLoad ?
                    <div className="flex items-center justify-center w-full h-[400px]">
                        <Spinner />
                    </div> :
                    !product?.id ?
                        <div className="flex items-center justify-center w-full h-[400px] flex-col">
                            <FaRegFrown className="text-[200px] text-blue-gray-200" />
                            <p className="capitalize text-blue-gray-200">Statistika mavjud emas!</p>
                        </div> :
                        <DialogBody className="w-full border-y overflow-y-scroll h-[400px]">
                            <div className="flex items-center justify-start flex-col w-full">
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaBox className="mr-[10px]" /> Mahsulot: <b className="ml-[10px]">{p?.title}</b></p>
                                {/*  */}
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaShoppingCart className="mr-[10px]" /> Sotildi: <Formatter value={p?.solded} /> ta</p>
                                {/*  */}
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaBoxes className="mr-[10px]" /> Mavjud: <Formatter value={p?.value} /> ta</p>
                                {/*  */}
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaMoneyBill className="mr-[10px]" /> Asl narxi: <Formatter value={p?.original_price} /> so'm / dona</p>
                                {/*  */}
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaCashRegister className="mr-[10px]" /> Sotuv narxi: <Formatter value={p?.price} /> so'm / dona</p>
                                {/*  */}
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaMoneyBillAlt className="mr-[10px]" /> Mahsulotdan: <Formatter value={p?.price - p?.original_price} /> so'm / dona</p>
                                {/*  */}
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaCreditCard className="mr-[10px]" /> Sotuvlar: <Formatter value={p?.price * p?.solded} /> so'm / <Formatter value={p?.solded} /> ta uchun</p>
                                {/*  */}
                                <p className=" md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaMoneyCheck className="mr-[10px]" /> Foyda: <Formatter value={(p?.price * p?.solded) - (p?.original_price * p?.solded)} /> so'm / <Formatter value={p?.solded} /> ta uchun</p>
                                {/*  */}
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><FaSuitcase className="mr-[10px]" /> Mavjud: <Formatter value={(p?.price * p?.value)} /> so'm / <Formatter value={p?.value} /> ta uchun</p>
                                {/*  */}
                                <p className="md:text-[20px] text-gray-600 w-full border-b flex items-center py-[10px] text-[12px]"><SiCashapp className="mr-[10px]" /> Foyda qoladi: <Formatter value={(p?.price * p?.value) - (p?.original_price * p?.value)} /> so'm / <Formatter value={p?.value} /> ta uchun</p>
                            </div>
                        </DialogBody>
                }
                <DialogFooter className="w-full">
                    <Button className="rounded" color="orange" onClick={() => { setOpen(''); setIsLoad(false), setProduct({}) }}>Yopish</Button>
                </DialogFooter>
            </div>
        </Dialog>

    );
}

export default StatProduct;