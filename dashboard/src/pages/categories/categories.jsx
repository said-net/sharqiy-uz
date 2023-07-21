import { Avatar, Button, IconButton, Input, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaSearch, FaRegFrown, FaAlignRight } from "react-icons/fa";
import AddCategory from "./addnew";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_LINK } from "../../config";

function Categories() {
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    const { refresh } = useSelector(e => e.category);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/category/getall`).then(res => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setCategories(data);
            }
        });
    }, [refresh]);
    return (
        <>
            <div className="flex items-center justify-between w-full my-[10px] bg-white rounded-[10px] shadow-md h-[75px] border p-[0_10px]">
                <div className="flex items-center justify-center w-[200px] md:w-[400px] ">
                    <Input label="Qidirish: Nomi" value={search} onChange={e => setSearch(e.target.value)} icon={<FaSearch />} />
                </div>
                <Button onClick={() => setOpenAdd(true)} className="hidden sm:inline-block rounded">Yangi qo'shish</Button>
                <IconButton onClick={() => setOpenAdd(true)} className="sm:hidden inline-block rounded-full text-[20px]">
                    <FaPlusCircle />
                </IconButton>
                <AddCategory open={openAdd} setOpen={setOpenAdd} />
            </div>
            {!isLoad ?
                <div className="flex items-center justify-center w-full h-[400px]">
                    <Spinner />
                </div> :
                !categories[0] ?
                    <div className="flex items-center justify-center w-full h-[400px] flex-col">
                        <FaRegFrown className="text-[200px] text-blue-gray-200" />
                        <p className="capitalize text-blue-gray-200">Kategoriyalar mavjud emas!</p>
                    </div> :
                    !search ?
                        categories.map(({ image, title, id, background }, key) => {
                            return (
                                <div key={key} className="flex items-center justify-between w-full h-[70px] p-[0_10px] bg-[#fff] shadow-md border rounded mb-[10px] hover:shadow-lg backdrop-blur-md">
                                    <div className="flex items-center justify-center rounded-full " >
                                        <Avatar style={{ background }} size="lg" src={image} withBorder color="blue-gray" className="p-[5px]" />
                                        <p className="ml-[10px]">{title}</p>
                                    </div>
                                    <IconButton className="rounded-full" color="blue-gray">
                                        <FaAlignRight />
                                    </IconButton>
                                </div>
                            )
                        })
                        :
                        categories.map(({ image, title, id, background }, key) => {
                            return (
                                title?.toLowerCase()?.includes(search?.toLowerCase()) ?
                                    <div key={key} className="flex items-center justify-between w-full h-[70px] p-[0_10px] bg-[#fff] shadow-md border rounded mb-[10px] hover:shadow-lg backdrop-blur-md">
                                        <div className="flex items-center justify-center rounded-full " >
                                            <Avatar style={{ background }} size="lg" src={image} withBorder color="blue-gray" className="p-[5px]" />
                                            <p className="ml-[10px]">{title}</p>
                                        </div>
                                        <IconButton className="rounded-full" color="blue-gray">
                                            <FaAlignRight />
                                        </IconButton>
                                    </div> : null
                            )
                        })
            }
        </>
    );
}

export default Categories;