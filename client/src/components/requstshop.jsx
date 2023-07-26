import { Dialog } from "@material-tailwind/react";

function RequestShop({openShop, setOpenShop}) {
    return (
        <Dialog open={openShop?.id !== ''} size="xxl">

        </Dialog>
    );
}

export default RequestShop;