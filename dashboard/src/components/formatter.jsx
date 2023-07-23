function Formatter({ value }) {
    function f() {
        let val = String(value).split('');
        val = val.reverse()
        for (var i = 0; i < val.length; i++) {
            if (i % 3 === 0) {
                val[i] = `${val[i]} `
            }
        }
        return val.reverse().join('').trim();
    }
    return (
        <>{
            <b className="mx-[10px]">{f()}</b>
        }</>
    );
}

export default Formatter;