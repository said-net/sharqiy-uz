import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Carousel, Chip, Spinner } from "@material-tailwind/react";

function Product() {
    const { id } = useParams();
    const [isLoad, setIsLoad] = useState(false);
    const [product, setProduct] = useState({});
    useEffect(() => {
        setIsLoad(false);
        setProduct({});
        axios(`${API_LINK}/product/get-one/${id}`).then((res) => {
            const { ok, data } = res.data;
            if (ok) {
                setProduct(data);
                setIsLoad(true);
            } else {
                toast.error("Mahsulot topilmadi!")
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }, [id]);
    const p = product;
    return (
        <div className="flex items-start justify-start flex-col w-full p-[10px] mb-[500px]">
            {!isLoad && <Spinner />}
            {isLoad && !product?.title &&
                <p>Mahsulot topilmadi!</p>
            }
            {isLoad && product?.title &&
                <>
                    <Carousel className="rounded-xl">
                        {product?.images?.map((i, k) => {
                            return (<img src={i} alt={k} key={k} className="h-full w-full object-cover" />)
                        })}
                    </Carousel>
                    {p?.bonus && <Chip value={`AKSIYA: ${p?.bonus_count} = ${p?.bonus_given + p?.bonus_count} | ${p?.bonus_duration}`} color="green" className="w-full rounded mt-[5px] text-[15px] md:text-[12px]" />}
                    <h1 className="text-[30px] text-blue-gray-700">{p?.title}</h1>
                    <p className="text-orange-400">Narxi: {Number(p?.price).toLocaleString()} so'm</p>
                    <div className="w-full h-[1px] bg-blue-gray-200 m-[10px_0]">
                        <p className="text-start">{p?.about}</p>
                    </div>
                    <div className="flex items-center justify-center w-full fixed bottom-[90px] left-0">
                        <Button className="w-[90%] rounded" color="red">Sotib olish</Button>
                    </div>
                </>
            }
        </div>
    );
}

export default Product;