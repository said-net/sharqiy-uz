import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Chip, Spinner } from "@material-tailwind/react";

function GetProductsByCategory() {
    const { id } = useParams();
    const [isLoad, setIsLoad] = useState(false);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/product/get-by-category/${id}`).then((res) => {
            const { data, msg, ok } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setProducts(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        });
    }, [id]);
    return (
        <div className="flex items-center justify-start w-full m-[20px_0_100px_0] p-[10px]">
            {!isLoad && <Spinner />}
            {isLoad && !products[0] && <h1>Mahsulotlar vaqtinchalik mavjud emas!</h1>}
            {isLoad && products[0] &&
                <div className="flex items-center justify-start flex-col w-full">
                    {/* KATEGORIYA */}
                    <div className="m-[10px] flex items-center justify-start w-[90%] sm:w-[300px] h-[100px] bg-white shadow-md rounded-[10px] cursor-pointer hover:shadow-lg p-[5px] overflow-hidden">
                        <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full border overflow-hidden p-[10px] mr-[10px]" style={{ background: products[0]?.category?.background }}>
                            <img src={products[0]?.category?.image} alt="k rasm" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <h1 className="text-[20px] text-blue-gray-600">{products[0]?.category?.title}</h1>
                            <p className="text-[12px] text-blue-gray-300">{products?.length} hil mahsulot</p>
                        </div>
                    </div>
                    {/* MAHSULOTLAR */}
                    <div className="grid grid-cols-2 gap-[10px] grid-rows-2 sm:grid-cols-3 lg:grid-cols-4">
                        {products.map((p, i) => {
                            return (
                                <div key={i} className="p-[10px] flex items-start justify-start flex-col h-[300px] md:h-[350px] bg-white shadow-md rounded-[10px] w-[170px] md:w-[250px] overflow-hidden hover:shadow-xl duration-300 cursor-pointer relative">
                                    <div className="flex items-start justify-center w-full h-[100px] overflow-hidden rounded-[10px] md:h-[150px]">
                                        <img src={p?.image} alt={i} className="w-full"/>
                                    </div>
                                    {p?.bonus && <Chip value={`AKSIYA: ${p?.bonus_count} = ${p?.bonus_given + p?.bonus_count} | ${p?.bonus_duration}`} color="green" className="w-full rounded mt-[5px] text-[9px] md:text-[12px]" />}
                                    <h1 className="text-blue-gray-500">{p.title}</h1>
                                    <p>{Number(p.price).toLocaleString()} so'm</p>
                                    <p className="text-[13px] text-blue-gray-400">Mavjud: {Number(p.value).toLocaleString()} ta</p>
                                    <p className="text-[13px] text-blue-gray-400">Sotildi: {Number(p.solded).toLocaleString()} ta</p>
                                    <div className="absolute bottom-[10px] left-[-10px] flex items-center justify-end w-full">
                                        <Button className="rounded" color="red">Sotib olish</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    );
}

export default GetProductsByCategory;