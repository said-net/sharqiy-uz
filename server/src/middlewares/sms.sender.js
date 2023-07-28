const { default: axios } = require("axios")

module.exports = async (txt,  phone) =>{
    return await axios(`https://api.xssh.uz/smsv1/spes.php/?id=1315&token=RUZHmFtPifGJTpgaroQDqMdjlXuENsKYvhVyOABSIxenLkb&number=${phone}&text=${String(phone)?.startsWith('97') || String(phone).startsWith('99') || String(phone).startsWith('95') || String(phone).startsWith('88')?`Sharqiy ${String(txt).split('').join('<<->>')}`:`Sharqiy-uz Tasdiqlash uchun: ${txt}`}`)

}