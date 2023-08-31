import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { Carousel, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import Auth from "../user/auth";
import YouTube from "react-youtube";
import YoutubePlayer from "../components/videoplayer";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";

function Home() {
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState({ main: [], videos: [], products: [] });
    const { id } = useSelector(e => e.auth);
    const [refreshLikes, setRefreshLikes] = useState(false);
    const [likes, setLikes] = useState([]);
    const [openAuth, setOpenAuth] = useState(false);

    const nv = useNavigate();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/main/get-for-client`).then(res => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data)
            }
        });
    }, []);

    setTimeout(() => {
        setRefreshLikes(!refreshLikes)
    }, 1200);

    useEffect(() => {
        if (id) {
            // setIsLoad(false)
            axios(`${API_LINK}/user/get-likes`, {
                headers: {
                    'x-user-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, data } = res.data;
                // setIsLoad(true)
                if (ok) {
                    setLikes(data);
                }
            });
        }
    }, [refreshLikes]);

    function setLike(pid) {
        if (!id) {
            setOpenAuth(true);
        } else {
            axios(`${API_LINK}/user/set-like/${pid}`, {
                headers: {
                    'x-user-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok } = res.data;
                if (ok) {
                    setRefreshLikes(!refreshLikes);
                }
            });
        }
    }
    const [videoDetail, setVideoDetail] = useState({ id: '', title: '' });
    const [openVideo, setOpenVideo] = useState('');
    return (
        <div className="flex items-center justify-start flex-col w-full">
            {!isLoad && <Spinner />}
            {/*  */}
            {isLoad && state?.main[0] &&
                <div className="flex items-center justify-center w-full bg-white shadow-md mb-[20px]">
                    <Carousel autoplay loop>
                        {state?.main?.map((m, key) => {
                            return (
                                <div onClick={() => nv('/product/' + m.id)} key={key} className="flex items-center justify-center w-full h">
                                    <img src={m?.image} alt={key} />
                                </div>
                            )
                        })}
                    </Carousel>
                </div>
            }
            {/*  */}
            {isLoad && state?.products[0] && <div className="flex items-start justify-between w-full p-[0_2%]">
                <div className="flex items-center justify-center w-[49%] flex-col">
                    {state?.products?.map((p, i) => {
                        return (
                            i === 0 && <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">

                                {!likes?.includes(p?.id) && <FaRegHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {likes?.includes(p?.id) && <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div onClick={() => nv('/product/' + p?.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px]">
                                    <img src={p.image} alt="c" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p?.pid)}>
                                    <p className="w-full p-[0_2%] my-[10px]">
                                        {p?.title?.slice(0, 15) + '...'}
                                    </p>
                                    {p?.old_price &&
                                        <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> -<span className="text-[red]">{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                    }
                                    <p className=" absolute bottom-[10px] w-full p-[0_2%] font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center justify-center w-[49%] flex-col">
                    {state?.products?.map((p, i) => {
                        return (
                            i === 1 && <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">
                                {!likes?.includes(p?.id) && <FaRegHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {likes?.includes(p?.id) && <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div onClick={() => nv('/product/' + p?.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px]">
                                    <img src={p.image} alt="c" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p?.pid)}>
                                    <p className="w-full p-[0_2%] my-[10px]">
                                        {p?.title?.slice(0, 15) + '...'}

                                    </p>
                                    {p?.old_price &&
                                        <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> -<span className="text-[red]">{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                    }
                                    <p className=" absolute bottom-[10px] w-full p-[0_2%] font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            }
            {/*  */}
            {isLoad && state?.videos[0] &&
                <div className="flex items-center justify-start w-full overflow-x-scroll h-[300px] p-[0_10px] mb-[20px] shadow-md">
                    {state?.videos?.map((v, i) => {
                        return (
                            <div key={i} className="flex relative mr-[20px] w-[200px]" onClick={() => { setOpenVideo(v.video); setVideoDetail({ id: v.pid, title: v.product }) }}>
                                <div className="w-full h-[300px] absolute top-0 left-0 z-[99]"></div>
                                <ReactPlayer playIcon={<FaPlay />} url={v?.video} controls height={300} />
                                <div className="absolute w-full h-[50px] bottom-0 left-0 bg-black flex items-center justify-center">
                                    <p className="text-white p-[5px] border">Katta ekran</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            {/*  */}
            {isLoad && state?.products[0] && <div className="flex items-start justify-between w-full p-[0_2%]">
                <div className="flex items-center justify-center w-[49%] flex-col">
                    {state?.products?.map((p, i) => {
                        return (
                            (i % 2) === 0 && <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">

                                {!likes?.includes(p?.id) && <FaRegHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {likes?.includes(p?.id) && <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div onClick={() => nv('/product/' + p?.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px]">
                                    <img src={p.image} alt="c" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p?.pid)}>
                                    <p className="w-full p-[0_2%] my-[10px]">
                                        {p?.title?.slice(0, 15) + '...'}
                                    </p>
                                    {p?.old_price &&
                                        <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> -<span className="text-[red]">{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                    }
                                    <p className=" absolute bottom-[10px] w-full p-[0_2%] font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center justify-center w-[49%] flex-col">
                    {state?.products?.map((p, i) => {
                        return (
                            (i % 2) !== 0 && <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">
                                {!likes?.includes(p?.id) && <FaRegHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {likes?.includes(p?.id) && <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div onClick={() => nv('/product/' + p?.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px]">
                                    <img src={p.image} alt="c" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p?.pid)}>
                                    <p className="w-full p-[0_2%] my-[10px]">
                                        {p?.title?.slice(0, 15) + '...'}

                                    </p>
                                    {p?.old_price &&
                                        <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> -<span className="text-[red]">{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                    }
                                    <p className=" absolute bottom-[10px] w-full p-[0_2%] font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            }
            <Auth open={openAuth} setOpen={setOpenAuth} />

            <YoutubePlayer open={openVideo} setOpen={setOpenVideo} title={videoDetail.title} id={videoDetail.id} />
        </div>
    );
}

export default Home;