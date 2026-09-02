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
<<<<<<< HEAD
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
    colors: [{ name: "Red-Gold", hex: "#9B1C1C" }, { name: "Maroon-Gold", hex: "#800020" }],
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
    colors: [{ name: "Green-Gold", hex: "#2D6A4F" }, { name: "Blue-Gold", hex: "#1B4F8A" }],
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
    colors: [{ name: "Rose Pink", hex: "#E91E8C" }, { name: "Lavender", hex: "#9B59B6" }, { name: "Teal", hex: "#00838F" }],
    sizes: ["Free Size"],
    images: [unsplash("1597897569252-9df44c7de0db"), unsplash("1617627143750-d86bc21e42bb")],
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
    colors: [{ name: "Indigo Blue", hex: "#264796" }, { name: "Earthy Red", hex: "#B34040" }, { name: "Forest Green", hex: "#2E5A27" }],
    sizes: ["Free Size"],
    images: [unsplash("1739429942851-9083ee185d3d"), unsplash("1708182564325-fb1d3a3864d3")],
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
    colors: [{ name: "Peach", hex: "#FFCBA4" }, { name: "Ivory", hex: "#FFFFF0" }],
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
    colors: [{ name: "Yellow-Gold", hex: "#D4A017" }, { name: "Pink-Gold", hex: "#D4547A" }],
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
    colors: [{ name: "Natural", hex: "#C4A882" }, { name: "Slate Grey", hex: "#6B7280" }],
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
    colors: [{ name: "Maroon", hex: "#800020" }, { name: "Royal Blue", hex: "#1B3A8A" }, { name: "Bottle Green", hex: "#1A5C38" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [unsplash("1580708570642-2ac35ad8d678"), unsplash("1708534246051-7f47b279e94b")],
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
    colors: [{ name: "Blue Floral", hex: "#3B6FA0" }, { name: "Peach Floral", hex: "#E8A87C" }, { name: "Green Floral", hex: "#3A7D44" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [unsplash("1604436607823-d721dfe2df46"), unsplash("1580709906575-0c52ca5a21c6")],
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
    colors: [{ name: "Purple", hex: "#7B5EA7" }, { name: "Mustard", hex: "#D4A017" }, { name: "Coral", hex: "#E8603C" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [unsplash("1708534246051-7f47b279e94b"), unsplash("1669196258957-734cc2d2dddd")],
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
    colors: [{ name: "Beige-Red", hex: "#C17F59" }, { name: "White-Blue", hex: "#5B9BD5" }, { name: "Cream-Black", hex: "#3D3D3D" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [unsplash("1580709906575-0c52ca5a21c6"), unsplash("1604436607823-d721dfe2df46")],
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
    colors: [{ name: "Wine Red", hex: "#722F37" }, { name: "Teal", hex: "#008080" }],
    sizes: ["S", "M", "L", "XL"],
    images: [unsplash("1669196258957-734cc2d2dddd"), unsplash("1580708570642-2ac35ad8d678")],
    variants: [
      { sku: "DKJ-S-WR", size: "S", color: "Wine Red", stock: 5 },
      { sku: "DKJ-M-WR", size: "M", color: "Wine Red", stock: 7 },
      { sku: "DKJ-L-WR", size: "L", color: "Wine Red", stock: 4 },
      { sku: "DKJ-S-TL", size: "S", color: "Teal", stock: 4 },
      { sku: "DKJ-M-TL", size: "M", color: "Teal", stock: 6 },
=======
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
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
    ],
    isFeatured: true,
    isNew: true,
  },
  {
<<<<<<< HEAD
    id: "k6",
    slug: "rayon-straight-kurti-embroidery",
    name: "Rayon Embroidered Straight Kurti",
    category: "Kurtis & Suits",
    categorySlug: "straight-kurtis",
    price: 799,
    originalPrice: 999,
    shortDescription: "Soft rayon kurti with thread embroidery on yoke.",
    description: "A lightweight, casual-chic kurti made from soft rayon with thread embroidery at the yoke. Perfect for college, office, or casual outings. The straight fit is flattering for all body types and the fabric stays wrinkle-free throughout the day.",
    colors: [{ name: "Sky Blue", hex: "#87CEEB" }, { name: "Mint Green", hex: "#98FF98" }, { name: "Lavender", hex: "#B57BDB" }],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [unsplash("1708534419572-6e6614a53ca1"), unsplash("1604436607823-d721dfe2df46")],
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
=======
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
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
    category: "Accessories",
    categorySlug: "accessories",
    price: 599,
    originalPrice: 799,
<<<<<<< HEAD
    shortDescription: "Traditional gold-finish jhumkas with meenakari detail.",
    description: "These beautifully crafted jhumka earrings feature intricate meenakari enamel work in vibrant colours set against a gold finish. A perfect match for sarees and kurtis alike. Lightweight design ensures comfort for all-day wear.",
    colors: [{ name: "Gold-Red", hex: "#C99724" }, { name: "Gold-Green", hex: "#4A7C59" }],
    sizes: ["One Size"],
    images: [unsplash("1606760227091-3dd870d97f1d"), unsplash("1549439602-43ebca2327af")],
    variants: [
      { sku: "SJE-OS-GR", size: "One Size", color: "Gold-Red", stock: 18 },
      { sku: "SJE-OS-GG", size: "One Size", color: "Gold-Green", stock: 12 },
    ],
    isFeatured: true,
    isNew: true,
=======
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
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
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
