export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  sizes: string[];
  rating: number;
  reviews: number;
  dataAiHint: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Charcoal Crew-Neck Tee",
    price: 49.99,
    description:
      "A classic crew-neck t-shirt made from premium Peruvian Pima cotton. Ultra-soft, durable, and perfect for any occasion.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "t-shirts",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 120,
    dataAiHint: "mens t-shirt",
  },
  {
    id: "2",
    name: "Slate Grey V-Neck",
    price: 54.99,
    description:
      "Elevate your basics with our V-neck tee. Made from a unique blend of cotton and modal for a silky smooth feel and a flattering drape.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "t-shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.9,
    reviews: 98,
    dataAiHint: "grey v-neck",
  },
  {
    id: "3",
    name: "Midnight Blue Oxford Shirt",
    price: 129.99,
    description:
      "A timeless Oxford shirt in a deep midnight blue. Expertly tailored for a modern fit, featuring a button-down collar and mother-of-pearl buttons.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "shirts",
    sizes: ["S", "M", "L", "XL"],
    rating: 5.0,
    reviews: 210,
    dataAiHint: "blue shirt",
  },
  {
    id: "4",
    name: "Classic White Dress Shirt",
    price: 119.99,
    description:
      "The quintessential white dress shirt. Woven from 2-ply Egyptian cotton for a crisp, smooth finish that resists wrinkling.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "shirts",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 154,
    dataAiHint: "white shirt",
  },
  {
    id: "5",
    name: "Urban Slim-Fit Jeans",
    price: 149.99,
    description:
      "Our signature slim-fit jeans in a versatile dark wash. Crafted from premium Japanese selvedge denim with a touch of stretch for comfort.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "jeans",
    sizes: ["30", "32", "34", "36", "38"],
    rating: 4.8,
    reviews: 302,
    dataAiHint: "mens jeans",
  },
  {
    id: "6",
    name: "Vintage Straight-Leg Jeans",
    price: 159.99,
    description:
      "A nod to classic Americana, these straight-leg jeans are made from rigid 14oz denim that will break in beautifully over time.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "jeans",
    sizes: ["30", "32", "34", "36"],
    rating: 4.9,
    reviews: 250,
    dataAiHint: "blue jeans",
  },
  {
    id: "7",
    name: "Graphite Henley Tee",
    price: 69.99,
    description:
      "A sophisticated take on the classic Henley. Features a three-button placket and is crafted from a soft, textured slub cotton.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "t-shirts",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 85,
    dataAiHint: "henley shirt",
  },
  {
    id: "8",
    name: "Linen Casual Shirt",
    price: 139.99,
    description:
      "Stay cool and stylish in our lightweight linen shirt. Perfect for warm weather, it offers a relaxed fit and exceptional breathability.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.9,
    reviews: 112,
    dataAiHint: "linen shirt",
  },
  {
    id: "9",
    name: "Men's Super Pants",
    price: 189.99,
    description:
      "Not just pants, Super Pants. Engineered for maximum comfort and style with 4-way stretch, premium fabric, and wrinkle resistance.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "pants",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 178,
    dataAiHint: "man black pants",
  },
  {
    id: "10",
    name: "Men's Modern Trousers",
    price: 179.99,
    description:
      "A modern take on classic trousers. Perfect for the office or a night out. Features a sleek design and premium materials.",
    images: [
      "https://placehold.co/600x800",
      "https://placehold.co/600x800",
    ],
    category: "pants",
    sizes: ["30", "32", "34", "36"],
    rating: 4.8,
    reviews: 150,
    dataAiHint: "man modern trousers",
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
