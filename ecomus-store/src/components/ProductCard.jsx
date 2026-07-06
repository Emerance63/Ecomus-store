import { Link } from "react-router-dom";
import { getProductImageUrl, handleImageError } from "../utils/imageUtils";

function ProductCard({ product }) {
  const imageUrl = getProductImageUrl(product);

  return (
    <article className="group overflow-hidden rounded-[24px] border border-orange-100 bg-white/90 p-4 shadow-[0_20px_60px_-20px_rgba(249,115,22,0.2)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-24px_rgba(249,115,22,0.3)] dark:border-[#2f261f]/70 dark:bg-[#111827]/90 dark:shadow-[0_20px_60px_-20px_rgba(2,6,23,0.55)]">
      <div className="overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#1f2937]/80">
        <img
          src={imageUrl}
          alt={product.name}
          onError={handleImageError}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        <span>{product.category?.name || "Featured"}</span>
        <span className="rounded-full bg-orange-100 px-2.5 py-1 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
          New pick
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {product.name}
      </h3>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {product.description ||
          "A thoughtfully curated product for everyday use."}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          ${product.price}
        </p>
        <Link
          to={`/products/${product.id}`}
          className="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
