"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  StarIcon,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

type Order = {
  _id: string;
  createdAt: string;
  orderStatus: string;
  finalAmount: number;
  products: {
    productId: string;
    variantId: string;
    quantity: number;
    size: string;
    priceAtPurchase: number;
    name: string;
    image: string;
  }[];
  address: {
    name: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  payment: {
    paymentStatus: string;
    paymentMethod: string;
  };
};

const mockOrders: Order[] = [
  {
    _id: "1",
    createdAt: "2023-06-01T10:00:00Z",
    orderStatus: "Processing",
    finalAmount: 150.99,
    products: [
      {
        productId: "p1",
        variantId: "v1",
        quantity: 2,
        size: "M",
        priceAtPurchase: 59.99,
        name: "Classic T-Shirt",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        productId: "p2",
        variantId: "v2",
        quantity: 1,
        size: "L",
        priceAtPurchase: 31.01,
        name: "Denim Jeans",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    address: {
      name: "John Doe",
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
    },
    payment: {
      paymentStatus: "completed",
      paymentMethod: "card",
    },
  },
  {
    _id: "2",
    createdAt: "2023-06-15T14:30:00Z",
    orderStatus: "Shipped",
    finalAmount: 89.99,
    products: [
      {
        productId: "p3",
        variantId: "v3",
        quantity: 1,
        size: "S",
        priceAtPurchase: 89.99,
        name: "Designer Dress",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    address: {
      name: "Jane Smith",
      addressLine1: "456 Elm St",
      city: "Other City",
      state: "NY",
      postalCode: "67890",
    },
    payment: {
      paymentStatus: "completed",
      paymentMethod: "paypal",
    },
  },
];

export function MyOrdersComponent() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-500";
      case "shipped":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Orders
      </h1>
      <div className="space-y-6">
        {mockOrders.map((order) => (
          <Card
            key={order._id}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Order #{order._id}</CardTitle>
                <Badge
                  className={`${getStatusColor(
                    order.orderStatus
                  )} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                >
                  {order.orderStatus}
                </Badge>
              </div>
              <CardDescription className="text-gray-100 flex items-center mt-2">
                <Calendar className="mr-2 h-4 w-4" />
                Placed on {format(new Date(order.createdAt), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-gray-600">
                  <Package className="mr-2 h-5 w-5" />
                  <span>{order.products.length} item(s)</span>
                </div>
                <div className="font-semibold text-lg text-gray-800">
                  Total: ${order.finalAmount.toFixed(2)}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toggleOrderDetails(order._id)}
              >
                {expandedOrder === order._id ? (
                  <>
                    Hide Details
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View Details
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
            <AnimatePresence>
              {expandedOrder === order._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <h4 className="font-semibold mb-4 text-lg text-gray-800">
                        Products
                      </h4>
                      <div className="space-y-4">
                        {order.products.map((product, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 pb-4 border-b last:border-b-0"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800">
                                {product.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                Size: {product.size}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {product.quantity}
                              </p>
                              <p className="text-sm font-semibold text-gray-800">
                                Price: ${product.priceAtPurchase.toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              className="bg-white text-gray-800 hover:bg-gray-100"
                            >
                              <StarIcon className="mr-2 h-4 w-4" />
                              Write a Review
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />

                      <h4 className="font-semibold mb-2 text-lg text-gray-800">
                        Shipping Address
                      </h4>
                      <div className="flex items-start space-x-2 text-gray-600">
                        <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                          <p>{order.address.name}</p>
                          <p>{order.address.addressLine1}</p>
                          <p>
                            {order.address.city}, {order.address.state}{" "}
                            {order.address.postalCode}
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <h4 className="font-semibold mb-2 text-lg text-gray-800">
                        Payment
                      </h4>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p>Status: {order.payment.paymentStatus}</p>
                          <p>Method: {order.payment.paymentMethod}</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}
