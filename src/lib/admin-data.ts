
import { Product, initialProducts } from "./data";
import type { OrderStatus } from "@/hooks/use-store";

interface AdminOrderItem {
  productId: string;
  size: string;
  quantity: number;
  product?: Product; // product is optional now, will be hydrated
}

export interface AdminOrder {
  id: string;
  date: string;
  deliveryDate?: string;
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
  status: OrderStatus;
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
      { productId: "2", quantity: 1, size: "S", product: initialProducts[1] },
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
    status: "Order Returned Successfully",
    deliveryDate: "2024-07-20T10:00:00.000Z",
    total: 18498.00,
    items: [
      { productId: "3", quantity: 1, size: "L", product: initialProducts[2] },
      { productId: "2", quantity: 1, size: "M", product: initialProducts[1] },
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
    status: "Return Request Accepted",
    total: 20498.00,
    items: [
        { productId: "5", quantity: 1, size: "32", product: initialProducts[4] },
        { productId: "1", quantity: 1, size: "M", product: initialProducts[0] }
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
    status: "Return Requested",
    total: 15999.00,
    items: [
        { productId: "6", quantity: 1, size: "34", product: initialProducts[5] },
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
    status: "Return Rejected",
    total: 12999.00,
    items: [
        { productId: "3", quantity: 1, size: "XL", product: initialProducts[2] }
    ],
  }
];
