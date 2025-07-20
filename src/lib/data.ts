
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  sizes: string[];
  color: string;
  rating: number;
  reviews: number;
  dataAiHint: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Charcoal Crew-Neck Tee",
    price: 4999,
    description:
      "A classic crew-neck t-shirt made from premium Peruvian Pima cotton. Ultra-soft, durable, and perfect for any occasion.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "Charcoal",
    rating: 4.8,
    reviews: 120,
    dataAiHint: "mens t-shirt",
  },
  {
    id: "2",
    name: "Slate Grey V-Neck",
    price: 5499,
    description:
      "Elevate your basics with our V-neck tee. Made from a unique blend of cotton and modal for a silky smooth feel and a flattering drape.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "Grey",
    rating: 4.9,
    reviews: 98,
    dataAiHint: "grey v-neck",
  },
  {
    id: "3",
    name: "Midnight Blue Oxford Shirt",
    price: 12999,
    description:
      "A timeless Oxford shirt in a deep midnight blue. Expertly tailored for a modern fit, featuring a button-down collar and mother-of-pearl buttons.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "Blue",
    rating: 5.0,
    reviews: 210,
    dataAiHint: "blue shirt",
  },
  {
    id: "4",
    name: "Classic White Dress Shirt",
    price: 11999,
    description:
      "The quintessential white dress shirt. Woven from 2-ply Egyptian cotton for a crisp, smooth finish that resists wrinkling.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "White",
    rating: 4.7,
    reviews: 154,
    dataAiHint: "white shirt",
  },
  {
    id: "5",
    name: "Urban Slim-Fit Jeans",
    price: 14999,
    description:
      "Our signature slim-fit jeans in a versatile dark wash. Crafted from premium Japanese selvedge denim with a touch of stretch for comfort.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Jeans",
    sizes: ["30", "32", "34", "36", "38"],
    color: "Blue",
    rating: 4.8,
    reviews: 302,
    dataAiHint: "mens jeans",
  },
  {
    id: "6",
    name: "Vintage Straight-Leg Jeans",
    price: 15999,
    description:
      "A nod to classic Americana, these straight-leg jeans are made from rigid 14oz denim that will break in beautifully over time.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Jeans",
    sizes: ["30", "32", "34", "36"],
    color: "Light Wash",
    rating: 4.9,
    reviews: 250,
    dataAiHint: "blue jeans",
  },
  {
    id: "7",
    name: "Graphite Henley Tee",
    price: 6999,
    description:
      "A sophisticated take on the classic Henley. Features a three-button placket and is crafted from a soft, textured slub cotton.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "Graphite",
    rating: 4.8,
    reviews: 85,
    dataAiHint: "henley shirt",
  },
  {
    id: "8",
    name: "Linen Casual Shirt",
    price: 13999,
    description:
      "Stay cool and stylish in our lightweight linen shirt. Perfect for warm weather, it offers a relaxed fit and exceptional breathability.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "Beige",
    rating: 4.9,
    reviews: 112,
    dataAiHint: "linen shirt",
  },
   {
    id: "9",
    name: "Tech-Knit Sweater",
    price: 18999,
    description:
      "A modern sweater knitted from a technical merino wool blend. It's temperature-regulating, soft, and has a clean, minimalist design.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Sweater",
    sizes: ["S", "M", "L", "XL"],
    color: "Black",
    rating: 4.9,
    reviews: 75,
    dataAiHint: "black sweater",
  },
  {
    id: "10",
    name: "Classic Leather Jacket",
    price: 49999,
    description:
      "An iconic investment piece. This jacket is crafted from full-grain lambskin leather that gets better with every wear.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Jackets",
    sizes: ["S", "M", "L", "XL"],
    color: "Black",
    rating: 5.0,
    reviews: 130,
    dataAiHint: "leather jacket",
  },
  {
    id: "11",
    name: "Oversized Graphic Tee",
    price: 7999,
    description:
      "Make a statement with this oversized t-shirt featuring a vintage-inspired wolf graphic. Made from heavyweight cotton for a structured drape.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Oversized T-shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "Off-White",
    rating: 4.7,
    reviews: 92,
    dataAiHint: "graphic t-shirt",
  },
    {
    id: "12",
    name: "Performance Track Pants",
    price: 11000,
    description:
      "Engineered for movement, these track pants are made from a water-repellent, four-way stretch fabric. Perfect for the gym or the street.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Track Pants",
    sizes: ["S", "M", "L", "XL"],
    color: "Black",
    rating: 4.8,
    reviews: 115,
    dataAiHint: "black track pants",
  },
  {
    id: "13",
    name: "Classic Leather Belt",
    price: 8999,
    description: "A timeless belt crafted from genuine full-grain leather, finished with a classic silver-tone buckle. An essential accessory for any wardrobe.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Belts",
    sizes: ["30", "32", "34", "36", "38"],
    color: "Brown",
    rating: 4.9,
    reviews: 150,
    dataAiHint: "leather belt",
  },
  {
    id: "14",
    name: "Canvas Messenger Bag",
    price: 17999,
    description: "A durable and stylish messenger bag made from heavy-duty canvas with leather accents. Features a padded laptop sleeve and multiple pockets for organization.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Bags",
    sizes: ["One Size"],
    color: "Olive",
    rating: 4.7,
    reviews: 88,
    dataAiHint: "messenger bag",
  },
  {
    id: "15",
    name: "Minimalist Card Holder",
    price: 5999,
    description: "A slim and modern card holder wallet, handcrafted from premium leather. Designed to hold your essential cards and a few folded bills without the bulk.",
    images: [
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
      "https://placehold.co/600x800.png",
    ],
    category: "Wallets",
    sizes: ["One Size"],
    color: "Black",
    rating: 4.8,
    reviews: 112,
    dataAiHint: "leather wallet",
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
