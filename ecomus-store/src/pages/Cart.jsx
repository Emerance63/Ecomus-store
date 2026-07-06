import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getImageUrl, handleImageError } from "../utils/imageUtils";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, total, clearCart } =
    useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [checkoutState, setCheckoutState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleCheckout = async () => {
    if (!token) {
      setCheckoutState({
        loading: false,
        error: "Please log in before checking out.",
        success: "",
      });
      return;
    }

    navigate("/checkout", {
      state: {
        items: cartItems.map((item) => ({
          id: item.id || item._id,
          name: item.name,
          price: item.selectedVariant?.price || item.price || 0,
          quantity: item.quantity,
          image: item.imageUrl || item.image,
          variant: item.selectedVariant,
          productId: item.id || item._id,
          variantId: item.selectedVariant?.id || item.selectedVariant?._id || null,
        })),
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="rounded-4xl border border-slate-200 bg-white/90 px-8 py-16 text-center shadow-sm dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Your cart is empty
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Add products to your cart first and they will appear here.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-orange-600 px-5 py-3 font-medium text-white transition hover:bg-orange-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Basket
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Shopping Cart
          </h1>
        </div>
        <p className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-900/80 dark:text-slate-300">
          {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
        </p>
      </div>

      {checkoutState.error && (
        <p className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
          {checkoutState.error}
        </p>
      )}

      {checkoutState.success && (
        <p className="mb-4 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
          {checkoutState.success}
        </p>
      )}

      <div className="space-y-4">
        {cartItems.map((item) => {
          const id = item.id || item._id;
          const price = item.selectedVariant?.price || item.price || 0;
          const imageUrl = getImageUrl(item);

          return (
            <div
              key={`${id}-${item.selectedVariant?.id || "default"}`}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center dark:border-[#2f261f]/70 dark:bg-[#111827]/90"
            >
              <img
                src={imageUrl}
                alt={item.name || "Product image"}
                onError={handleImageError}
                className="h-48 w-full rounded-2xl object-cover bg-slate-100 sm:h-24 sm:w-24 dark:bg-slate-800"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {item.name}
                </h3>

                {item.selectedVariant && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.selectedVariant.color} / {item.selectedVariant.size}
                  </p>
                )}

                <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
                  ${Number(price).toFixed(2)}
                </p>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(id, Number(e.target.value))}
                  className="mt-3 w-20 rounded-2xl border border-orange-100 bg-orange-50/70 px-3 py-2 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div className="text-left sm:text-right">
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  ${(Number(price) * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeFromCart(id)}
                  className="mt-3 text-sm font-medium text-rose-600 transition hover:text-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Total: ${total.toFixed(2)}
        </h2>

        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-600"
          >
            Clear Cart
          </button>

          <button
            onClick={handleCheckout}
            disabled={checkoutState.loading}
            className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {checkoutState.loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
