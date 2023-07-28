import { useState } from "react";
import { useSelector } from "react-redux";
import NotAuth from "./notauth";

function Profile() {
    const { id, name, phone, role } = useSelector(e => e.auth);
    const [open, setOpen] = useState(false);
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            {!id &&
                <NotAuth />
            }
            {
                id && <p>{name}</p>
            }
        </div>
    );
}

export default Profile;