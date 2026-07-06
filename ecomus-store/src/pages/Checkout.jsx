import { useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { checkoutCart } from "../services/orderService";
import { getImageUrl, handleImageError } from "../utils/imageUtils";

function Checkout() {
  const location = useLocation();
  const { token } = useAuth();
  const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const checkoutItems = useMemo(() => {
    if (location.state?.items?.length) {
      return location.state.items;
    }

    return cartItems.map((item) => ({
      id: item.id || item._id,
      name: item.name,
      price: item.selectedVariant?.price || item.price || 0,
      quantity: item.quantity,
      image: getImageUrl(item),
      variant: item.selectedVariant,
      productId: item.id || item._id,
      variantId: item.selectedVariant?.id || item.selectedVariant?._id || null,
    }));
  }, [cartItems, location.state]);

  const total = checkoutItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.address) {
      setError("Please fill in your name, email, and address.");
      return;
    }

    try {
      setLoading(true);
      await checkoutCart(
        checkoutItems.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          variantId: item.variantId || null,
          price: Number(item.price || 0),
        })),
      );
      clearCart();
      setSuccess("Order placed successfully. Thank you for shopping with us.");
      setFormData({ name: "", email: "", address: "", note: "" });
    } catch (checkoutError) {
      setError(
        checkoutError.response?.data?.message ||
          "Checkout could not be completed right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!checkoutItems.length) {
    return (
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 text-center shadow-sm dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Nothing to checkout
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Add items to the cart or use Buy Now from a product page first.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-orange-600 px-5 py-3 font-medium text-white transition hover:bg-orange-700"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-600">
          Secure checkout
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Review your order
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Complete your purchase and we will prepare everything for delivery.
        </p>

        <div className="mt-6 space-y-4">
          {checkoutItems.map((item) => (
            <div
              key={`${item.productId || item.id}-${item.variantId || "default"}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60"
            >
              <img
                src={item.image || getImageUrl(item)}
                alt={item.name}
                onError={handleImageError}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {item.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.variant ? `${item.variant.color} / ${item.variant.size}` : "Standard option"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  x{item.quantity}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Delivery address
            </label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
              placeholder="Street, city, country"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Notes (optional)
            </label>
            <textarea
              name="note"
              rows="2"
              value={formData.note}
              onChange={handleChange}
              className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
              placeholder="Leave at the front desk"
            />
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
              {success}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/cart"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:text-slate-300"
            >
              Back to cart
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Processing..." : "Place order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
