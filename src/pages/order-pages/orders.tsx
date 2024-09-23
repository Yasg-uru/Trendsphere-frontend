import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  MapPin,
  Calendar,
  RefreshCw,
  ArrowLeftRight,
  Search,
  Filter,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

export default function Orders() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    orderStatus: "",
    paymentStatus: "",
    startDate: undefined,
    endDate: undefined,
    minTotalAmount: undefined,
    maxTotalAmount: undefined,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [dispatch, toast, searchTerm, currentPage]);

  const fetchOrders = () => {
    dispatch(userorders({ ...filters, page: currentPage }))
      .then(() => {
        toast({
          title: "Fetched your order details successfully",
        });
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });
  };

  const { Myorders, isLoading, pagination } = useAppSelector(
    (state) => state.order
  );

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

  const handleFilterChange = (
    key: string,
    value: Date | undefined | string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  console.log("this is a filter data :", filters);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">My Orders</h1>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-xs"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Customize your order view
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="orderStatus">Order Status</Label>
                  <Select
                    value={filters.orderStatus}
                    onValueChange={(value) =>
                      handleFilterChange("orderStatus", value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={filters.paymentStatus}
                    onValueChange={(value) =>
                      handleFilterChange("paymentStatus", value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Start Date</Label>
                  <DatePicker
                    selectedDate={filters.startDate}
                    onSelect={(date: Date | undefined) =>
                      handleFilterChange("startDate", date)
                    }
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>End Date</Label>
                  <DatePicker
                    selectedDate={filters.endDate}
                    onSelect={(date: Date | undefined) =>
                      handleFilterChange("endDate", date)
                    }
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="minAmount">Min Amount</Label>
                  <Input
                    id="minAmount"
                    value={filters.minTotalAmount}
                    onChange={(e) =>
                      handleFilterChange("minTotalAmount", e.target.value)
                    }
                    type="number"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxAmount">Max Amount</Label>
                  <Input
                    id="maxAmount"
                    value={filters.maxTotalAmount}
                    onChange={(e) =>
                      handleFilterChange("maxTotalAmount", e.target.value)
                    }
                    type="number"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

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
                    <ScrollArea className="h-[400px] w-full rounded-md border border-border p-4">
                      <h4 className="font-medium mb-3 text-foreground">
                        Products
                      </h4>
                      <div className="space-y-4">
                        {order.products.map((product, index) => (
                          <div
                            key={index}
                            className="flex flex-col space-y-3 pb-4 border-b border-border last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  product.productId.variants.find(
                                    (v) => v._id === product.variantId
                                  )?.images[0]
                                }
                                alt={product.productId.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-foreground">
                                  {product.productId.name}
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
                            <div className="mt-2">
                              <h6 className="font-medium text-sm mb-2 text-foreground">
                                Refund and Replacement Policy
                              </h6>
                              <div className="space-y-2 text-xs text-muted-foreground">
                                {product.productId.returnPolicy && (
                                  <div className="flex items-start space-x-2">
                                    <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="font-medium">
                                        Refund Policy
                                      </p>
                                      <p>
                                        Eligible:{" "}
                                        {product.productId.returnPolicy.eligible
                                          ? "Yes"
                                          : "No"}
                                      </p>
                                      <p>
                                        Refund Days:{" "}
                                        {
                                          product.productId.returnPolicy
                                            .refundDays
                                        }
                                      </p>
                                      <p>
                                        Terms:{" "}
                                        {product.productId.returnPolicy.terms}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {product.productId.replacementPolicy && (
                                  <div className="flex items-start space-x-2">
                                    <ArrowLeftRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="font-medium">
                                        Replacement Policy
                                      </p>
                                      <p>
                                        Eligible:{" "}
                                        {product.productId.replacementPolicy
                                          .elgible
                                          ? "Yes"
                                          : "No"}
                                      </p>
                                      <p>
                                        Replacement Days:{" "}
                                        {
                                          product.productId.replacementPolicy
                                            .replacementDays
                                        }
                                      </p>
                                      <p>
                                        Terms:{" "}
                                        {
                                          product.productId.replacementPolicy
                                            .terms
                                        }
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
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
                      <Separator className="my-4" />
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

      {pagination && (
        <div className="mt-6 flex justify-between items-center">
          <div>
            Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.totalOrders)}{" "}
            of {pagination.totalOrders} orders
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
