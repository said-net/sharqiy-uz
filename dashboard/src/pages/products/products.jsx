import { Button, Card, CardBody, CardHeader, Chip, IconButton, Input, Spinner, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaBox, FaPlusCircle, FaRegFrown, FaSearch, FaShoppingCart, FaTrash } from 'react-icons/fa'
import AddProduct from "./addnew";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_LINK } from "../../config";
import { toast } from "react-toastify";
import { TbGift, TbGiftOff } from 'react-icons/tb';
import { ImStatsDots } from 'react-icons/im';
import { BiEdit, BiPlus, BiRefresh } from "react-icons/bi";
import DelProduct from "./delproduct";
import AddBonus from "./addbonus";
import RemoveBonus from "./removebonus";
import StatProduct from "./statproduct";
function Products() {
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [openBonusAdd, setOpenBonusAdd] = useState('');
    const [openBonusRemove, setOpenBonusRemove] = useState('');
    const [products, setProducts] = useState([]);
    const [select, setSelect] = useState({ del: false, edit: false, id: '', title: '', about: '', image: '', recovery: false, });
    const [openStat, setOpenStat] = useState('');
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
                        <div className="flex items-center justify-start flex-col w-full">
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[20px]">
                                {products.map((p, i) => {
                                    return (
                                        <div className="flex" key={i}>
                                            < Card className="w-full max-w-[26rem] shadow-lg">
                                                <CardHeader floated={false} color="blue-gray">
                                                    <img
                                                        src={p.images[0]}
                                                    />
                                                    <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
                                                </CardHeader>

                                                <CardBody>
                                                    {p?.bonus && <Chip value={`Bonus: ${p?.bonus_count} = ${p?.bonus_given + p?.bonus_count} | ${p?.bonus_duration}`} color="green" className="rounded" />}
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <Typography variant="h5" color="blue-gray" className="font-medium">
                                                            {p.title}
                                                        </Typography>
                                                    </div>
                                                    <div className="flex items-start justify-start flex-col w-full">
                                                        <p className="flex items-center"><FaBox />Mavjud: {p.value} ta</p>
                                                        <p className="flex items-center"><FaShoppingCart />Sotildi: {p.solded} ta</p>
                                                    </div>
                                                    <div className="group mt-8 inline-flex flex-wrap items-center gap-3">
                                                        <IconButton color="cyan" className="rounded text-[20px]">
                                                            <BiPlus />
                                                        </IconButton>
                                                        <IconButton className="rounded text-[20px]">
                                                            <BiEdit />
                                                        </IconButton>
                                                        {!p.bonus && <IconButton color="green" className="rounded text-[20px]" onClick={() => setOpenBonusAdd(p.id)}>
                                                            <TbGift />
                                                        </IconButton>}
                                                        {p.bonus && <IconButton color="red" className="rounded text-[20px]">
                                                            <TbGiftOff />
                                                        </IconButton>}
                                                        {!p.hidden && <IconButton color="red" className="rounded text-[20px]" onClick={() => setSelect({ del: true, edit: false, recovery: false, id: p.id, title: p.title })}>
                                                            <FaTrash />
                                                        </IconButton>}
                                                        {p.hidden && <IconButton color="orange" className="rounded text-[20px]" onClick={() => setSelect({ del: false, edit: false, recovery: true, id: p.id, title: p.title })}>
                                                            <BiRefresh />
                                                        </IconButton>}
                                                        <IconButton className="rounded" color="blue-gray" onClick={() => { setOpenStat(p.id) }}>
                                                            <ImStatsDots />
                                                        </IconButton>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        : null
            }
            <DelProduct select={select} setSelect={setSelect} />
            <DelProduct select={select} setSelect={setSelect} />
            <AddBonus open={openBonusAdd} setOpen={setOpenBonusAdd} />
            <RemoveBonus open={openBonusRemove} setOpen={setOpenBonusRemove} />
            <StatProduct open={openStat} setOpen={setOpenStat} />
        </div>
    );
}


export default Products;

