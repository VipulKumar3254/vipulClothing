import sportwear from "../assets/sportWear.png"
const SportWear = ()=>{
    return (
        <>
       <div className="d-flex align-items-center justify-content-evenly  flex-row-reverse ">
        <div className="">
            <h1>flat 10% of on sport wears</h1>
        </div>

        <div className="">

        <img src={sportwear} alt="" />
        </div>
       </div>



        </>
    )
}

export default SportWear;