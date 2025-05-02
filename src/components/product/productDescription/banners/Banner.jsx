import React from 'react';
import SportWear from '../../../SportWear';
import NewArrivals from '../../../NewArrivalsBanner';
import Sale from '../../../Sale';
const Banner = ()=>{

    return (
        <>
        <div>
        <SportWear /> 
           {/* sport wear section */}
        <NewArrivals/>   {/* discover new arrivals */}
        <Sale/>    {/*200 rs products */}
        </div>

        </>
    )
}
export default Banner;