import sale from "../assets/sale.png"
const Sale = ()=>{
    return (
        <>
       <div className="d-flex align-items-center justify-content-evenly ">
        <div className="">
            <h1>Get any product at 200/- only</h1>
        </div>

        <div className="">

        <img src={sale} alt="" />
        </div>
       </div>



        </>
    )
}

export default Sale;