import { Button, ButtonGroup, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { useState } from "react";

function Auth({ open, setOpen }) {
    const [state, setState] = useState({ phone: '+998', code: '', role: 'buyer' })
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center w-full h-[100vh] bg-[#000000ab] backdrop-blur-sm">
            <div className="flex items-center justify-start flex-col w-[90%] rounded bg-white p-[5px]">
                <DialogHeader className="text-[15px] w-full relative">
                    <h1>Ro'yhatdan o'tish / Kirish </h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <p className="text-center text-[20px]">{state?.role === 'buyer' && 'Haridor sifatida kirish'}</p>
                    <p className="text-center text-[20px]">{state?.role === 'seller' && 'Reklamachi sifatida kirish'}</p>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Button className="w-[40%] rounded mx-[10px]" variant="outlined" onClick={() => setState({ ...state, role: 'buyer' })} color={state?.role === 'buyer' ? 'red' : 'gray'}>HARIDOR</Button>
                        <Button className="w-[40%] rounded mx-[10px]" variant="outlined" onClick={() => setState({ ...state, role: 'seller' })} color={state?.role === 'seller' ? 'red' : 'gray'}>ADMIN</Button>
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px] relative">
                        <Input type="tel" label="Raqamingiz" required onChange={e => setState({ ...state, phone: e.target.value })} value={state.phone} />
                        {/* <div className="absolute right-[0px]"> */}
                        {/* <Button disabled={state?.phone?.length < 13} className="rounded">
                                kodni olish
                            </Button> */}
                        <button disabled={state?.phone?.length < 13} className={`absolute right-[5px] w-[100px] h-[30px] ${state?.phone?.length < 13 ? 'bg-light-blue-200' : 'bg-light-blue-500'} text-white rounded `}>Kodni olish</button>
                        {/* </div> */}
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px] relative">
                        <Input disabled={state?.phone?.length < 13} type="tel" label="SMS kod" required onChange={e => setState({ ...state, code: e.target.value })} value={state.code} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button onClick={() => setOpen(false)} color="orange" className="rounded mr-[10px]">Yopish</Button>
                    <Button color="green" className="rounded w-[170px]" disabled={state?.phone?.length < 13 || state?.code?.length < 4}>Kirish</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default Auth;