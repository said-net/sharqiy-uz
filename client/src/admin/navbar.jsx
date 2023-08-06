import { FaBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
    const nv = useNavigate()
    return (
        <div className="flex items-center justify-between w-full h-[50px] bg-white shadow-sm fixed top-0 left-0 z-[99] p-[0_2%]">
            <div className="flex items-center justify-center underline" onClick={() => nv('/')}>
                <FaBackward className="mr-[10px]" />
                Marketga
            </div>
        </div>
    );
}

export default AdminNavbar;