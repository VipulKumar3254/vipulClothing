"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import TuneIcon from "@mui/icons-material/Tune";
// import 'bootstrap/dist/js/bootstrap.bundle'; // Ensure Bootstrap JS is imported

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [isOpen, setIsOpen] = useState(false);
  const offcanvasRef = useRef();

  const handleFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const applyCustomPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Listen to offcanvas events
  // useEffect(() => {
  //   const offcanvasEl = offcanvasRef.current;

  //   const handleShow = () => setIsOpen(true);
  //   const handleHide = () => setIsOpen(false);

  //   offcanvasEl.addEventListener("show.bs.offcanvas", handleShow);
  //   offcanvasEl.addEventListener("hidden.bs.offcanvas", handleHide);

  //   return () => {
  //     offcanvasEl.removeEventListener("show.bs.offcanvas", handleShow);
  //     offcanvasEl.removeEventListener("hidden.bs.offcanvas", handleHide);
  //   };
  // }, []);
  useEffect(() => {
  const offcanvasEl = offcanvasRef.current;
  if (!offcanvasEl) return;

  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  offcanvasEl.addEventListener("show.bs.offcanvas", handleShow);
  offcanvasEl.addEventListener("hidden.bs.offcanvas", handleHide);

  return () => {
    offcanvasEl.removeEventListener("show.bs.offcanvas", handleShow);
    offcanvasEl.removeEventListener("hidden.bs.offcanvas", handleHide);
  };
}, []);


  return (
    <>
      {/* Floating Filter button */}
      {!isOpen && (
        <div className="position-fixed" style={{ top: "150px", left: "-10px", zIndex: 1050 }}>
          <button
            className="btn btn-secondary d-flex align-items-center gap-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#filterOverlay"
          >
            <TuneIcon fontSize="small" />
            <span>Filters</span>
          </button>
        </div>
      )}

      {/* Offcanvas overlay */}
      <div
        ref={offcanvasRef}
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="filterOverlay"
        style={{ width: "20%" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Filters</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <FilterContent
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            handleFilter={handleFilter}
            applyCustomPrice={applyCustomPrice}
            searchParams={searchParams}
          />
        </div>
      </div>

      {/* Responsive width */}
      <style jsx>{`
        @media (max-width: 767.98px) {
          #filterOverlay {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}

function FilterContent({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  handleFilter,
  applyCustomPrice,
  searchParams,
}) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">Sort:</label>
        <select
          onChange={(e) => handleFilter("sort", e.target.value)}
          defaultValue={searchParams.get("sort") || ""}
          className="form-select"
        >
          <option value="">Select</option>
          <option value="price-asc">💰 Price: Low → High</option>
          <option value="price-desc">💰 Price: High → Low</option>
          <option value="newest">🆕 Newest First</option>
        </select>
      </div>

      <div>
        <label className="form-label fw-semibold text-secondary">Price:</label>
        <div className="d-flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="form-control"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <button onClick={applyCustomPrice} className="btn btn-primary w-100">
          Apply
        </button>
      </div>
    </>
  );
}
