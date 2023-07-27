import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Carousel, Spinner } from "@material-tailwind/react";
import { BsQuestionCircleFill } from "react-icons/bs";
import RequestShop from "../components/requstshop";
import { AiOutlinePlayCircle } from 'react-icons/ai'
import YoutubePlayer from "../components/videoplayer";
import { useSelector } from "react-redux";
import Auth from "../components/auth";
function Product() {
    const { id } = useParams();
    const [isLoad, setIsLoad] = useState(false);
    const [product, setProduct] = useState({});
    const [showMore, setShowMore] = useState(false);
    const [openShop, setOpenShop] = useState({ id: '', title: '', count: 1, price: 0, bonus: false, bonus_given: 0, bonus_count: 0, name: '', phone: '+998', region: '' });
    const [openVideo, setOpenVideo] = useState('');
    const [openAuth, setOpenAuth] = useState(false);
    const { id: userId } = useSelector(e => e.auth)
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

    function setLike() {
        if (!userId) {
            setOpenAuth(true);
        }
    }
    const p = product;
    return (
        <div className="flex items-center justify-start flex-col w-full mb-[100px]">
            {!isLoad && <Spinner />}
            {isLoad && !product?.title &&
                <p>Mahsulot topilmadi!</p>
            }
            {isLoad && product?.title &&
                <>
                    <div className="flex items-center justify-center w-full relative">
                        <Carousel autoplay loop className="rounded-xl">
                            {product?.images?.map((i, k) => {
                                return (<img src={i} alt={k} key={k} className="h-full w-full object-cover" />)
                            })}
                        </Carousel>
                        <div className="flex items-center justify-center w-[120px] h-[35px] rounded-[10px] bg-white shadow-lg absolute bottom-[5px] left-[10px]" onClick={() => setOpenVideo(p?.video)}>
                            <AiOutlinePlayCircle className="text-[25px] mr-[10px]" /> Video
                        </div>
                    </div>
                    <div className="flex items-start justify-start flex-col w-[95%]">
                        {/*  */}
                        <h1 className="font-bold text-[22px]">{p?.title}</h1>
                        <p className="text-[14px] font-bold mt-[10px]">Narx:</p>
                        {/*  */}
                        <p className="text-[25px] font-bold">{Number(p?.price).toLocaleString()} so'm {p?.old_price &&
                            <span className="ml-[10px] text-[12px] font-normal"><s>{Number(p?.old_price).toLocaleString()} so'm</s> <span className="text-[red]">-{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></span>
                        }</p>
                        {/*  */}
                        <p className="my-[10px]">
                            <BsQuestionCircleFill className="inline mr-[10px] text-blue-gray-500" />
                            Mahsulot tavsifi
                        </p>
                        <p className="leading-7">{!showMore &&
                            p?.about?.slice(0, 150)
                        }</p>
                        <p className="leading-7">{showMore &&
                            p?.about
                        }</p>
                        {!showMore && <p onClick={() => setShowMore(true)} className="text-[17px] uppercase text-red-500 font-bold mt-[10px]">Batfsil ...</p>}

                        {showMore && <p onClick={() => setShowMore(false)} className="text-[17px] uppercase text-red-500 font-bold mt-[10px]">Qisqartma</p>}
                    </div>
                    <div className="flex items-center justify-center w-full fixed bottom-[60px] left-0">
                        <Button onClick={() => (setOpenShop({ ...openShop, id: p?.id, title: p?.title, bonus: p?.bonus, bonus_count: p?.bonus_count, bonus_given: p?.bonus_given }))} className="w-[98%] h-[50px] rounded-full text-[16px]" color="red">Sotib olish</Button>
                    </div>
                </>
            }
            <RequestShop openShop={openShop} setOpenShop={setOpenShop} />
            <YoutubePlayer open={openVideo} setOpen={setOpenVideo} />
            <Auth open={openAuth} setOpen={setOpenAuth} />
        </div>
    );
}

export default Product;