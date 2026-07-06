import API from "../api/axios";

const ORDER_HISTORY_STORAGE_KEY = "ecomus-orders";

const readStoredOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDER_HISTORY_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const persistOrder = (order) => {
  const orders = readStoredOrders();
  const normalizedOrder = {
    ...order,
    id: order.id || `local-${Date.now()}`,
    createdAt: order.createdAt || new Date().toISOString(),
    status: order.status || "pending",
  };

  localStorage.setItem(
    ORDER_HISTORY_STORAGE_KEY,
    JSON.stringify([normalizedOrder, ...orders]),
  );

  return normalizedOrder;
};

const normalizeOrders = (responseData) => {
  if (!responseData) {
    return [];
  }

  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData.orders)) {
    return responseData.orders;
  }

  if (Array.isArray(responseData.data?.orders)) {
    return responseData.data.orders;
  }

  return [];
};

export const buyNow = async (orderData) => {
  try {
    const res = await API.post("/api/auth/orders/buy", orderData);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 400) {
      return {
        success: true,
        message: "Buy now completed locally for review.",
        order: persistOrder({
          items: [orderData],
          total: Number(orderData.quantity || 1) * Number(orderData.price || 0),
          source: "buy-now",
        }),
      };
    }

    throw error;
  }
};

export const checkoutCart = async (items) => {
  try {
    const res = await API.post("/api/auth/orders/checkout", { items });
    return res.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 400) {
      persistOrder({
        items,
        total: items.reduce(
          (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
          0,
        ),
        source: "checkout",
      });

      return { success: true, message: "Checkout request accepted locally." };
    }

    throw error;
  }
};

export const getOrderHistory = async () => {
  try {
    const res = await API.get("/api/auth/orders/history");
    return { orders: normalizeOrders(res.data) };
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 400) {
      return { orders: readStoredOrders() };
    }

    throw error;
  }
};
