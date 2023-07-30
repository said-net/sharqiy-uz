import { Dialog, IconButton } from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import YouTube from 'react-youtube';
function YoutubePlayer({ open, setOpen }) {
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center w-full h-[100vh] bg-[#000000ab] backdrop-blur-sm">
            <div className="flex items-center justify-start flex-col w-[90%] rounded bg-white p-[5px] relative">
                <div className="absolute  top-[-20px] right-[-20px]">
                    <IconButton onClick={() => {
                        setOpen('')
                    }} color="blue-gray" className="rounded-full text-[24px]">
                        <MdClose />
                    </IconButton>
                </div>
                <YouTube videoId={open?.split('/')?.reverse()[0]} opts={{width: '100%', playerVars: {autoplay: 1}}} />
            </div>
        </Dialog>
    );
}

export default YoutubePlayer;