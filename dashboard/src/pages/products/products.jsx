import { Button, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaMoneyBill, FaPencilAlt, FaPlus, FaPlusCircle, FaRegFrown, FaSearch, FaTrash, } from 'react-icons/fa'
import { TbGift, TbGiftOff } from 'react-icons/tb'
import { MdGraphicEq } from 'react-icons/md'
import AddProduct from "./addnew";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { BsThreeDotsVertical } from 'react-icons/bs'
import DelProduct from "./delproduct";
import AddBonus from "./addbonus";
import AddValue from "./addvalue";
import StatProduct from "./statproduct";
import RemoveBonus from "./removebonus";
import EditProduct from "./editproduct";
import SetNewPrices from "./setnewprices";
function Products() {
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [openBonusAdd, setOpenBonusAdd] = useState('');
    const [openBonusRemove, setOpenBonusRemove] = useState('');
    const [openProductStat, setOpenProductStat] = useState('');
    const [products, setProducts] = useState([]);

    const [select, setSelect] = useState({ del: false, edit: false, join_value: false, id: '', recovery: false });

    const [openPrice, setOpenPrice] = useState({ price: 0, new_price: 0, id: '' });
    const { refresh } = useSelector(e => e.product);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/product/getall-from-admin`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg, data } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setProducts(data);
            }
        }).catch(() => {
            setIsLoad(false);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }, [refresh]);

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
            {!isLoad ?
                <div className="flex items-center justify-center w-full h-[400px]">
                    <Spinner />
                </div> :
                !products[0] ?
                    <div className="flex items-center justify-center w-full h-[400px] flex-col">
                        <FaRegFrown className="text-[200px] text-blue-gray-200" />
                        <p className="capitalize text-blue-gray-200">Mahsulotlar mavjud emas!</p>
                    </div> :
                    !search ?
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[5px] lg:grid-cols-5">
                            {products?.map((e, i) => {
                                return (
                                    <div className="flex items-start justify-start flex-col w-[175px] p-[5px] h-[330px] bg-white rounded shadow-sm hover:shadow-md" key={i}>
                                        {/* IMAGE */}
                                        <div className="flex items-start rounded justify-center w-full overflow-hidden relative h-[200px]">
                                            <img src={e?.image} alt="Rasm" />
                                            <Menu>
                                                <MenuHandler>
                                                    <div className="absolute top-[-5px] right-[-5px]">
                                                        <IconButton color="gray" className=" rounded-full bg-[#0000] shadow-none">
                                                            <BsThreeDotsVertical className="text-black text-[20px]" />
                                                        </IconButton>
                                                    </div>
                                                </MenuHandler>
                                                <MenuList>
                                                    <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, ...e, join_value: true, old: e?.value })}>
                                                        <FaPlus className="mr-[10px]" /> Qo'shish
                                                    </MenuItem>
                                                    <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, ...e, edit: true })}>
                                                        <FaPencilAlt className="mr-[10px]" /> Tahrirlash
                                                    </MenuItem>
                                                    {!e?.bonus ? <MenuItem className="flex items-center" onClick={() => setOpenBonusAdd(e?.id)}>
                                                        <TbGift className="mr-[10px]" /> Bonus qo'shish
                                                    </MenuItem> :
                                                        <MenuItem className="flex items-center" onClick={() => setOpenBonusRemove(e?.id)}>
                                                            <TbGiftOff className="mr-[10px]" /> Bonus qo'shish
                                                        </MenuItem>
                                                    }
                                                    <MenuItem className="flex items-center" onClick={() => setOpenPrice({ id: e?.id, price: e?.old_price ? e?.old_price : e?.price, new_price: e?.old_price ? e?.price : 0 })}>
                                                        <FaMoneyBill className="mr-[10px]" /> Yangi narx belgilash
                                                    </MenuItem>
                                                    <MenuItem className="flex items-center" onClick={() => setOpenProductStat(e?.id)}>
                                                        <MdGraphicEq className="mr-[10px]" /> Statistika
                                                    </MenuItem>
                                                    <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, ...e, del: true })}>
                                                        <FaTrash className="mr-[10px]" /> O'chirish
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </div>
                                        {/* OLD PRICE */}
                                        <p className="text-black">{e?.title?.slice(0, 20)}...</p>
                                        <div className="w-full h-[15px]">
                                            {e?.old_price &&
                                                <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(e?.old_price).toLocaleString()} so'm</s> <span className="text-[red]">-{String((e?.old_price - e?.price) / (e?.old_price) * 100).slice(0, 5)}%</span></p>
                                            }
                                        </div>
                                        {/* NEW PRICE || PRICE */}
                                        <p className="w-full p-[0_2%] font-bold text-[16px] text-black">{Number(e.price).toLocaleString()} so'm</p>
                                        {/* VALUE */}
                                        <p className="text-[12px] text-gray-800">Mavjud: {e?.value} ta</p>
                                        {/* SOLDED */}
                                        <p className="text-[12px] text-gray-800">Sotildi: {e?.solded} ta</p>
                                        {/* BONUS */}
                                        {!e?.bonus && <p className="text-[14px] border-t w-full">Bonus mavjud emas!</p>}
                                        {e?.bonus && <p className="text-[14px] border-t w-full">Bonus: {e?.bonus_count} = {e?.bonus_count + e?.bonus_given}</p>}
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[5px] lg:grid-cols-5">
                            {products?.map((e, i) => {
                                return (
                                    e?.title?.toLowerCase()?.includes(search?.toLocaleLowerCase()) &&
                                    <div className="flex items-start justify-start flex-col w-[175px] p-[5px] h-[330px] bg-white rounded shadow-sm hover:shadow-md" key={i}>
                                        {/* IMAGE */}
                                        <div className="flex items-start rounded justify-center w-full overflow-hidden relative h-[200px]">
                                            <img src={e?.image} alt="Rasm" />
                                            <Menu>
                                                <MenuHandler>
                                                    <div className="absolute top-[-5px] right-[-5px]">
                                                        <IconButton color="gray" className=" rounded-full bg-[#0000] shadow-none">
                                                            <BsThreeDotsVertical className="text-black text-[20px]" />
                                                        </IconButton>
                                                    </div>
                                                </MenuHandler>
                                                <MenuList>
                                                    <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, ...e, join_value: true, old: e?.value })}>
                                                        <FaPlus className="mr-[10px]" /> Qo'shish
                                                    </MenuItem>
                                                    <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, ...e, edit: true })}>
                                                        <FaPencilAlt className="mr-[10px]" /> Tahrirlash
                                                    </MenuItem>
                                                    {!e?.bonus ? <MenuItem className="flex items-center" onClick={() => setOpenBonusAdd(e?.id)}>
                                                        <TbGift className="mr-[10px]" /> Bonus qo'shish
                                                    </MenuItem> :
                                                        <MenuItem className="flex items-center" onClick={() => setOpenBonusRemove(e?.id)}>
                                                            <TbGiftOff className="mr-[10px]" /> Bonus qo'shish
                                                        </MenuItem>
                                                    }
                                                    <MenuItem className="flex items-center" onClick={() => setOpenPrice({ id: e?.id, price: e?.old_price ? e?.old_price : e?.price, new_price: e?.old_price ? e?.price : 0 })}>
                                                        <FaMoneyBill className="mr-[10px]" /> Yangi narx belgilash
                                                    </MenuItem>
                                                    <MenuItem className="flex items-center" onClick={() => setOpenProductStat(e?.id)}>
                                                        <MdGraphicEq className="mr-[10px]" /> Statistika
                                                    </MenuItem>
                                                    <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, ...e, del: true })}>
                                                        <FaTrash className="mr-[10px]" /> O'chirish
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </div>
                                        {/* OLD PRICE */}
                                        <p className="text-black">{e?.title?.slice(0, 20)}...</p>
                                        <div className="w-full h-[15px]">
                                            {e?.old_price &&
                                                <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(e?.old_price).toLocaleString()} so'm</s> <span className="text-[red]">-{String((e?.old_price - e?.price) / (e?.old_price) * 100).slice(0, 5)}%</span></p>
                                            }
                                        </div>
                                        {/* NEW PRICE || PRICE */}
                                        <p className="w-full p-[0_2%] font-bold text-[16px] text-black">{Number(e.price).toLocaleString()} so'm</p>
                                        {/* VALUE */}
                                        <p className="text-[12px] text-gray-800">Mavjud: {e?.value} ta</p>
                                        {/* SOLDED */}
                                        <p className="text-[12px] text-gray-800">Sotildi: {e?.solded} ta</p>
                                        {/* BONUS */}
                                        {!e?.bonus && <p className="text-[14px] border-t w-full">Bonus mavjud emas!</p>}
                                        {e?.bonus && <p className="text-[14px] border-t w-full">Bonus: {e?.bonus_count} = {e?.bonus_count + e?.bonus_given}</p>}
                                    </div>
                                )
                            })}
                        </div>
            }
            <DelProduct select={select} setSelect={setSelect} />
            <AddBonus open={openBonusAdd} setOpen={setOpenBonusAdd} />
            <RemoveBonus open={openBonusRemove} setOpen={setOpenBonusRemove} />
            <AddValue select={select} setSelect={setSelect} />
            <StatProduct open={openProductStat} setOpen={setOpenProductStat} />
            <EditProduct select={select} setSelect={setSelect} />
            <SetNewPrices open={openPrice} setOpen={setOpenPrice} />
        </div>
    );
}


export default Products;

