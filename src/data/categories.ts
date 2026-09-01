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
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Earrings, jewellery and statement finishing touches.",
    parentId: null,
    sortOrder: 2,
    isActive: true,
    image: unsplash("1606760227091-3dd870d97f1d"),
  },
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
