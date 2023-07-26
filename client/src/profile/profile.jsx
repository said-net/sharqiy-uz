import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";

function Profile() {
    const { id, name, phone, role } = useSelector(e => e.auth);
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            {!id &&
                <div className="flex items-center justify-center w-full h-[500px] flex-col">
                    <h1>Siz profilga kirmagansiz!</h1>
                    <Button className="rounded" color="red">Profilga kirish</Button>
                </div>
            }
        </div>
    );
}

export default Profile;