import axios from "axios";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { API_LINK } from "../config";
import { Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
function VideoPlayers() {
    const [videos, setVideos] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const nv = useNavigate();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/product/get-videos`).then(res => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setVideos(data);
            }
        })
    }, [])
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            {!isLoad && <Spinner />}
            {isLoad && videos[0] &&
                videos?.map((v, i) => {
                    return (
                        <div key={i} className="flex items-center justify-start flex-col w-375px overflow-hidden bg-white min-h-[500px] mb-[30px] shadow-sm rounded overflow-[hidden] relative">
                            <YouTube loading="lazy" videoId={v?.video?.split('/')?.reverse()[0]} opts={{ width: '375px', height: '500px', playerVars: { autoplay: 0, listType: 'user_uploads', controls: 0, enablejsapi: 0, disablekb: 1 } }} />
                            <div className="flex items-start justify-start flex-col w-[376px] h-[110px] backdrop-blur-sm bg-[#000000a3] absolute bottom-0 p-[5px]">
                                <button className="text-white rounded bg-[#e0e0e0a6] w-full h-[40px]" onClick={() => nv('/product/' + v._id)}>MAHSULOTGA O'TISH</button>
                                <h1 className="text-white text-start mt-[15px]">{v?.title}</h1>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default VideoPlayers;