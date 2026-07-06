import API from "../api/axios";

export const getCart = async () => {
  const res = await API.get("/api/auth/cart");
  return res.data;
};

export const addCartItem = async (cartData) => {
  const res = await API.post("/api/auth/cart/items", cartData);
  return res.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await API.patch(`/api/auth/cart/items/${itemId}`, {
    quantity,
  });
  return res.data;
};

export const removeCartItem = async (itemId) => {
  const res = await API.delete(`/api/auth/cart/items/${itemId}`);
  return res.data;
};

export const clearApiCart = async () => {
  const res = await API.delete("/api/auth/cart");
  return res.data;
};