
export interface Product {
  id: string;
  name: string;
  brand: string;
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

export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  productId: string;
  product?: Product;
}


// This data is now only for initial seeding or as a reference.
// The primary data source is Firebase Realtime Database.
export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Charcoal Crew-Neck Tee",
    brand: "White Wolf",
    price: 1999,
    description:
      "A classic crew-neck t-shirt made from premium Peruvian Pima cotton. Ultra-soft, durable, and perfect for any occasion.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans1.png?alt=media&token=434a1792-805c-44b0-9669-72f3885b54a7",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans2.png?alt=media&token=86d52554-4f40-4545-a13a-966141a067e4",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans3.png?alt=media&token=6059d2da-2a1f-451e-9273-093557e1ab26",
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
    brand: "White Wolf",
    price: 2499,
    description:
      "Elevate your basics with our V-neck tee. Made from a unique blend of cotton and modal for a silky smooth feel and a flattering drape.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fhoddy1.png?alt=media&token=d1d86e58-f3d9-4a4b-8515-53888bd9ed8e",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fhoddy2.png?alt=media&token=6a978680-60b8-4d56-8360-1e5e01869d9c",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fhoddy3.png?alt=media&token=59f4f5f4-3d90-4494-b97c-473d489b48c0",
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
    brand: "White Wolf",
    price: 3999,
    description:
      "A timeless Oxford shirt in a deep midnight blue. Expertly tailored for a modern fit, featuring a button-down collar and mother-of-pearl buttons.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshirt1.png?alt=media&token=9635678a-1c5c-41c1-84de-c8285551c68f",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshirt2.png?alt=media&token=b7c2c95e-1d57-418f-a957-8b01a6136e6e",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshirt3.png?alt=media&token=e9d3d3f9-7d84-4861-9c3f-42e5d7a6e1f0",
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
    brand: "White Wolf",
    price: 3899,
    description:
      "The quintessential white dress shirt. Woven from 2-ply Egyptian cotton for a crisp, smooth finish that resists wrinkling.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Foversized1.png?alt=media&token=0b64f331-50e8-466f-80e2-127814b6ed1a",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Foversized2.png?alt=media&token=e23631b0-1b77-4a00-9e4a-430c45167b6d",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Foversized3.png?alt=media&token=99b8f888-29e5-4f36-b631-15c0e9b9c9f6",
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
    brand: "White Wolf",
    price: 4999,
    description:
      "Our signature slim-fit jeans in a versatile dark wash. Crafted from premium Japanese selvedge denim with a touch of stretch for comfort.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans1.png?alt=media&token=434a1792-805c-44b0-9669-72f3885b54a7",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans2.png?alt=media&token=86d52554-4f40-4545-a13a-966141a067e4",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans3.png?alt=media&token=6059d2da-2a1f-451e-9273-093557e1ab26",
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
    brand: "White Wolf",
    price: 5999,
    description:
      "A nod to classic Americana, these straight-leg jeans are made from rigid 14oz denim that will break in beautifully over time.",
    images: [
       "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans1.png?alt=media&token=434a1792-805c-44b0-9669-72f3885b54a7",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans2.png?alt=media&token=86d52554-4f40-4545-a13a-966141a067e4",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjeans3.png?alt=media&token=6059d2da-2a1f-451e-9273-093557e1ab26",
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
    brand: "White Wolf",
    price: 2999,
    description:
      "A sophisticated take on the classic Henley. Features a three-button placket and is crafted from a soft, textured slub cotton.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftshirt1.png?alt=media&token=a7e4d1f2-1d8f-4b7f-8d2b-5e6f3b8a1c9e",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftshirt2.png?alt=media&token=5b5e7d5f-1a74-4b5a-939d-2e1c9e1c1b1c",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftshirt3.png?alt=media&token=2d7b8b29-19a3-4a25-8884-2a6231a4a4b0",
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
    brand: "White Wolf",
    price: 4299,
    description:
      "Stay cool and stylish in our lightweight linen shirt. Perfect for warm weather, it offers a relaxed fit and exceptional breathability.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshirt1.png?alt=media&token=9635678a-1c5c-41c1-84de-c8285551c68f",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshirt2.png?alt=media&token=b7c2c95e-1d57-418f-a957-8b01a6136e6e",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshirt3.png?alt=media&token=e9d3d3f9-7d84-4861-9c3f-42e5d7a6e1f0",
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
    brand: "White Wolf",
    price: 8999,
    description:
      "A modern sweater knitted from a technical merino wool blend. It's temperature-regulating, soft, and has a clean, minimalist design.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fsweater1.png?alt=media&token=3b5e0b04-8b17-4835-857c-872f3e8b0d4c",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fsweater2.png?alt=media&token=690558a2-8a9d-47fd-8051-4d1e2e9c1b3f",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fsweater3.png?alt=media&token=6a1e3f89-8d5f-4a0b-9b4e-2895a9b2d6a7",
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
    brand: "White Wolf",
    price: 19999,
    description:
      "An iconic investment piece. This jacket is crafted from full-grain lambskin leather that gets better with every wear.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjacket1.png?alt=media&token=ac1a8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjacket2.png?alt=media&token=9c68a4d7-8d2e-4b6e-8d5a-8a5e8c3b9b4b",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fjacket3.png?alt=media&token=2b3d8f8a-4c2d-4c3e-8b6c-2f3b9c7e0a8d",
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
    brand: "White Wolf",
    price: 3499,
    description:
      "Make a statement with this oversized t-shirt featuring a vintage-inspired wolf graphic. Made from heavyweight cotton for a structured drape.",
    images: [
       "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Foversized1.png?alt=media&token=0b64f331-50e8-466f-80e2-127814b6ed1a",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Foversized2.png?alt=media&token=e23631b0-1b77-4a00-9e4a-430c45167b6d",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Foversized3.png?alt=media&token=99b8f888-29e5-4f36-b631-15c0e9b9c9f6",
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
    brand: "White Wolf",
    price: 3999,
    description:
      "Engineered for movement, these track pants are made from a water-repellent, four-way stretch fabric. Perfect for the gym or the street.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftrack1.png?alt=media&token=8a0b5b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftrack2.png?alt=media&token=9c68a4d7-8d2e-4b6e-8d5a-8a5e8c3b9b4b",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftrack3.png?alt=media&token=2b3d8f8a-4c2d-4c3e-8b6c-2f3b9c7e0a8d",
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
    brand: "White Wolf",
    price: 8999,
    description: "A timeless belt crafted from genuine full-grain leather, finished with a classic silver-tone buckle. An essential accessory for any wardrobe.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbelt1.png?alt=media&token=1d8a8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbelt2.png?alt=media&token=2e9a8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbelt3.png?alt=media&token=3f0a8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
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
    brand: "White Wolf",
    price: 7999,
    description: "A durable and stylish messenger bag made from heavy-duty canvas with leather accents. Features a padded laptop sleeve and multiple pockets for organization.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbag1.png?alt=media&token=4g1b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbag2.png?alt=media&token=5h2b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbag3.png?alt=media&token=6i3b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
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
    brand: "White Wolf",
    price: 5999,
    description: "A slim and modern card holder wallet, handcrafted from premium leather. Designed to hold your essential cards and a few folded bills without the bulk.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fwallet1.png?alt=media&token=7j4b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fwallet2.png?alt=media&token=8k5b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fwallet3.png?alt=media&token=9l6b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
    ],
    category: "Wallets",
    sizes: ["One Size"],
    color: "Black",
    rating: 4.8,
    reviews: 112,
    dataAiHint: "leather wallet",
  },
  {
    id: "16",
    name: "Suede Tassel Loafers",
    brand: "White Wolf",
    price: 12999,
    description: "Sophisticated loafers crafted from rich brown suede, featuring elegant tassels. A perfect blend of comfort and style for the discerning gentleman.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshoes1.png?alt=media&token=0m7b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshoes2.png?alt=media&token=1n8b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fshoes3.png?alt=media&token=2o9b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
    ],
    category: "Shoes",
    sizes: ["8", "9", "10", "11", "12"],
    color: "Brown",
    rating: 4.9,
    reviews: 85,
    dataAiHint: "suede loafers",
  },
  {
    id: "17",
    name: "Woven Leather Belt",
    brand: "White Wolf",
    price: 9999,
    description: "An intricately woven leather belt in black, offering a touch of texture and sophistication to any outfit. Finished with a sleek, minimalist buckle.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbelt1.png?alt=media&token=1d8a8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbelt2.png?alt=media&token=2e9a8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fbelt3.png?alt=media&token=3f0a8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
    ],
    category: "Belts",
    sizes: ["30", "32", "34", "36", "38"],
    color: "Black",
    rating: 4.8,
    reviews: 95,
    dataAiHint: "woven belt",
  },
  {
    id: "18",
    name: "Italian Leather Bifold Wallet",
    brand: "White Wolf",
    price: 12999,
    description: "A classic bifold wallet made from supple Italian leather. Features multiple card slots, a bill compartment, and a subtle embossed logo.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fwallet1.png?alt=media&token=7j4b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fwallet2.png?alt=media&token=8k5b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fwallet3.png?alt=media&token=9l6b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
    ],
    category: "Wallets",
    sizes: ["One Size"],
    color: "Cognac",
    rating: 5.0,
    reviews: 110,
    dataAiHint: "leather wallet",
  },
  {
    id: "19",
    name: "Wool Cashmere Overcoat",
    brand: "White Wolf",
    price: 25999,
    description: "A luxurious overcoat crafted from a fine wool and cashmere blend. Its timeless design and superior warmth make it an essential winter garment.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fovercoat1.png?alt=media&token=3p0b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fovercoat2.png?alt=media&token=4q1b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fovercoat3.png?alt=media&token=5r2b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
    ],
    category: "Jackets",
    sizes: ["S", "M", "L", "XL"],
    color: "Camel",
    rating: 5.0,
    reviews: 65,
    dataAiHint: "wool overcoat",
  },
   {
    id: "20",
    name: "Striped Crew-Neck Tee",
    brand: "White Wolf",
    price: 2199,
    description: "A timeless striped t-shirt made from our signature soft Pima cotton. A versatile piece for any casual look.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftshirt1.png?alt=media&token=a7e4d1f2-1d8f-4b7f-8d2b-5e6f3b8a1c9e",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftshirt2.png?alt=media&token=5b5e7d5f-1a74-4b5a-939d-2e1c9e1c1b1c",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Ftshirt3.png?alt=media&token=2d7b8b29-19a3-4a25-8884-2a6231a4a4b0",
    ],
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    color: "Navy/White",
    rating: 4.7,
    reviews: 110,
    dataAiHint: "striped t-shirt"
  },
  {
    id: "21",
    name: "Relaxed Fit Chinos",
    brand: "White Wolf",
    price: 3999,
    description: "Comfortable and stylish relaxed-fit chinos, perfect for smart-casual occasions. Made from a durable cotton twill.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fchinos1.png?alt=media&token=6s3b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fchinos2.png?alt=media&token=7t4b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fchinos3.png?alt=media&token=8u5b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
    ],
    category: "Jeans",
    sizes: ["30", "32", "34", "36", "38"],
    color: "Khaki",
    rating: 4.6,
    reviews: 85,
    dataAiHint: "khaki chinos"
  },
  {
    id: "22",
    name: "Polo Shirt",
    brand: "White Wolf",
    price: 2999,
    description: "A classic polo shirt crafted from breathable cotton pique. A wardrobe staple for a polished yet casual look.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fpolo1.png?alt=media&token=9v6b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fpolo2.png?alt=media&token=0w7b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
      "https://firebasestorage.googleapis.com/v0/b/the-white-wolf-20614.firebasestorage.app/o/Product%20Images%2Fpolo3.png?alt=media&token=1x8b8b1a-28e4-4d83-9b6f-8a0bca13e7d6",
    ],
    category: "Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "Red",
    rating: 4.8,
    reviews: 130,
    dataAiHint: "polo shirt"
  }
];
