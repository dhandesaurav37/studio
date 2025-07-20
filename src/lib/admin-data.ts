
import { Product, initialProducts } from "./data";

interface AdminOrderItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface AdminOrder {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: {
    name: string;
    address: string;
    phone: string;
  };
  paymentMethod: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: AdminOrderItem[];
}

export const adminOrders: AdminOrder[] = [
  {
    id: "-OVLsx3UzbIlUBeRop7U",
    date: "2024-07-17",
    customer: {
      name: "Yashwant Dhande",
      email: "dhandesaurav52@gmail.com",
    },
    shippingAddress: {
      name: "Yashwant Dhande",
      address: "gopal nagar gurkul society, chandrapur, Maharashtra 442401",
      phone: "07219789870",
    },
    paymentMethod: "COD",
    status: "Cancelled",
    total: 5499.00,
    items: [
      { product: initialProducts[1], quantity: 1, size: "S" },
    ],
  },
  {
    id: "-OVOQJrkaziz0YmbYum8",
    date: "2024-07-17",
    customer: {
      name: "Jane Smith",
      email: "janesmith@example.com",
    },
    shippingAddress: {
      name: "Jane Smith",
      address: "456 Oak Avenue, Springfield, IL 62704",
      phone: "555-567-8901",
    },
    paymentMethod: "Credit Card",
    status: "Delivered",
    total: 18498.00,
    items: [
      { product: initialProducts[2], quantity: 1, size: "L" },
      { product: initialProducts[1], quantity: 1, size: "M" },
    ],
  },
  {
    id: "-OVHbOCz9QFAzOkSleZq",
    date: "2024-07-16",
    customer: {
        name: "Yashwant Dhande",
        email: "dhandesaurav52@gmail.com",
    },
    shippingAddress: {
        name: "Yashwant Dhande",
        address: "gopal nagar gurkul society, chandrapur, Maharashtra 442401",
        phone: "07219789870",
    },
    paymentMethod: "COD",
    status: "Shipped",
    total: 20498.00,
    items: [
        { product: initialProducts[4], quantity: 1, size: "32" },
        { product: initialProducts[0], quantity: 1, size: "M" }
    ],
  },
    {
    id: "-OVHbybdzl-09jq9o2IR",
    date: "2024-07-16",
    customer: {
        name: "Bob Johnson",
        email: "bobjohnson@example.com",
    },
    shippingAddress: {
        name: "Bob Johnson",
        address: "789 Pine Lane, Columbus, OH 43215",
        phone: "555-234-5678",
    },
    paymentMethod: "PayPal",
    status: "Pending",
    total: 15999.00,
    items: [
        { product: initialProducts[5], quantity: 1, size: "34" },
    ],
  },
  {
    id: "-OVHcYi56SvRBqlyj-SH",
    date: "2024-07-16",
    customer: {
      name: "Yashwant Dhande",
      email: "dhandesaurav52@gmail.com",
    },
    shippingAddress: {
        name: "Yashwant Dhande",
        address: "gopal nagar gurkul society, chandrapur, Maharashtra 442401",
        phone: "07219789870",
    },
    paymentMethod: "COD",
    status: "Cancelled",
    total: 12999.00,
    items: [
        { product: initialProducts[2], quantity: 1, size: "XL" }
    ],
  }
];
