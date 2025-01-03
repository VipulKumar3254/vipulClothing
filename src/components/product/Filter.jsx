import React, { useState } from 'react';
import "../../css/Filter.css"
const Filter = ({ categories, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onFilterChange(category);
  };

  return (
   <>
   <div className='mainContainer'>


<div>

   <input  type="checkbox" name="500" id="500"  />
   <label htmlFor="500">under 500</label>
</div>

  <div>
   <input  type="checkbox" name="500" id="500"  />
  <label htmlFor="500">under 600</label>
  </div>
  <div>
   <input  type="checkbox" name="500" id="500"  />
  <label htmlFor="500">under 800</label>
  </div>
  
  <hr />
  <input type="checkbox" />
  <label htmlFor="">Price low to high</label>
  <div>
    <input type="checkbox" />
  <label htmlFor="">Price high to low</label>
  </div>

  </div>
   </>
  );
};

export default Filter;
