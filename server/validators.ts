import { ObjectId } from "mongodb";

// ── 1. Email & Password Validators ──────────────────────────────────────────

export function validateEmail(input: unknown): { valid: boolean; email?: string; error?: string } {
  if (typeof input !== "string") {
    return { valid: false, error: "Email must be a string" };
  }
  const email = input.trim().toLowerCase();
  if (!email) {
    return { valid: false, error: "Email is required" };
  }
  if (email.length > 254) {
    return { valid: false, error: "Email is too long" };
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true, email };
}

export function validatePassword(input: unknown): { valid: boolean; password?: string; error?: string } {
  if (typeof input !== "string") {
    return { valid: false, error: "Password must be a string" };
  }
  if (!input) {
    return { valid: false, error: "Password is required" };
  }
  if (input.length > 256) {
    return { valid: false, error: "Password exceeds maximum length" };
  }
  return { valid: true, password: input };
}

// ── 2. MongoDB Injection Prevention ─────────────────────────────────────────

export function isValidObjectId(id: unknown): boolean {
  if (typeof id !== "string") return false;
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

/**
 * Recursively strips keys that start with '$' or contain '.' to prevent
 * MongoDB operator injection or path traversal in untrusted JSON inputs.
 */
export function sanitizeMongoInput<T>(val: T): T {
  if (val === null || typeof val !== "object") {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeMongoInput(item)) as unknown as T;
  }
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(val as Record<string, unknown>)) {
    if (key.startsWith("$") || key.includes(".")) {
      continue; // Drop dangerous operators
    }
    clean[key] = sanitizeMongoInput(value);
  }
  return clean as T;
}

// ── 3. Product Validation ────────────────────────────────────────────────────

export interface SanitizedVariant {
  sku: string;
  size: string;
  color: string;
  stock: number;
  price?: number;
}

export interface SanitizedProduct {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  imageUrl: string;
  images?: string[];
  isNew: boolean;
  isFeatured: boolean;
  variants: SanitizedVariant[];
  archived?: boolean;
}

export function validateProductInput(body: unknown): { valid: boolean; data?: SanitizedProduct; error?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const raw = body as Record<string, unknown>;

  // Name
  if (typeof raw.name !== "string" || !raw.name.trim()) {
    return { valid: false, error: "Product name is required" };
  }
  const name = raw.name.trim().slice(0, 200);

  // Slug
  const slug = (typeof raw.slug === "string" && raw.slug.trim()
    ? raw.slug.trim()
    : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  ).slice(0, 200);

  // Category
  if (typeof raw.category !== "string" || !raw.category.trim()) {
    return { valid: false, error: "Product category is required" };
  }
  const category = raw.category.trim().slice(0, 100);
  const categorySlug = (typeof raw.categorySlug === "string" && raw.categorySlug.trim()
    ? raw.categorySlug.trim()
    : category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  ).slice(0, 100);

  // Price
  const price = Number(raw.price);
  if (isNaN(price) || price < 0 || price > 10000000) {
    return { valid: false, error: "Valid non-negative price is required" };
  }

  // Original Price (optional)
  let originalPrice: number | undefined;
  if (raw.originalPrice !== undefined && raw.originalPrice !== null && raw.originalPrice !== "") {
    const op = Number(raw.originalPrice);
    if (!isNaN(op) && op >= 0 && op <= 10000000) {
      originalPrice = op;
    }
  }

  // Descriptions
  const description = typeof raw.description === "string" ? raw.description.trim().slice(0, 10000) : "";
  const shortDescription = typeof raw.shortDescription === "string" ? raw.shortDescription.trim().slice(0, 500) : "";

  // Image URL
  const imageUrl = typeof raw.imageUrl === "string" ? raw.imageUrl.trim().slice(0, 1000) : "";

  // Additional images
  const images: string[] = [];
  if (Array.isArray(raw.images)) {
    for (const img of raw.images) {
      if (typeof img === "string" && img.trim()) {
        images.push(img.trim().slice(0, 1000));
      }
    }
  }

  // Variants
  const variants: SanitizedVariant[] = [];
  if (Array.isArray(raw.variants)) {
    for (const v of raw.variants) {
      if (v && typeof v === "object") {
        const vr = v as Record<string, unknown>;
        const sku = typeof vr.sku === "string" ? vr.sku.trim().slice(0, 50) : "";
        const size = typeof vr.size === "string" ? vr.size.trim().slice(0, 20) : "Free Size";
        const color = typeof vr.color === "string" ? vr.color.trim().slice(0, 50) : "Default";
        const stock = Math.max(0, parseInt(String(vr.stock || 0), 10) || 0);
        variants.push({
          sku: sku || `${slug}-${size}-${color}`.toLowerCase().replace(/[^a-z0-9-]/g, ""),
          size,
          color,
          stock,
        });
      }
    }
  }

  const sanitized: SanitizedProduct = {
    name,
    slug,
    category,
    categorySlug,
    price,
    ...(originalPrice !== undefined ? { originalPrice } : {}),
    description,
    shortDescription,
    imageUrl,
    ...(images.length > 0 ? { images } : {}),
    isNew: Boolean(raw.isNew),
    isFeatured: Boolean(raw.isFeatured),
    variants,
    archived: Boolean(raw.archived),
  };

  return { valid: true, data: sanitized };
}

// ── 4. Category Validation ──────────────────────────────────────────────────

export interface SanitizedCategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount?: number;
}

export function validateCategoryInput(body: unknown): { valid: boolean; data?: SanitizedCategory; error?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const raw = body as Record<string, unknown>;
  if (typeof raw.name !== "string" || !raw.name.trim()) {
    return { valid: false, error: "Category name is required" };
  }
  const name = raw.name.trim().slice(0, 100);
  const slug = (typeof raw.slug === "string" && raw.slug.trim()
    ? raw.slug.trim()
    : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  ).slice(0, 100);

  const description = typeof raw.description === "string" ? raw.description.trim().slice(0, 1000) : undefined;
  const image = typeof raw.image === "string" ? raw.image.trim().slice(0, 1000) : undefined;
  const itemCount = typeof raw.itemCount === "number" && raw.itemCount >= 0 ? raw.itemCount : 0;

  return {
    valid: true,
    data: {
      name,
      slug,
      ...(description ? { description } : {}),
      ...(image ? { image } : {}),
      itemCount,
    },
  };
}

// ── 5. Order Status Validation ──────────────────────────────────────────────

export const VALID_ORDER_STATUSES = ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const;
export type ValidOrderStatus = typeof VALID_ORDER_STATUSES[number];

export function validateOrderStatus(status: unknown): { valid: boolean; status?: ValidOrderStatus; error?: string } {
  if (typeof status !== "string" || !VALID_ORDER_STATUSES.includes(status as ValidOrderStatus)) {
    return {
      valid: false,
      error: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(", ")}`,
    };
  }
  return { valid: true, status: status as ValidOrderStatus };
}
