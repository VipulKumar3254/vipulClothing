import ProductCardClient from "./ProductCardClient";

export default function ProductCard({ product }) {
  return (
    <div className="p-4 border rounded shadow">
      <img src={product.image} alt={product.title} className="h-40 mx-auto" />
      <h2 className="text-sm font-semibold mt-2">{product.title}</h2>
      <p className="text-gray-600">${product.price}</p>
      <ProductCardClient id={product.id} />
    </div>
  );
}
