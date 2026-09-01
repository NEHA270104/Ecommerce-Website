export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  stock: number;
  priceOverride?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  variants: ProductVariant[];
  isNew?: boolean;
  isFeatured?: boolean;
  isNonReturnable?: boolean;
  isArchived?: boolean;
}

const unsplash = (id: string, w = 600, h = 750) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=85`;

export const products: Product[] = [
  {
    id: "p1",
    slug: "elegant-floral-kurti",
    name: "Elegant Floral Kurti",
    category: "Tops & Kurtis",
    categorySlug: "tops-kurtis",
    price: 899,
    originalPrice: 1199,
    shortDescription: "Lightweight floral print kurti in breathable cotton fabric.",
    description: "A beautifully crafted floral kurti made from soft, breathable cotton. Perfect for everyday wear, this piece combines comfort with style. The vibrant floral print adds a touch of elegance while keeping the look fresh and modern.",
    colors: [
      { name: "Peach", hex: "#FFCBA4" },
      { name: "Blue", hex: "#6B9ECC" },
      { name: "Green", hex: "#7DB87D" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      unsplash("1759840278381-bf7d5e332050"),
      unsplash("1760287364219-160c234ded00"),
    ],
    variants: [
      { sku: "EFK-XS-PCH", size: "XS", color: "Peach", stock: 3 },
      { sku: "EFK-S-PCH", size: "S", color: "Peach", stock: 8 },
      { sku: "EFK-M-PCH", size: "M", color: "Peach", stock: 5 },
      { sku: "EFK-L-PCH", size: "L", color: "Peach", stock: 2 },
      { sku: "EFK-XL-PCH", size: "XL", color: "Peach", stock: 0 },
      { sku: "EFK-S-BLU", size: "S", color: "Blue", stock: 6 },
      { sku: "EFK-M-BLU", size: "M", color: "Blue", stock: 4 },
      { sku: "EFK-L-BLU", size: "L", color: "Blue", stock: 3 },
    ],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "p2",
    slug: "classic-cotton-dress",
    name: "Classic Cotton Dress",
    category: "Dresses",
    categorySlug: "dresses",
    price: 1499,
    shortDescription: "Versatile cotton dress for effortless everyday elegance.",
    description: "A timeless cotton dress designed for comfort and style. Featuring a flattering silhouette and soft fabric, this dress transitions seamlessly from casual outings to semi-formal occasions. Crafted with careful attention to fit and finish.",
    colors: [
      { name: "Maroon", hex: "#800020" },
      { name: "Navy", hex: "#0B1736" },
      { name: "Beige", hex: "#D4B896" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1708534246055-d7b149acb731"),
      unsplash("1616583936499-d4116e7e2e76"),
    ],
    variants: [
      { sku: "CCD-S-MRN", size: "S", color: "Maroon", stock: 10 },
      { sku: "CCD-M-MRN", size: "M", color: "Maroon", stock: 7 },
      { sku: "CCD-L-MRN", size: "L", color: "Maroon", stock: 4 },
      { sku: "CCD-XL-MRN", size: "XL", color: "Maroon", stock: 2 },
      { sku: "CCD-S-NVY", size: "S", color: "Navy", stock: 5 },
      { sku: "CCD-M-NVY", size: "M", color: "Navy", stock: 8 },
      { sku: "CCD-L-NVY", size: "L", color: "Navy", stock: 6 },
    ],
    isFeatured: true,
  },
  {
    id: "p3",
    slug: "everyday-comfort-top",
    name: "Everyday Comfort Top",
    category: "Tops & Kurtis",
    categorySlug: "tops-kurtis",
    price: 799,
    originalPrice: 999,
    shortDescription: "A relaxed-fit everyday top in soft stretch fabric.",
    description: "The Everyday Comfort Top is designed for those who value both style and ease. Made from a soft stretch fabric with a relaxed fit, it pairs beautifully with palazzos, leggings, or jeans. A wardrobe essential you will reach for again and again.",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Pink", hex: "#F4A0B5" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1766994063815-e4762e991c1f"),
      unsplash("1763637882146-0a276557d2d8"),
    ],
    variants: [
      { sku: "ECT-XS-WHT", size: "XS", color: "White", stock: 12 },
      { sku: "ECT-S-WHT", size: "S", color: "White", stock: 9 },
      { sku: "ECT-M-WHT", size: "M", color: "White", stock: 6 },
      { sku: "ECT-L-WHT", size: "L", color: "White", stock: 3 },
      { sku: "ECT-S-BLK", size: "S", color: "Black", stock: 10 },
      { sku: "ECT-M-BLK", size: "M", color: "Black", stock: 8 },
      { sku: "ECT-XL-BLK", size: "XL", color: "Black", stock: 0 },
    ],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "p4",
    slug: "printed-casual-kurti",
    name: "Printed Casual Kurti",
    category: "Tops & Kurtis",
    categorySlug: "tops-kurtis",
    price: 1099,
    shortDescription: "Vibrant printed kurti with traditional Indian motifs.",
    description: "Celebrate Indian design heritage with this beautifully printed casual kurti. Rich traditional motifs meet modern silhouette design in this versatile piece. The breathable fabric makes it ideal for day-long wear in warm Indian weather.",
    colors: [
      { name: "Red", hex: "#C0392B" },
      { name: "Blue", hex: "#2980B9" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1759840278478-826c0d0f110e"),
      unsplash("1769063382706-8156b3b33eac"),
    ],
    variants: [
      { sku: "PCK-S-RED", size: "S", color: "Red", stock: 8 },
      { sku: "PCK-M-RED", size: "M", color: "Red", stock: 5 },
      { sku: "PCK-L-RED", size: "L", color: "Red", stock: 3 },
      { sku: "PCK-XL-RED", size: "XL", color: "Red", stock: 1 },
      { sku: "PCK-S-BLU", size: "S", color: "Blue", stock: 7 },
      { sku: "PCK-M-BLU", size: "M", color: "Blue", stock: 4 },
    ],
    isFeatured: true,
  },
  {
    id: "p5",
    slug: "minimalist-straight-pants",
    name: "Minimalist Straight Pants",
    category: "Bottom Wear",
    categorySlug: "bottom-wear",
    price: 1199,
    originalPrice: 1499,
    shortDescription: "Clean straight-cut pants with a comfortable waistband.",
    description: "Elevate your bottom wear with these beautifully tailored straight pants. The clean silhouette and comfortable elasticated waistband make them perfect for both office and casual settings. Pair with any kurti or top for a complete look.",
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Beige", hex: "#D4B896" },
      { name: "Navy", hex: "#0B1736" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1610521411256-6664ca58a072"),
      unsplash("1693988513572-9c7ca45ba5e4"),
    ],
    variants: [
      { sku: "MSP-S-BLK", size: "S", color: "Black", stock: 12 },
      { sku: "MSP-M-BLK", size: "M", color: "Black", stock: 9 },
      { sku: "MSP-L-BLK", size: "L", color: "Black", stock: 6 },
      { sku: "MSP-XL-BLK", size: "XL", color: "Black", stock: 4 },
      { sku: "MSP-S-BEI", size: "S", color: "Beige", stock: 5 },
      { sku: "MSP-M-BEI", size: "M", color: "Beige", stock: 3 },
    ],
    isFeatured: true,
  },
  {
    id: "p6",
    slug: "festive-anarkali-dress",
    name: "Festive Anarkali Dress",
    category: "Dresses",
    categorySlug: "dresses",
    price: 2299,
    shortDescription: "Graceful anarkali silhouette for festive occasions.",
    description: "Make a lasting impression with this elegant anarkali dress. The flowing silhouette, intricate embroidery at the neckline, and premium fabric make it perfect for festive occasions and celebrations. Pairs beautifully with statement accessories.",
    colors: [
      { name: "Orange", hex: "#E8701A" },
      { name: "Purple", hex: "#7B5EA7" },
      { name: "Pink", hex: "#E91E8C" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      unsplash("1756483509254-3cc48a5a15b2"),
      unsplash("1678534958454-dcaded7f35a9"),
    ],
    variants: [
      { sku: "FAD-S-ORG", size: "S", color: "Orange", stock: 4 },
      { sku: "FAD-M-ORG", size: "M", color: "Orange", stock: 3 },
      { sku: "FAD-L-ORG", size: "L", color: "Orange", stock: 2 },
      { sku: "FAD-S-PRP", size: "S", color: "Purple", stock: 5 },
      { sku: "FAD-M-PRP", size: "M", color: "Purple", stock: 4 },
      { sku: "FAD-S-PNK", size: "S", color: "Pink", stock: 3 },
      { sku: "FAD-M-PNK", size: "M", color: "Pink", stock: 2 },
    ],
    isFeatured: true,
  },
  {
    id: "p7",
    slug: "classic-women-top",
    name: "Classic Women's Top",
    category: "Tops & Kurtis",
    categorySlug: "tops-kurtis",
    price: 799,
    shortDescription: "A wardrobe-staple women's top in soft fabric.",
    description: "The Classic Women's Top is a must-have for every wardrobe. Cut in a flattering silhouette from soft, breathable fabric, it pairs effortlessly with trousers, palazzos, or skirts. Available in versatile colors for every occasion.",
    colors: [
      { name: "Blue", hex: "#4A90D9" },
      { name: "Pink", hex: "#F4A0B5" },
      { name: "Green", hex: "#5BA65B" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1763559301384-32971cd65ccb"),
      unsplash("1763559038700-a4dd423bafba"),
    ],
    variants: [
      { sku: "CWT-S-BLU", size: "S", color: "Blue", stock: 8 },
      { sku: "CWT-M-BLU", size: "M", color: "Blue", stock: 6 },
      { sku: "CWT-L-BLU", size: "L", color: "Blue", stock: 4 },
      { sku: "CWT-XL-BLU", size: "XL", color: "Blue", stock: 2 },
      { sku: "CWT-S-PNK", size: "S", color: "Pink", stock: 7 },
      { sku: "CWT-M-PNK", size: "M", color: "Pink", stock: 5 },
    ],
    isFeatured: false,
  },
  {
    id: "p8",
    slug: "comfort-fit-bottom-wear",
    name: "Comfort Fit Bottom Wear",
    category: "Bottom Wear",
    categorySlug: "bottom-wear",
    price: 999,
    originalPrice: 1299,
    shortDescription: "Easy-wear palazzo-style bottom in soft fabric.",
    description: "Comfort meets style with these wide-leg palazzo pants. The soft, breathable fabric drapes beautifully while keeping you cool and comfortable all day. An ideal choice for casual outings or relaxed work-from-home days.",
    colors: [
      { name: "White", hex: "#F5F5F5" },
      { name: "Blue", hex: "#5B7FA6" },
      { name: "Beige", hex: "#D4B896" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1693987661225-4f4716d3caa8"),
      unsplash("1693990153494-a046eeb5ba18"),
    ],
    variants: [
      { sku: "CFB-S-WHT", size: "S", color: "White", stock: 10 },
      { sku: "CFB-M-WHT", size: "M", color: "White", stock: 7 },
      { sku: "CFB-L-WHT", size: "L", color: "White", stock: 5 },
      { sku: "CFB-S-BLU", size: "S", color: "Blue", stock: 6 },
      { sku: "CFB-M-BLU", size: "M", color: "Blue", stock: 4 },
      { sku: "CFB-XL-BEI", size: "XL", color: "Beige", stock: 2 },
    ],
    isFeatured: false,
  },
  {
    id: "p9",
    slug: "statement-fashion-earrings",
    name: "Statement Fashion Earrings",
    category: "Accessories",
    categorySlug: "accessories",
    price: 599,
    originalPrice: 799,
    shortDescription: "Elegant drop earrings with vibrant gemstone detail.",
    description: "These statement earrings are the perfect finishing touch to any outfit. Featuring a vibrant blue gemstone in a silver setting, they add an instant touch of elegance. Lightweight and comfortable for all-day wear.",
    colors: [
      { name: "Silver-Blue", hex: "#4A6FA5" },
      { name: "Gold-Green", hex: "#8B9A46" },
    ],
    sizes: ["One Size"],
    images: [
      unsplash("1693212793204-bcea856c75fe"),
      unsplash("1652766540048-de0a878a3266"),
    ],
    variants: [
      { sku: "SFE-OS-SBL", size: "One Size", color: "Silver-Blue", stock: 15 },
      { sku: "SFE-OS-GGR", size: "One Size", color: "Gold-Green", stock: 8 },
    ],
    isFeatured: true,
    isNew: true,
    isNonReturnable: false,
  },
  {
    id: "p10",
    slug: "elegant-everyday-accessories",
    name: "Elegant Everyday Accessories",
    category: "Accessories",
    categorySlug: "accessories",
    price: 449,
    shortDescription: "Delicate silver fashion earrings for everyday elegance.",
    description: "These delicate silver earrings bring refined elegance to your everyday look. The minimalist design pairs with both casual and formal outfits effortlessly. Made from quality metal alloy, they are designed to last.",
    colors: [
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Gold", hex: "#C99724" },
    ],
    sizes: ["One Size"],
    images: [
      unsplash("1606760227091-3dd870d97f1d"),
      unsplash("1549439602-43ebca2327af"),
    ],
    variants: [
      { sku: "EEA-OS-SLV", size: "One Size", color: "Silver", stock: 20 },
      { sku: "EEA-OS-GLD", size: "One Size", color: "Gold", stock: 12 },
    ],
    isFeatured: false,
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getFeaturedProducts = () =>
  products.filter((p) => p.isFeatured);

export const getProductsByCategory = (categorySlug: string) =>
  products.filter((p) => p.categorySlug === categorySlug);

export const getStockForVariant = (product: Product, size: string, color: string) => {
  const variant = product.variants.find(
    (v) => v.size === size && v.color === color
  );
  return variant?.stock ?? 0;
};

export const getTotalStock = (product: Product) =>
  product.variants.reduce((sum, v) => sum + v.stock, 0);
