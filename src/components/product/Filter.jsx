import "@fontsource/roboto";
import React, { useState, useContext, useRef } from "react";
import "../../css/Filter.css";
import { filterContext, userContext } from "../context/context";

const Filter = () => {
  const formRef = useRef(null);
  const user = useContext(userContext);
  const filter = useContext(filterContext);

  const handleCheckbox = (e) => {
    filter.setLessThan(parseInt(e.target.value));
    filter.setFilterShow(false);
  };

  const handleOrder = (e) => {
    filter.setOrderBy(e.target.value);
    filter.setFilterShow(false);
  };

  return (
    <>
      <div
        className={`mainContainer d-md-block ${filter.filterShow ? "d-block" : "d-none"} text-md-start text-center px-3 py-3 bg-light rounded shadow-sm`}
        style={{ fontFamily: "Roboto", fontSize: "15px", maxWidth: "300px" }}
      >
        <form action="#" ref={formRef} className="position-sticky" style={{ top: "20px" }}>
          <h5 className="mb-3 text-dark">Filter by Price</h5>

          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="priceCriteria"
              id="under500"
              value="500"
              onChange={handleCheckbox}
            />
            <label className="form-check-label" htmlFor="under500">
              Under ₹500
            </label>
          </div>

          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="priceCriteria"
              id="under600"
              value="600"
              onChange={handleCheckbox}
            />
            <label className="form-check-label" htmlFor="under600">
              Under ₹600
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="priceCriteria"
              id="under800"
              value="800"
              onChange={handleCheckbox}
            />
            <label className="form-check-label" htmlFor="under800">
              Under ₹800
            </label>
          </div>

          <hr className="my-3" />
          <h5 className="mb-3 text-dark">Sort by</h5>

          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="itemOrder"
              id="lowToHigh"
              value="asc"
              onClick={handleOrder}
            />
            <label className="form-check-label" htmlFor="lowToHigh">
              Price: Low to High
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="itemOrder"
              id="highToLow"
              value="desc"
              onClick={handleOrder}
            />
            <label className="form-check-label" htmlFor="highToLow">
              Price: High to Low
            </label>
          </div>

          <div className="d-grid">
            <button
              type="button"
              className="btn btn-outline-dark mt-2"
              onClick={() => {
                filter.setLessThan(0);
                filter.setOrderBy("");
                formRef.current.reset();
                filter.setFilterShow(false);
              }}
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Filter;
