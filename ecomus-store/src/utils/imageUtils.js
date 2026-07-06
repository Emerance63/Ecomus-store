const AI_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
];

function hashString(value) {
  let hash = 0;
  if (!value) return hash;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getAiImageForSeed(seed = "default") {
  const index = hashString(String(seed)) % AI_IMAGE_POOL.length;
  return AI_IMAGE_POOL[index];
}

export function getImageUrl(image, fallback = null, seed = "product") {
  if (!image) {
    return fallback || getAiImageForSeed(seed);
  }

  if (typeof image === "string") {
    const value = image.trim();
    return value || fallback || getAiImageForSeed(seed);
  }

  if (typeof image === "object") {
    const candidate =
      image.url ||
      image.imageUrl ||
      image.src ||
      image.thumbnail ||
      image.secure_url ||
      image.path;

    return candidate ? String(candidate) : fallback || getAiImageForSeed(seed);
  }

  return fallback || getAiImageForSeed(seed);
}

export function getProductImageUrl(product, fallback = null) {
  const seed = [product?.name, product?.category?.name, product?.id]
    .filter(Boolean)
    .join("-");

  return getImageUrl(
    product?.images?.[0] ??
      product?.imageUrl ??
      product?.image ??
      product?.thumbnail,
    fallback,
    seed,
  );
}

export function handleImageError(event) {
  event.currentTarget.src = getAiImageForSeed(
    event.currentTarget.alt || "product",
  );
}

export { AI_IMAGE_POOL };
