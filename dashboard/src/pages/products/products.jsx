import { Button, IconButton, Input } from "@material-tailwind/react";
import { useState } from "react";
import { FaPlusCircle, FaSearch } from 'react-icons/fa'
import AddProduct from "./addnew";
function Products() {
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <div className="flex items-center justify-between w-full my-[10px] bg-white rounded-[10px] shadow-md h-[75px] border p-[0_10px]">
                <div className="flex items-center justify-center w-[200px] md:w-[400px] ">
                    <Input label="Qidirish: Nomi" value={search} onChange={e => setSearch(e.target.value)} icon={<FaSearch />} />
                </div>
                <Button onClick={() => setOpenAdd(true)} className="hidden sm:inline-block rounded">Yangi qo'shish</Button>
                <IconButton onClick={() => setOpenAdd(true)} className="sm:hidden inline-block rounded-full text-[20px]">
                    <FaPlusCircle />
                </IconButton>
                <AddProduct open={openAdd} setOpen={setOpenAdd} />
            </div>
        </div>
    );
}

export default Products;

