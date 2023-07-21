import { Avatar, Button, IconButton, Input, Option, Select, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaComment, FaEye, FaHeart, FaPen, FaRegFrown, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { API_LINK } from "../../config";
import AddPost from "./addnew";

function Posts() {
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [posts, setPosts] = useState([]);
    const { category, post } = useSelector(e => e);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/category/getall`).then(res => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setCategories(data);
            }
        });
    }, [category?.refresh]);
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/post/get-my-posts`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setPosts(data);
            }
        });
    }, [post?.refresh]);
    // 
    return (
        <>
            <div className="flex items-center justify-between w-full my-[10px] bg-white rounded-[10px] shadow-md sm:h-[75px] border p-[10px] flex-col sm:flex-row h-auto">
                <div className="flex items-center mb-[10px] sm:mb-0 justify-center sm:w-[200px] xl:w-[400px]  w-full">
                    <Input label="Search: Title || About" onChange={e => setSearch(e.target.value)} icon={<FaSearch />} />
                </div>
                {categories[0] &&
                    <div className="flex items-center mb-[10px] sm:mb-0 justify-center sm:w-[200px] xl:w-[400px] w-full">
                        <Select label="Select a category" onChange={e => setSearch(e)}>
                            {categories?.map((category, key) => {
                                return (
                                    <Option key={key} value={category?.id}>
                                        <Avatar src={category?.image} alt="Pics" size="sm" className="w-[20px] h-[20px] mr-[10px]" />
                                        {category?.title}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                }
                <Button onClick={() => setSearch('')} className="rounded w-full sm:w-auto" color="red">Clear</Button>
                <Button onClick={() => setOpenAdd(true)} className="rounded w-full sm:w-auto mt-[10px] sm:mt-0">Add new</Button>
                {/* <IconButton onClick={() => setOpenAdd(true)} className="sm:hidden inline-block rounded-full text-[20px]">
                    <FaPlusCircle />
                </IconButton> */}
            </div>
            {!isLoad ?
                <div className="flex items-center justify-center w-full h-[400px]">
                    <Spinner />
                </div> :
                !posts[0] ?
                    <div className="flex items-center justify-center w-full h-[400px] flex-col">
                        <FaRegFrown className="text-[200px] text-blue-gray-200" />
                        <p className="capitalize text-blue-gray-200">There are no posts</p>
                    </div> :
                    <div className="flex items-center justify-start w-full flex-col">
                        {!search ?
                            <div className="grid 2xl:grid-cols-4 gap-[20px] xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                                {posts?.map((post) => {
                                    return (
                                        <div className="w-[300px] p-[10px] h-[450px] bg-white shadow-md border rounded flex items-center justify-start flex-col hover:shadow-xl">
                                            <div className="w-full flex items-center justify-between mb-[10px] border-b p-[10px]">
                                                <div className="flex items-center justify-center">
                                                    <Avatar src={post?.from?.image} withBorder color="blue-gray" className="mr-[10px]" />
                                                    <div className="flex items-start justify-start flex-col">
                                                        <h1 className="text-blue-gray-800 text-[20px]">{post?.from?.name}</h1>
                                                        <h1 className="text-blue-gray-300 mt-[-10px]">@{post?.from?.login}</h1>
                                                    </div>
                                                </div>
                                                <div onClick={() => setSearch(post?.category?._id)} className="flex items-center justify-center border-l px-[10px] cursor-pointer">
                                                    <Avatar src={post?.category?.image} withBorder color="blue-gray" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center w-full h-[150px] mb-[10px] overflow-hidden rounded pb-[10px] border-b">
                                                <img src={post?.image} alt="Image" />
                                            </div>
                                            <h1 className="text-[20px]">{post?.title?.slice(0, 20)}...</h1>
                                            <p className="text-blue-gray-500 p-[10px_0] text-center border-y">{post?.about?.slice(0, 60)}...</p>
                                            <div className="flex items-center justify-between w-full mt-[10px] border-b pb-[10px]">
                                                <p className="text-[14px] text-blue-gray-300">{post?.created}</p>
                                                <IconButton className="rounded-full" color="blue-gray">
                                                    <FaPen />
                                                </IconButton>
                                            </div>
                                            <div className="flex items-center justify-between w-full pt-[10px]">
                                                <div className="flex items-center justify-center flex-col">
                                                    <FaHeart className="text-[20px] text-red-500" />
                                                    <p>{post?.likes}</p>
                                                </div>
                                                {/*  */}
                                                <div className="flex items-center justify-center flex-col">
                                                    <FaComment className="text-[20px] text-green-500" />
                                                    <p>{post?.comments}</p>
                                                </div>
                                                {/*  */}
                                                <div className="flex items-center justify-center flex-col">
                                                    <FaEye className="text-[20px] text-blue-500" />
                                                    <p>{post?.views}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <div className="grid 2xl:grid-cols-4 gap-[20px] xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                                {posts?.map((post) => {
                                    return (
                                        post?.title?.toLowerCase()?.includes(search.toLowerCase()) || post?.category?._id?.includes(search) &&
                                        <div className="w-[300px] p-[10px] h-[450px] bg-white shadow-md border rounded flex items-center justify-start flex-col hover:shadow-xl">
                                            <div className="w-full flex items-center justify-between mb-[10px] border-b p-[10px]">
                                                <div className="flex items-center justify-center">
                                                    <Avatar src={post?.from?.image} withBorder color="blue-gray" className="mr-[10px]" />
                                                    <div className="flex items-start justify-start flex-col">
                                                        <h1 className="text-blue-gray-800 text-[20px]">{post?.from?.name}</h1>
                                                        <h1 className="text-blue-gray-300 mt-[-10px]">@{post?.from?.login}</h1>
                                                    </div>
                                                </div>
                                                <div onClick={() => setSearch(post?.category?._id)} className="flex items-center justify-center border-l px-[10px] cursor-pointer">
                                                    <Avatar src={post?.category?.image} withBorder color="blue-gray" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center w-full h-[150px] mb-[10px] overflow-hidden rounded pb-[10px] border-b">
                                                <img src={post?.image} alt="Image" />
                                            </div>
                                            <h1 className="text-[20px]">{post?.title?.slice(0, 20)}...</h1>
                                            <p className="text-blue-gray-500 p-[10px_0] text-center border-y">{post?.about?.slice(0, 60)}...</p>
                                            <div className="flex items-center justify-between w-full mt-[10px] border-b pb-[10px]">
                                                <p className="text-[14px] text-blue-gray-300">{post?.created}</p>
                                                <IconButton className="rounded-full" color="blue-gray">
                                                    <FaPen />
                                                </IconButton>
                                            </div>
                                            <div className="flex items-center justify-between w-full pt-[10px]">
                                                <div className="flex items-center justify-center flex-col">
                                                    <FaHeart className="text-[20px] text-red-500" />
                                                    <p>{post?.likes}</p>
                                                </div>
                                                {/*  */}
                                                <div className="flex items-center justify-center flex-col">
                                                    <FaComment className="text-[20px] text-green-500" />
                                                    <p>{post?.comments}</p>
                                                </div>
                                                {/*  */}
                                                <div className="flex items-center justify-center flex-col">
                                                    <FaEye className="text-[20px] text-blue-500" />
                                                    <p>{post?.views}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>}
                    </div>

            }
            <AddPost open={openAdd} setOpen={setOpenAdd} categories={categories} />
        </>
    );
}

export default Posts;