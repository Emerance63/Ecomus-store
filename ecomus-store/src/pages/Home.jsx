import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  getProductsByCategory,
} from "../services/productService";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError("");

      const productResponse = await getProducts();
      const categoryResponse = await getCategories();

      setProducts(productResponse.data?.all || []);
      setCategories(categoryResponse.data || []);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setCurrentPage(1);

    try {
      setLoading(true);
      setError("");

      if (!categoryId) {
        const response = await getProducts();
        setProducts(response.data?.all || []);
      } else {
        const response = await getProductsByCategory(categoryId);
        setProducts(response.data || []);
      }
    } catch (err) {
      setError("Failed to load category products.");
    } finally {
      setLoading(false);
    }
  };

  const displayedProducts = products
    .filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "low-high") return Number(a.price) - Number(b.price);
      if (sort === "high-low") return Number(b.price) - Number(a.price);
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const pageSize = 8;
  const totalPages = Math.max(
    1,
    Math.ceil(displayedProducts.length / pageSize),
  );
  const visibleProducts = displayedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort, selectedCategory]);

  if (loading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white/80 px-6 py-16 text-center text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden rounded-4xl border border-orange-200/60 bg-linear-to-br from-orange-700 via-orange-600 to-amber-500 p-8 text-white shadow-2xl sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
        <div className="relative max-w-2xl">
          <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
            Curated essentials for everyday living
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Discover a polished online store with the same reliable features.
          </h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            Browse, search, sort, and shop with a refined experience that keeps
            all the original functionality intact.
          </p>
        </div>
      </section>

      <div className="mt-8 rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5 dark:border-[#2f261f]/70 dark:bg-[#111827]/80">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none ring-0 transition focus:border-orange-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:bg-slate-800"
          />

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
          >
            <option value="">Sort Products</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center text-slate-600 dark:border-[#3a3126]/70 dark:bg-[#111827]/70 dark:text-slate-300">
          No products found.
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-[#2f261f]/70 dark:bg-[#111827]/80 dark:text-slate-300">
            <p>
              Showing {visibleProducts.length} of {displayedProducts.length}{" "}
              products
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-200 px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-200 px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
