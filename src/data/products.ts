export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  stock: number;
  priceOverride?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
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
  colors: ProductColor[];
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
  // ══════════════════════════════════════════════════════
  //  SAREES
  // ══════════════════════════════════════════════════════
  {
    id: "s1",
    slug: "banarasi-silk-saree-red-gold",
    name: "Banarasi Silk Saree",
    category: "Sarees",
    categorySlug: "silk-sarees",
    price: 3999,
    originalPrice: 5499,
    shortDescription: "Opulent Banarasi silk with zari weaving in rich red and gold.",
    description: "Crafted in the heart of Varanasi, this Banarasi silk saree features intricate zari weaving in a timeless red and gold combination. The rich silk fabric drapes beautifully and is perfect for weddings, festive occasions, and celebrations. Each saree is a piece of art that reflects India's weaving heritage.",
    colors: [
      { name: "Red-Gold", hex: "#9B1C1C", image: unsplash("1618489335755-e3aa2b16cd7a") },
      { name: "Maroon-Gold", hex: "#800020", image: unsplash("1610030469983-98e550d6193c") },
    ],
    sizes: ["Free Size"],
    images: [unsplash("1618489335755-e3aa2b16cd7a"), unsplash("1610030469983-98e550d6193c")],
    variants: [
      { sku: "BSS-FS-RG", size: "Free Size", color: "Red-Gold", stock: 8 },
      { sku: "BSS-FS-MG", size: "Free Size", color: "Maroon-Gold", stock: 5 },
    ],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "s2",
    slug: "kanjivaram-silk-saree-green",
    name: "Kanjivaram Silk Saree",
    category: "Sarees",
    categorySlug: "silk-sarees",
    price: 5999,
    originalPrice: 7999,
    shortDescription: "Authentic Kanjivaram with temple border and zari motifs.",
    description: "Sourced from the looms of Kanchipuram, this pure mulberry silk saree features a classic temple border with heavy zari motifs. The vibrant green and gold combination is a quintessential choice for South Indian weddings. Comes with a matching blouse piece.",
    colors: [
      { name: "Green-Gold", hex: "#2D6A4F", image: unsplash("1708182564325-fb1d3a3864d3") },
      { name: "Blue-Gold", hex: "#1B4F8A", image: unsplash("1617627143750-d86bc21e42bb") },
    ],
    sizes: ["Free Size"],
    images: [unsplash("1708182564325-fb1d3a3864d3"), unsplash("1617627143750-d86bc21e42bb")],
    variants: [
      { sku: "KSS-FS-GG", size: "Free Size", color: "Green-Gold", stock: 6 },
      { sku: "KSS-FS-BG", size: "Free Size", color: "Blue-Gold", stock: 4 },
    ],
    isFeatured: true,
  },
  {
    id: "s3",
    slug: "georgette-party-saree-pink",
    name: "Georgette Party Wear Saree",
    category: "Sarees",
    categorySlug: "party-sarees",
    price: 2499,
    originalPrice: 3299,
    shortDescription: "Flowy georgette saree with sequin border for parties.",
    description: "Light as a feather and glamorous, this georgette party wear saree features a heavy sequin-work border that catches the light beautifully. The soft fabric drapes effortlessly and is easy to wear, making it a favourite for cocktail parties, receptions, and festive evenings.",
    colors: [
      { name: "Rose Pink", hex: "#E91E8C", image: unsplash("1597897569252-9df44c7de0db") },
      { name: "Lavender", hex: "#9B59B6", image: unsplash("1617627143750-d86bc21e42bb") },
      { name: "Teal", hex: "#00838F", image: unsplash("1708182564325-fb1d3a3864d3") },
    ],
    sizes: ["Free Size"],
    images: [
      unsplash("1597897569252-9df44c7de0db"),
      unsplash("1617627143750-d86bc21e42bb"),
      unsplash("1708182564325-fb1d3a3864d3"),
    ],
    variants: [
      { sku: "GPS-FS-PNK", size: "Free Size", color: "Rose Pink", stock: 10 },
      { sku: "GPS-FS-LAV", size: "Free Size", color: "Lavender", stock: 7 },
      { sku: "GPS-FS-TEL", size: "Free Size", color: "Teal", stock: 5 },
    ],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "s4",
    slug: "cotton-printed-saree-blue",
    name: "Cotton Printed Saree",
    category: "Sarees",
    categorySlug: "cotton-sarees",
    price: 1299,
    originalPrice: 1699,
    shortDescription: "Breathable cotton saree with vibrant block print design.",
    description: "Perfect for everyday wear and office use, this pure cotton saree features a beautiful block print design in indigo and white. The breathable fabric keeps you cool through the day, while the traditional print adds elegance to even the simplest of looks.",
    colors: [
      { name: "Indigo Blue", hex: "#264796", image: unsplash("1739429942851-9083ee185d3d") },
      { name: "Earthy Red", hex: "#B34040", image: unsplash("1618489335755-e3aa2b16cd7a") },
      { name: "Forest Green", hex: "#2E5A27", image: unsplash("1708182564325-fb1d3a3864d3") },
    ],
    sizes: ["Free Size"],
    images: [
      unsplash("1739429942851-9083ee185d3d"),
      unsplash("1618489335755-e3aa2b16cd7a"),
      unsplash("1708182564325-fb1d3a3864d3"),
    ],
    variants: [
      { sku: "CPS-FS-IB", size: "Free Size", color: "Indigo Blue", stock: 15 },
      { sku: "CPS-FS-ER", size: "Free Size", color: "Earthy Red", stock: 12 },
      { sku: "CPS-FS-FG", size: "Free Size", color: "Forest Green", stock: 9 },
    ],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "s5",
    slug: "chiffon-floral-saree-peach",
    name: "Chiffon Floral Saree",
    category: "Sarees",
    categorySlug: "party-sarees",
    price: 1799,
    shortDescription: "Lightweight chiffon saree with delicate floral print.",
    description: "This graceful chiffon saree features a delicate all-over floral print in soft peach and ivory tones. The lightweight fabric flows effortlessly and is ideal for day events, family gatherings, and casual celebrations. Easy to drape and maintain.",
    colors: [
      { name: "Peach", hex: "#FFCBA4", image: unsplash("1693023656257-87c142566ad3") },
      { name: "Ivory", hex: "#FFFFF0", image: unsplash("1739429942851-9083ee185d3d") },
    ],
    sizes: ["Free Size"],
    images: [unsplash("1693023656257-87c142566ad3"), unsplash("1739429942851-9083ee185d3d")],
    variants: [
      { sku: "CFS-FS-PCH", size: "Free Size", color: "Peach", stock: 8 },
      { sku: "CFS-FS-IVR", size: "Free Size", color: "Ivory", stock: 6 },
    ],
    isFeatured: false,
  },
  {
    id: "s6",
    slug: "chanderi-silk-saree-yellow",
    name: "Chanderi Silk Saree",
    category: "Sarees",
    categorySlug: "silk-sarees",
    price: 2799,
    originalPrice: 3599,
    shortDescription: "Sheer Chanderi silk with golden buti work all over.",
    description: "Woven in Chanderi, Madhya Pradesh, this exquisite silk-cotton blend saree features fine buti work woven in gold thread across the sheer body. The lightweight yet luminous fabric catches the light beautifully, making it ideal for festive daytime events.",
    colors: [
      { name: "Yellow-Gold", hex: "#D4A017", image: unsplash("1597897569252-9df44c7de0db") },
      { name: "Pink-Gold", hex: "#D4547A", image: unsplash("1618489335755-e3aa2b16cd7a") },
    ],
    sizes: ["Free Size"],
    images: [unsplash("1597897569252-9df44c7de0db"), unsplash("1618489335755-e3aa2b16cd7a")],
    variants: [
      { sku: "CSS-FS-YG", size: "Free Size", color: "Yellow-Gold", stock: 7 },
      { sku: "CSS-FS-PG", size: "Free Size", color: "Pink-Gold", stock: 4 },
    ],
    isFeatured: false,
    isNew: true,
  },
  {
    id: "s7",
    slug: "linen-handloom-saree-natural",
    name: "Linen Handloom Saree",
    category: "Sarees",
    categorySlug: "cotton-sarees",
    price: 1599,
    shortDescription: "Handwoven linen saree in natural tones with zari border.",
    description: "Sustainable and stylish, this handwoven linen saree comes in natural earth tones with a fine zari border. A favourite among working women for its easy-drape quality and understated elegance. Pairs beautifully with simple jewellery and a minimalist blouse.",
    colors: [
      { name: "Natural", hex: "#C4A882", image: unsplash("1610030469983-98e550d6193c") },
      { name: "Slate Grey", hex: "#6B7280", image: unsplash("1739429942851-9083ee185d3d") },
    ],
    sizes: ["Free Size"],
    images: [unsplash("1610030469983-98e550d6193c"), unsplash("1739429942851-9083ee185d3d")],
    variants: [
      { sku: "LHS-FS-NAT", size: "Free Size", color: "Natural", stock: 12 },
      { sku: "LHS-FS-SGR", size: "Free Size", color: "Slate Grey", stock: 8 },
    ],
    isFeatured: false,
  },

  // ══════════════════════════════════════════════════════
  //  KURTIS & SUITS
  // ══════════════════════════════════════════════════════
  {
    id: "k1",
    slug: "anarkali-kurti-maroon-embroidered",
    name: "Anarkali Embroidered Kurti",
    category: "Kurtis & Suits",
    categorySlug: "anarkali-kurtis",
    price: 1499,
    originalPrice: 1999,
    shortDescription: "Floor-length anarkali with hand-embroidered neckline.",
    description: "This stunning floor-length anarkali kurti features intricate hand embroidery at the yoke and neckline. Made from premium georgette fabric, the flared silhouette creates a graceful, feminine look. Perfect for festivals, family functions, and special evenings. Comes with inner lining.",
    colors: [
      { name: "Royal Blue", hex: "#1B3A8A", image: unsplash("1580708570642-2ac35ad8d678") },
      { name: "Maroon", hex: "#800020", image: unsplash("1708534246051-7f47b279e94b") },
      { name: "Bottle Green", hex: "#1A5C38", image: unsplash("1669196258957-734cc2d2dddd") },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1580708570642-2ac35ad8d678"),
      unsplash("1708534246051-7f47b279e94b"),
      unsplash("1669196258957-734cc2d2dddd"),
    ],
    variants: [
      { sku: "AEK-S-MRN", size: "S", color: "Maroon", stock: 8 },
      { sku: "AEK-M-MRN", size: "M", color: "Maroon", stock: 10 },
      { sku: "AEK-L-MRN", size: "L", color: "Maroon", stock: 6 },
      { sku: "AEK-XL-MRN", size: "XL", color: "Maroon", stock: 4 },
      { sku: "AEK-S-RB", size: "S", color: "Royal Blue", stock: 6 },
      { sku: "AEK-M-RB", size: "M", color: "Royal Blue", stock: 8 },
      { sku: "AEK-S-BG", size: "S", color: "Bottle Green", stock: 5 },
      { sku: "AEK-M-BG", size: "M", color: "Bottle Green", stock: 4 },
    ],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "k2",
    slug: "straight-cotton-kurti-floral",
    name: "Floral Cotton Straight Kurti",
    category: "Kurtis & Suits",
    categorySlug: "straight-kurtis",
    price: 899,
    originalPrice: 1199,
    shortDescription: "Everyday floral cotton kurti with mandarin collar.",
    description: "A wardrobe staple for everyday wear, this straight-cut cotton kurti features a fresh floral print with a mandarin collar and 3/4 sleeves. The pure cotton fabric is soft, breathable, and ideal for long summer days. Pairs well with leggings, palazzo pants, or jeans.",
    colors: [
      { name: "Blue Floral", hex: "#3B6FA0", image: unsplash("1604436607823-d721dfe2df46") },
      { name: "Peach Floral", hex: "#E8A87C", image: unsplash("1580709906575-0c52ca5a21c6") },
      { name: "Green Floral", hex: "#3A7D44", image: unsplash("1708534419572-6e6614a53ca1") },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1604436607823-d721dfe2df46"),
      unsplash("1580709906575-0c52ca5a21c6"),
      unsplash("1708534419572-6e6614a53ca1"),
    ],
    variants: [
      { sku: "FCK-XS-BF", size: "XS", color: "Blue Floral", stock: 10 },
      { sku: "FCK-S-BF", size: "S", color: "Blue Floral", stock: 14 },
      { sku: "FCK-M-BF", size: "M", color: "Blue Floral", stock: 12 },
      { sku: "FCK-L-BF", size: "L", color: "Blue Floral", stock: 8 },
      { sku: "FCK-XL-BF", size: "XL", color: "Blue Floral", stock: 5 },
      { sku: "FCK-S-PF", size: "S", color: "Peach Floral", stock: 10 },
      { sku: "FCK-M-PF", size: "M", color: "Peach Floral", stock: 9 },
      { sku: "FCK-S-GF", size: "S", color: "Green Floral", stock: 7 },
      { sku: "FCK-M-GF", size: "M", color: "Green Floral", stock: 6 },
    ],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "k3",
    slug: "salwar-kameez-set-purple",
    name: "Salwar Kameez Set with Dupatta",
    category: "Kurtis & Suits",
    categorySlug: "salwar-suits",
    price: 1899,
    originalPrice: 2499,
    shortDescription: "Complete three-piece salwar suit in rich purple georgette.",
    description: "An elegant three-piece salwar kameez set featuring a long kameez with intricate print, matching straight-cut salwar, and a sheer dupatta. Made from soft georgette fabric, this set is perfect for family gatherings, festive occasions, and celebrations. Fully stitched and ready to wear.",
    colors: [
      { name: "Purple", hex: "#7B5EA7", image: unsplash("1708534246051-7f47b279e94b") },
      { name: "Mustard", hex: "#D4A017", image: unsplash("1597897569252-9df44c7de0db") },
      { name: "Coral", hex: "#E8603C", image: unsplash("1669196258957-734cc2d2dddd") },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1708534246051-7f47b279e94b"),
      unsplash("1597897569252-9df44c7de0db"),
      unsplash("1669196258957-734cc2d2dddd"),
    ],
    variants: [
      { sku: "SKS-S-PRP", size: "S", color: "Purple", stock: 7 },
      { sku: "SKS-M-PRP", size: "M", color: "Purple", stock: 9 },
      { sku: "SKS-L-PRP", size: "L", color: "Purple", stock: 6 },
      { sku: "SKS-XL-PRP", size: "XL", color: "Purple", stock: 3 },
      { sku: "SKS-S-MST", size: "S", color: "Mustard", stock: 5 },
      { sku: "SKS-M-MST", size: "M", color: "Mustard", stock: 7 },
      { sku: "SKS-S-CRL", size: "S", color: "Coral", stock: 4 },
      { sku: "SKS-M-CRL", size: "M", color: "Coral", stock: 5 },
    ],
    isFeatured: true,
  },
  {
    id: "k4",
    slug: "a-line-block-print-kurti",
    name: "A-Line Block Print Kurti",
    category: "Kurtis & Suits",
    categorySlug: "straight-kurtis",
    price: 999,
    shortDescription: "Handcrafted block print A-line kurti in natural dyes.",
    description: "A celebration of traditional Indian craftsmanship, this A-line kurti is hand block-printed using natural vegetable dyes on soft cotton fabric. The relaxed fit and knee-length silhouette make it versatile for both casual and semi-formal occasions. Each piece is unique.",
    colors: [
      { name: "Beige-Red", hex: "#C17F59", image: unsplash("1580709906575-0c52ca5a21c6") },
      { name: "White-Blue", hex: "#5B9BD5", image: unsplash("1604436607823-d721dfe2df46") },
      { name: "Cream-Black", hex: "#3D3D3D", image: unsplash("1708534419572-6e6614a53ca1") },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1580709906575-0c52ca5a21c6"),
      unsplash("1604436607823-d721dfe2df46"),
      unsplash("1708534419572-6e6614a53ca1"),
    ],
    variants: [
      { sku: "ABK-S-BR", size: "S", color: "Beige-Red", stock: 9 },
      { sku: "ABK-M-BR", size: "M", color: "Beige-Red", stock: 11 },
      { sku: "ABK-L-BR", size: "L", color: "Beige-Red", stock: 7 },
      { sku: "ABK-S-WB", size: "S", color: "White-Blue", stock: 8 },
      { sku: "ABK-M-WB", size: "M", color: "White-Blue", stock: 10 },
      { sku: "ABK-S-CB", size: "S", color: "Cream-Black", stock: 6 },
    ],
    isFeatured: false,
    isNew: true,
  },
  {
    id: "k5",
    slug: "designer-kurti-with-jacket",
    name: "Designer Kurti with Jacket",
    category: "Kurtis & Suits",
    categorySlug: "anarkali-kurtis",
    price: 2199,
    originalPrice: 2999,
    shortDescription: "Stylish kurti and jacket set for festive and party wear.",
    description: "Stand out with this designer kurti and jacket set. The inner kurti features elegant embroidery while the outer jacket adds a layer of sophistication with its structured silhouette and contrast fabric trim. A modern take on traditional Indian fashion.",
    colors: [
      { name: "Wine Red", hex: "#722F37", image: unsplash("1669196258957-734cc2d2dddd") },
      { name: "Teal", hex: "#008080", image: unsplash("1580708570642-2ac35ad8d678") },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [unsplash("1669196258957-734cc2d2dddd"), unsplash("1580708570642-2ac35ad8d678")],
    variants: [
      { sku: "DKJ-S-WR", size: "S", color: "Wine Red", stock: 5 },
      { sku: "DKJ-M-WR", size: "M", color: "Wine Red", stock: 7 },
      { sku: "DKJ-L-WR", size: "L", color: "Wine Red", stock: 4 },
      { sku: "DKJ-S-TL", size: "S", color: "Teal", stock: 4 },
      { sku: "DKJ-M-TL", size: "M", color: "Teal", stock: 6 },
    ],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "k6",
    slug: "rayon-straight-kurti-embroidery",
    name: "Rayon Embroidered Straight Kurti",
    category: "Kurtis & Suits",
    categorySlug: "straight-kurtis",
    price: 799,
    originalPrice: 999,
    shortDescription: "Soft rayon kurti with thread embroidery on yoke.",
    description: "A lightweight, casual-chic kurti made from soft rayon with thread embroidery at the yoke. Perfect for college, office, or casual outings. The straight fit is flattering for all body types and the fabric stays wrinkle-free throughout the day.",
    colors: [
      { name: "Sky Blue", hex: "#87CEEB", image: unsplash("1708534419572-6e6614a53ca1") },
      { name: "Mint Green", hex: "#98FF98", image: unsplash("1604436607823-d721dfe2df46") },
      { name: "Lavender", hex: "#B57BDB", image: unsplash("1708534246051-7f47b279e94b") },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      unsplash("1708534419572-6e6614a53ca1"),
      unsplash("1604436607823-d721dfe2df46"),
      unsplash("1708534246051-7f47b279e94b"),
    ],
    variants: [
      { sku: "REK-XS-SB", size: "XS", color: "Sky Blue", stock: 10 },
      { sku: "REK-S-SB", size: "S", color: "Sky Blue", stock: 13 },
      { sku: "REK-M-SB", size: "M", color: "Sky Blue", stock: 11 },
      { sku: "REK-L-SB", size: "L", color: "Sky Blue", stock: 7 },
      { sku: "REK-S-MG", size: "S", color: "Mint Green", stock: 9 },
      { sku: "REK-M-MG", size: "M", color: "Mint Green", stock: 8 },
      { sku: "REK-S-LV", size: "S", color: "Lavender", stock: 6 },
    ],
    isFeatured: false,
  },

  // ══════════════════════════════════════════════════════
  //  ACCESSORIES
  // ══════════════════════════════════════════════════════
  {
    id: "a1",
    slug: "statement-jhumka-earrings",
    name: "Statement Jhumka Earrings",
    category: "Accessories",
    categorySlug: "accessories",
    price: 599,
    originalPrice: 799,
    shortDescription: "Traditional gold-finish jhumkas with meenakari detail.",
    description: "These beautifully crafted jhumka earrings feature intricate meenakari enamel work in vibrant colours set against a gold finish. A perfect match for sarees and kurtis alike. Lightweight design ensures comfort for all-day wear.",
    colors: [
      { name: "Gold-Red", hex: "#C99724", image: unsplash("1606760227091-3dd870d97f1d") },
      { name: "Gold-Green", hex: "#4A7C59", image: unsplash("1549439602-43ebca2327af") },
    ],
    sizes: ["One Size"],
    images: [unsplash("1606760227091-3dd870d97f1d"), unsplash("1549439602-43ebca2327af")],
    variants: [
      { sku: "SJE-OS-GR", size: "One Size", color: "Gold-Red", stock: 18 },
      { sku: "SJE-OS-GG", size: "One Size", color: "Gold-Green", stock: 12 },
    ],
    isFeatured: true,
    isNew: true,
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
