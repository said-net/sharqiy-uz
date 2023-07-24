import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

function Categories() {
    const [isLoad, setIsLoad] = useState(false);
    const [categories, setCategories] = useState([]);
    const nv = useNavigate()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/category/getall`).then(res => {
            setIsLoad(true);
            const { data, ok } = res.data;
            if (ok) {
                setCategories(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib koring!")
        });
    }, []);
    return (
        <div className="flex items-center justify-start flex-col w-full">
            {!isLoad &&
                <div className="mt-[20px]">
                    <Spinner />
                </div>
            }
            {isLoad && !categories[0] &&
                <div className="flex items-center justify-normal flex-col h-[400px]">
                    <h1>Kategoriyalar mavjud emas!</h1>
                </div>
            }
            {isLoad && categories[0] &&
                <div className="flex items-center justify-center flex-wrap m-[20px_0_100px_0] p-[10px]">
                    {categories.map((c, i) => {
                        return (
                            <div onClick={() => nv('/get-by-category/' + c.id)} key={i} className="m-[10px] flex items-center justify-start w-[90%] sm:w-[300px] h-[100px] bg-white shadow-md rounded-[10px] cursor-pointer hover:shadow-lg p-[5px] overflow-hidden">
                                <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full border overflow-hidden p-[10px] mr-[10px]" style={{ background: c.background }}>
                                    <img src={c.image} alt="k rasm" />
                                </div>
                                <div className="flex items-start justify-start flex-col">
                                    <h1 className="text-[20px] text-blue-gray-600">{c.title}</h1>
                                    <p className="text-[12px] text-blue-gray-300">{c.products} hil mahsulot</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default Categories;