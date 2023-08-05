import { IconButton, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCirclePlus } from 'react-icons/fa6'
import { useSelector } from "react-redux";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import AddMain from "./add";
function MenuSettings() {
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.product);
    const [del, openDel] = useState('');
    const [add, setAdd] = useState(false);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/main/get-all`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg, data, products } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setState(data);
                setProducts(products)
            }
        }).catch(() => {
            setIsLoad(false);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }, [refresh]);


    return (
        <div className="flex items-center justify-start flex-col w-full mt-[10px]">
            <div className="flex items-center justify-end w-full">
                <IconButton onClick={() => setAdd(true)} className="rounded-full text-[20px]" color="blue-gray">
                    <FaCirclePlus />
                </IconButton>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !state[0] && <p>Reklama postlari mavjud emas!</p>}
            {isLoad && state[0] &&
                <div className="flex items-center justify-center w-full flex-wrap">
                    {
                        state?.map((p, i) => {
                            return (
                                <div key={i} className="flex shadow-md bg-white rounded m-[10px] flex-col hover:shadow-lg p-[10px]">
                                    <div className="flex items-center justify-center w-[320px] h-[180px] overflow-hidden">
                                        <img src={p?.image} alt="" />
                                    </div>
                                    <p className="w-full p-[0_10px]">{p?.product}</p>
                                </div>
                            )
                        })
                    }
                </div>
            }
            <AddMain open={add} setOpen={setAdd} products={products} />
        </div>
    );
}

export default MenuSettings;