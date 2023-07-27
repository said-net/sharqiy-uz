import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Auth from "../components/auth";

function Profile() {
    const { id, name, phone, role } = useSelector(e => e.auth);
    const [open, setOpen] = useState(false);
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            {!id &&
                <div className="flex items-center justify-center w-full h-[500px] flex-col">
                    <h1>Siz profilga kirmagansiz!</h1>
                    <Button onClick={() => setOpen(true)} className="rounded" color="red">Profilga kirish</Button>
                </div>
            }
            <Auth open={open} setOpen={setOpen} />
        </div>
    );
}

export default Profile;