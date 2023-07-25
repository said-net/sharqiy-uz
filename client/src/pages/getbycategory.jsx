import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Chip, Spinner } from "@material-tailwind/react";
function GetProductsByCategory() {
    const { id } = useParams();
    const [isLoad, setIsLoad] = useState(false);
    const nv = useNavigate()
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
        <div className="flex items-center justify-start w-full m-[0px_0_100px_0]">
            {!isLoad && <Spinner />}
            {isLoad && !products[0] && <h1>Mahsulotlar vaqtinchalik mavjud emas!</h1>}
            {isLoad && products[0] &&
                <div className="flex items-center justify-start flex-col w-full">
                    {/* KATEGORIYA */}
                    <div className="m-[10px] flex items-center justify-start w-[98%] h-[100px] bg-white shadow-sm rounded-[10px] cursor-pointer hover:shadow-lg p-[5px] overflow-hidden">
                        <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full border overflow-hidden p-[10px] mr-[10px]" style={{ background: products[0]?.category?.background }}>
                            <img src={products[0]?.category?.image} alt="k rasm" />
                        </div>
                        <div className="flex items-start justify-start flex-col">
                            <h1 className="text-[20px] text-blue-gray-600">{products[0]?.category?.title}</h1>
                            <p className="text-[12px] text-blue-gray-300">{products?.length} hil mahsulot</p>
                        </div>
                    </div>
                    {/* MAHSULOTLAR */}
                    <div className="flex items-start justify-between w-full p-[0_2%]">
                        <div className="flex items-center justify-center w-[49%] flex-col">
                            {products.map((p, i) => {
                                return (
                                    (i + 1) % 2 !== 0 && <div key={i} onClick={() => nv('/product/' + p.id)} className="flex items-center justify-start flex-col w-[100%] mb-[6px] bg-white rounded shadow-md overflow-hidden">
                                        <img src={p.image} alt="c" />
                                        {p?.bonus && <Chip value={`AKSIYA: ${p?.bonus_count} = ${p?.bonus_given + p?.bonus_count} | ${p?.bonus_duration}`} color="green" className="w-full rounded mt-[5px] text-[9px] md:text-[12px]" />}
                                        <p className="w-full p-[0_2%]">{p.title}</p>
                                        <p className="w-full text-[15px] p-[0_2%] text-orange-300">{Number(p.price).toLocaleString()}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex items-center justify-center w-[49%] flex-col">
                            {products.map((p, i) => {
                                return (
                                    (i + 1) % 2 === 0 && <div key={i} onClick={() => nv('/product/' + p.id)} className="flex items-center justify-start flex-col w-[100%] mb-[6px] bg-white rounded shadow-md overflow-hidden">
                                        <img src={p.image} alt="c" />
                                        {p?.bonus && <Chip value={`AKSIYA: ${p?.bonus_count} = ${p?.bonus_given + p?.bonus_count} | ${p?.bonus_duration}`} color="green" className="w-full rounded mt-[5px] text-[9px] md:text-[12px]" />}
                                        <p className="w-full p-[0_2%]">{p.title}</p>
                                        <p className="w-full text-[15px] p-[0_2%] text-orange-300">{Number(p.price).toLocaleString()}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default GetProductsByCategory;