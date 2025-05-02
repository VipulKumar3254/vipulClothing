import React, { useState, useContext, useRef } from 'react';
import "../../css/Filter.css"
import { filterContext, userContext } from '../context/context';
import { orderBy } from 'firebase/firestore';
const Filter = () => {
  const formRef= useRef(null);
  const user = useContext(userContext);
  const filter = useContext(filterContext);
  const [lessThanCheckbox,setLessThanCheckbox] = useState(0)
  const [orderByCheckbox,setOrderByCheckobx]  = useState("");
  const handleCheckbox = (e) => {
    console.log(parseInt(e.target.value));
    filter.setLessThan(parseInt(e.target.value))
    console.log(filter);

  }
  const handleOrder = (e) => {
    filter.setOrderBy(e.target.value)
    console.log(filter);
  }

  return (
    <>
      <div className={`mainContainer d-md-block ${filter.filterShow?"d-block":"d-none"} text-md-start text-center `}>
        <form action="#" ref={formRef} className=' position-sticky ' style={{top:"20px"}}>




        <div>

          <input type="radio" name="priceCriteria" value="500" onChange={handleCheckbox}  onClick={() => { filter.setFilterShow(!filter.filterShow); }}/>
          <label htmlFor="500">under 500</label>
        </div>

        <div>
          <input type="radio" name="priceCriteria" value="600" onChange={handleCheckbox}  onClick={() => { filter.setFilterShow(!filter.filterShow); }}/>
          <label htmlFor="500">under 600</label>
        </div>
        <div>
          <input type="radio" name="priceCriteria" value="800" onChange={handleCheckbox}  onClick={() => { filter.setFilterShow(!filter.filterShow); }} />
          <label htmlFor="500">under 800</label>
        </div>

        <hr />
        <input type="radio" onClick={(e)=>{ handleOrder(e); filter.setFilterShow(!filter.filterShow);}} name='itemOrder' value={"asc"}   />
        <label htmlFor="">Price low to high</label>
        <div>
          <input type="radio"onClick={(e)=>{ handleOrder(e); filter.setFilterShow(!filter.filterShow);}} name='itemOrder' value={"desc"}  />
          <label htmlFor="">Price high to low</label>
        </div>
        <div className="btn btn-light mt-3" onClick={() => { filter.setLessThan(0); filter.setOrderBy(""); formRef.current.reset(); filter.setFilterShow(!filter.filterShow); }}>Clear Filters</div>


        </form>
      </div>
      <div>
      </div>
    </>

  );
};

export default Filter;
