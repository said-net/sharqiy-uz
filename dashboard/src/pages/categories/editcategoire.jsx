import { Avatar, Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import { useState } from "react";

function EditCategory({ select, setSelect }) {
    return (
        <>
            <Dialog open={select.edit} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">

                </div>
            </Dialog>
        </>
    );
}

export default EditCategory;