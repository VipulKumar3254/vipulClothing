import React from 'react';
import SportWear from '../../../SportWear';
import NewArrivals from '../../../NewArrivalsBanner';
import Sale from '../../../Sale';
import MensCollectionIndexGrid from "../../../MenCollectionIndexGrid"
import Deals from '../../../Deals';

const Banner = () => {

    return (
        <>
            <div className='d-flex  flex-md-column flex-column-reverse'>

                  <div>

                    <Deals />
                        <MensCollectionIndexGrid title={"Men's Collection"} categoryTag={"mensCollection"} />

                        <MensCollectionIndexGrid title={"Summer Collection"} categoryTag={"summerCollection"} />
                    </div>
                <div>
                  

                    <SportWear />
                        <NewArrivals />   
                </div>

            </div>
                        <Sale />    {/*200 rs products */}
        </>
    )
}
export default Banner;