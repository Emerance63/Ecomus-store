import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrderHistory } from "../services/orderService";

function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrderHistory();
        setOrders(response.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-600">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Your profile
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Manage your account details and continue shopping securely.
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Signed in as
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {user?.email || user?.name || "Authenticated user"}
          </p>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Order history
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Your recent purchases and checkout attempts.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            No past orders yet.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((order, index) => (
              <div
                key={order.id || `${order.createdAt || "order"}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {order.source === "buy-now" ? "Buy now" : "Checkout"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "Recent order"}
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                    {order.status || "Pending"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  {Array.isArray(order.items)
                    ? order.items
                        .map((item) => item.name || item.productId || "Item")
                        .join(", ")
                    : "Order details available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
