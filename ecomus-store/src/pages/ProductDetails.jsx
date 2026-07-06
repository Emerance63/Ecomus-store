import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { buyNow } from "../services/orderService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { getImageUrl, handleImageError } from "../utils/imageUtils";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProductById(id);
      const productData = response.data?.product;

      if (!productData) {
        setError("Product not found.");
        return;
      }

      setProduct(productData);
      setSelectedVariant(productData.variants?.[0] || null);
      setMainImage(getImageUrl(productData.images?.[0]));
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      imageUrl: getImageUrl(product.images?.[0]),
      selectedVariant,
      quantity: Number(quantity),
      cartId: `${product.id}-${selectedVariant?.id || "no-variant"}`,
    });

    setSuccess("Product added to cart.");
  };

  const handleBuyNow = async () => {
    if (!token) {
      setError("Please login before buying.");
      return;
    }

    if (product.variants?.length && !selectedVariant) {
      setError("Please select a product variant.");
      return;
    }

    try {
      setBuying(true);
      setError("");
      setSuccess("");

      await buyNow({
        productId: product.id,
        variantId: selectedVariant?.id || null,
        quantity: Number(quantity),
        price: selectedVariant?.price || product.price,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setBuying(false);
    }

    navigate("/checkout", {
      state: {
        items: [
          {
            id: product.id,
            name: product.name,
            price: selectedVariant?.price || product.price,
            quantity: Number(quantity),
            image: getImageUrl(product.images?.[0]),
            variant: selectedVariant,
            productId: product.id,
            variantId: selectedVariant?.id || null,
          },
        ],
      },
    });
  };

  if (loading) return <Loader />;
  if (error && !product) return <ErrorMessage message={error} />;

  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:text-orange-600"
      >
        ← Back to products
      </Link>

      {error && (
        <p className="mb-4 rounded-2xl bg-rose-50 p-3 text-rose-700">{error}</p>
      )}

      {success && (
        <p className="mb-4 rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          {success}
        </p>
      )}

      <div className="rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8 lg:p-10 dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
              <img
                src={mainImage}
                alt={product.name}
                onError={handleImageError}
                className="h-[26.25rem] w-full object-cover"
              />
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {product.images?.map((image, index) => {
                const imageUrl = getImageUrl(image);

                return (
                  <button
                    key={index}
                    onClick={() => setMainImage(imageUrl)}
                    className="rounded-2xl border border-orange-100 p-1.5 transition hover:border-orange-400"
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      onError={handleImageError}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              {product.category?.name} • {product.brand}
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {product.name}
            </h1>

            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              ${selectedVariant?.price || product.price}
            </p>

            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
              {product.description || "No description available."}
            </p>

            <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Stock:{" "}
              <span className="font-semibold text-slate-900">
                {selectedVariant?.stock ?? product.stock}
              </span>
            </p>

            {product.variants?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Choose Variant
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedVariant?.id === variant.id
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-orange-100 bg-white text-slate-700 hover:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-orange-500"
                      }`}
                    >
                      {variant.color} / {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="mb-2 block font-semibold text-slate-900 dark:text-slate-100">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={selectedVariant?.stock || product.stock || 99}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-24 rounded-2xl border border-orange-100 bg-orange-50/70 px-3 py-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-2xl border border-orange-200 bg-white px-4 py-3 font-medium text-slate-900 transition hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-orange-500 dark:hover:text-orange-400"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 rounded-2xl bg-orange-600 px-4 py-3 font-medium text-white transition hover:bg-orange-700"
              >
                {buying ? "Buying..." : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
