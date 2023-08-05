import { Button, IconButton, Input, Spinner, Menu, MenuHandler, MenuList, MenuItem, Chip } from "@material-tailwind/react"; import axios from "axios";
import { FaPlusCircle, FaSearch, FaRegFrown, FaAlignRight, FaPenAlt, FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { API_LINK } from "../../config";
import AddNew from "./addnew";
import { BiRefresh } from "react-icons/bi";
import BanOperator from "./banoperator";

function Operator() {
    const [search, setSearch] = useState('');
    const [isLoad, setIsLoad] = useState(false);
    const [operator, setOperator] = useState([]);
    const [open, setOpen] = useState(false);
    const [select, setSelect] = useState({ banned: false, edit: false, name: '', ban: false })

    console.log(operator);

    const { refresh } = useSelector(e => e.operator)

    useEffect(() => {
        setIsLoad(false)
        axios(API_LINK + '/operator/getall', {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true)
            const { ok, data } = res.data
            console.log(res.data);
            if (ok) {
                setOperator(data)
            }
        }).catch(() => {
            alert("Aloqani tekshirib qayta urinib ko'ring!")
        })
    }, [refresh])

    return (
        <>
            <div className="flex items-center justify-between w-full my-[10px] bg-white rounded-[10px] shadow-md h-[75px] border p-[0_10px]">
                <div className="flex items-center justify-center w-[200px] md:w-[400px] ">
                    <Input label="Qidirish: Nomi" value={search} onChange={e => setSearch(e.target.value)} icon={<FaSearch />} />
                </div>
                <Button onClick={() => setOpen(true)} className="hidden sm:inline-block rounded">Yangi qo'shish</Button>
                <IconButton className="sm:hidden inline-block rounded-full text-[20px]" onClick={() => setOpen(true)}>
                    <FaPlusCircle />
                </IconButton>
                <AddNew open={open} setOpen={setOpen} />
            </div>
            {!isLoad ?
                <div className="flex items-center justify-center w-full h-[400px]">
                    <Spinner />
                </div>
                :
                !search ?
                    operator.map(({ name, phone, _id, banned }, key) => {
                        return (
                            <div key={key} className="flex items-center justify-between w-full h-[70px] p-[0_10px] bg-[#fff] shadow-md border rounded mb-[10px] hover:shadow-lg backdrop-blur-md">
                                <div className="flex items-center justify-center rounded-full " >
                                    {name}
                                </div>
                                <div className="flex items-center justify-center rounded-full " >
                                    {phone}
                                </div>
                                <Menu>
                                    <MenuHandler>
                                        <IconButton className="rounded-full" color="blue-gray">
                                            <FaAlignRight />
                                        </IconButton>
                                    </MenuHandler>
                                    <MenuList>
                                        <MenuItem className="flex items-center justify-start" >
                                            <FaPenAlt />
                                            <h1 className="pl-[10px]">O'zgartirish</h1>
                                        </MenuItem>
                                        {!banned ?
                                            <MenuItem className="flex items-center justify-start" onClick={e => setSelect({
                                                banned: false, edit: false, name, ban: true, _id
                                            })}>
                                                <FaTrash className="text-[red]" />
                                                <h1 className="text-[red] pl-[10px] ">Ban berish</h1>
                                            </MenuItem>
                                            :
                                            <MenuItem className="flex items-center justify-start" >
                                                <FaTrash className="text-[red]" />
                                                <h1 className="text-[green] pl-[10px] ">Bandan chiqarish</h1>
                                            </MenuItem>
                                        }
                                    </MenuList>
                                </Menu>

                            </div>
                        )
                    })
                    : operator.map(({ name, phone, _id, banned }, key) => {
                        return (
                            name?.toLowerCase()?.includes(search?.toLowerCase()) || phone?.includes(search)
                                ? <div key={key} className="flex items-center justify-between w-full h-[70px] p-[0_10px] bg-[#fff] shadow-md border rounded mb-[10px] hover:shadow-lg backdrop-blur-md">
                                    <div className="flex items-center justify-center rounded-full " >
                                        {name}
                                    </div>
                                    <div className="flex items-center justify-center rounded-full " >
                                        {phone}
                                    </div>
                                    <Menu>
                                        <MenuHandler>
                                            <IconButton className="rounded-full" color="blue-gray">
                                                <FaAlignRight />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem className="flex items-center justify-start" >
                                                <FaPenAlt />
                                                <h1 className="pl-[10px]">O'zgartirish</h1>
                                            </MenuItem>
                                            {!banned ?
                                                <MenuItem className="flex items-center justify-start" onClick={e => setSelect({
                                                    banned: false, edit: false, name, ban: true, _id
                                                })}>
                                                    <FaTrash className="text-[red]" />
                                                    <h1 className="text-[red] pl-[10px] ">Ban berish</h1>
                                                </MenuItem>
                                                :
                                                <MenuItem className="flex items-center justify-start" >
                                                    <FaTrash className="text-[red]" />
                                                    <h1 className="text-[green] pl-[10px] ">Bandan chiqarish</h1>
                                                </MenuItem>
                                            }
                                        </MenuList>
                                    </Menu>

                                </div> : null
                        )
                    })

            }
            <BanOperator select={select} setSelect={setSelect} />
        </>
    );
}

export default Operator;