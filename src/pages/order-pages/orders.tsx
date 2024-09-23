"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { userorders } from "@/state-manager/slices/orderSlice";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/helper/Loader";

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

export default function Orders() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  useEffect(() => {
    dispatch(userorders())
      .then(() => {
        toast({
          title: "Fectehd your order details successfully",
        });
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });
  }, []);
  const { Myorders, isLoading } = useAppSelector((state) => state.order);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100";
      case "delivered":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100";
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">My Orders</h1>
      <div className="space-y-4">
        {Myorders.map((order) => (
          <Card key={order._id} className="border border-border">
            <CardHeader className="bg-muted">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium text-foreground">
                  Order #{order._id}
                </CardTitle>
                <Badge
                  className={`${getStatusColor(
                    order.orderStatus
                  )} px-2 py-1 text-xs font-medium`}
                >
                  {order.orderStatus}
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground flex items-center mt-1">
                <Calendar className="mr-1 h-3 w-3" />
                Placed on {format(new Date(order.createdAt), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Package className="mr-1 h-4 w-4" />
                  <span>{order.products.length} item(s)</span>
                </div>
                <div className="font-medium text-foreground">
                  Total: ${order.finalAmount.toFixed(2)}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-sm"
                onClick={() => toggleOrderDetails(order._id)}
              >
                {expandedOrder === order._id ? (
                  <>
                    Hide Details
                    <ChevronUp className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    View Details
                    <ChevronDown className="ml-1 h-3 w-3" />
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
                  transition={{ duration: 0.2 }}
                >
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded-md border border-border p-4">
                      <h4 className="font-medium mb-3 text-foreground">
                        Products
                      </h4>
                      <div className="space-y-3">
                        {order.products.map((product, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 pb-3 border-b border-border last:border-b-0"
                          >
                            <img
                              // src={product.image}
                              // alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-foreground">
                                {/* {product.name} */}
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                Size: {product.size}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Quantity: {product.quantity}
                              </p>
                              <p className="text-xs font-medium text-foreground">
                                Price: ${product.priceAtPurchase.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-3" />
                      <h4 className="font-medium mb-2 text-foreground">
                        Shipping Address
                      </h4>
                      <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{order.address.name}</p>
                          <p>{order.address.addressLine1}</p>
                          <p>
                            {order.address.city}, {order.address.state}{" "}
                            {order.address.postalCode}
                          </p>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <h4 className="font-medium mb-2 text-foreground">
                        Payment
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
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
