"use client";

export default function CatalogSortControl({ count, sort = "" }) {
  return (
    <form className="store-catalog-controls" action="" method="get">
      <span>{count} {count === 1 ? "piece" : "pieces"}</span>
      <label>
        Sort by{" "}
        <select
          name="sort"
          value={sort}
          onChange={(event) => event.currentTarget.form.requestSubmit()}
        >
          <option value="">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>
    </form>
  );
}
