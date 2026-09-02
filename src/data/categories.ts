export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  image: string;
}

const unsplash = (id: string, w = 600, h = 750) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=85`;

export const categories: Category[] = [
<<<<<<< HEAD
  // ── Top-level ──────────────────────────────────────────────────────────────
  {
    id: "cat-sarees",
    slug: "sarees",
    name: "Sarees",
    description: "Handpicked silk, cotton & designer sarees for every occasion.",
    parentId: null,
    sortOrder: 1,
    isActive: true,
    image: unsplash("1617627143750-d86bc21e42bb"),
  },
  {
    id: "cat-kurtis",
    slug: "kurtis",
    name: "Kurtis & Suits",
    description: "Elegant kurtis, anarkalis and salwar suits for everyday and festive wear.",
    parentId: null,
    sortOrder: 2,
    isActive: true,
    image: unsplash("1708534246051-7f47b279e94b"),
=======
  {
    id: "cat-women",
    slug: "women",
    name: "Women",
    description: "Complete collection for the modern Indian woman.",
    parentId: null,
    sortOrder: 1,
    isActive: true,
    image: unsplash("1716504628204-47f2df8d2634"),
  },
  {
    id: "cat-dresses",
    slug: "dresses",
    name: "Dresses",
    description: "From casual to festive, a dress for every moment.",
    parentId: "cat-women",
    sortOrder: 1,
    isActive: true,
    image: unsplash("1615573678157-69c7fce87d54"),
  },
  {
    id: "cat-tops-kurtis",
    slug: "tops-kurtis",
    name: "Tops & Kurtis",
    description: "Stylish everyday kurtis and contemporary tops.",
    parentId: "cat-women",
    sortOrder: 2,
    isActive: true,
    image: unsplash("1759840278381-bf7d5e332050"),
  },
  {
    id: "cat-bottom-wear",
    slug: "bottom-wear",
    name: "Bottom Wear",
    description: "Palazzos, pants and more for effortless comfort.",
    parentId: "cat-women",
    sortOrder: 3,
    isActive: true,
    image: unsplash("1687825515654-23620796760c"),
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
<<<<<<< HEAD
    description: "Earrings, jewellery and finishing touches to complete your look.",
    parentId: null,
    sortOrder: 3,
    isActive: true,
    image: unsplash("1606760227091-3dd870d97f1d"),
  },

  // ── Sarees sub-categories ──────────────────────────────────────────────────
  {
    id: "cat-silk-sarees",
    slug: "silk-sarees",
    name: "Silk Sarees",
    description: "Luxurious Banarasi, Kanjivaram and Mysore silk sarees.",
    parentId: "cat-sarees",
    sortOrder: 1,
    isActive: true,
    image: unsplash("1618489335755-e3aa2b16cd7a"),
  },
  {
    id: "cat-cotton-sarees",
    slug: "cotton-sarees",
    name: "Cotton Sarees",
    description: "Breathable everyday cotton and printed sarees.",
    parentId: "cat-sarees",
    sortOrder: 2,
    isActive: true,
    image: unsplash("1708182564325-fb1d3a3864d3"),
  },
  {
    id: "cat-party-sarees",
    slug: "party-sarees",
    name: "Party & Festive Sarees",
    description: "Georgette, net and embroidered sarees for celebrations.",
    parentId: "cat-sarees",
    sortOrder: 3,
    isActive: true,
    image: unsplash("1597897569252-9df44c7de0db"),
  },

  // ── Kurtis sub-categories ──────────────────────────────────────────────────
  {
    id: "cat-anarkali",
    slug: "anarkali-kurtis",
    name: "Anarkali Kurtis",
    description: "Flared anarkali kurtis with intricate embroidery and prints.",
    parentId: "cat-kurtis",
    sortOrder: 1,
    isActive: true,
    image: unsplash("1580708570642-2ac35ad8d678"),
  },
  {
    id: "cat-straight-kurtis",
    slug: "straight-kurtis",
    name: "Straight & A-Line Kurtis",
    description: "Everyday straight-cut and A-line kurtis for all body types.",
    parentId: "cat-kurtis",
    sortOrder: 2,
    isActive: true,
    image: unsplash("1604436607823-d721dfe2df46"),
  },
  {
    id: "cat-salwar-suits",
    slug: "salwar-suits",
    name: "Salwar Suits",
    description: "Complete salwar kameez sets with dupatta.",
    parentId: "cat-kurtis",
    sortOrder: 3,
    isActive: true,
    image: unsplash("1669196258957-734cc2d2dddd"),
  },
=======
    description: "Earrings, jewellery and statement finishing touches.",
    parentId: null,
    sortOrder: 2,
    isActive: true,
    image: unsplash("1606760227091-3dd870d97f1d"),
  },
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
];

export const getTopLevelCategories = () =>
  categories.filter((c) => c.parentId === null && c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

export const getChildCategories = (parentId: string) =>
  categories.filter((c) => c.parentId === parentId && c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getCategoryTree = () => {
  const top = getTopLevelCategories();
  return top.map((cat) => ({
    ...cat,
    children: getChildCategories(cat.id),
  }));
};
