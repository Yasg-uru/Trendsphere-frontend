import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { IOrder } from "@/types/ordertypes/initialState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Package,
  Truck,
  CreditCard,
  Gift,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cancelorder, userorders } from "@/state-manager/slices/orderSlice";
import Loader from "@/helper/Loader";

export default function OrderDetail() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { Myorders, isLoading } = useAppSelector((state) => state.order);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isOrderCanceling, setIsOrderCanceling] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const { orderId } = useParams();

  useEffect(() => {
    if (Myorders.length > 0 && orderId) {
      const CurrentOrder = Myorders.find((order) => order._id === orderId);
      if (CurrentOrder) {
        setOrder(CurrentOrder);
      }
    }
  }, [Myorders, orderId]);
useEffect(()=>{
    dispatch(userorders({}));
},[dispatch])
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading order details...</p>
      </div>
    );
  }
  const handleCancel = () => {
    dispatch(cancelorder({ OrderId: order._id, cancelReason: reason }))
      .then(() => {
        toast({
          title: "Order canceled successfully",
        });
        
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">
                Order #{order._id}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Placed on {formatDate(order.createdAt)}
              </CardDescription>
            </div>
            <Badge
              className={`${getStatusColor(
                order.orderStatus
              )} text-white px-3 py-1 rounded-full`}
            >
              {order.orderStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <CreditCard className="mr-2" size={20} /> Payment
                    Information
                  </h3>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {order.payment.paymentMethod}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>{" "}
                      {order.payment.paymentStatus}
                    </p>
                    <p>
                      <strong>Payment Date:</strong>{" "}
                      {formatDate(order.payment.paymentDate || new Date())}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Package className="mr-2" size={20} /> Order Summary
                  </h3>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p>Total Amount: {formatCurrency(order.totalAmount)}</p>
                    <p>Discount: {formatCurrency(order.discountAmount || 0)}</p>
                    <p>Tax: {formatCurrency(order.taxAmount || 0)}</p>
                    <p>
                      Delivery Charge:{" "}
                      {formatCurrency(order.deliveryCharge || 0)}
                    </p>
                    <Separator className="my-2" />
                    <p className="font-semibold text-lg">
                      Final Amount: {formatCurrency(order.finalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="products">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products.map((product) => (
                      <TableRow
                        key={`${product.productId}-${product.variantId}`}
                      >
                        <TableCell className="font-medium">
                          {product.productId.name}
                        </TableCell>
                        <TableCell>{product.size}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          {formatCurrency(product.priceAtPurchase)}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Replace
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="shipping">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Truck className="mr-2" size={20} /> Shipping Address
                  </h3>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p>{order.address.name}</p>
                    <p>{order.address.addressLine1}</p>
                    {order.address.addressLine2 && (
                      <p>{order.address.addressLine2}</p>
                    )}
                    <p>
                      {order.address.city}, {order.address.state}{" "}
                      {order.address.postalCode}
                    </p>
                    <p>{order.address.country}</p>
                    <p>Phone: {order.address.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Gift className="mr-2" size={20} /> Gift Information
                  </h3>
                  {order.isGiftOrder ? (
                    <div className="bg-secondary p-4 rounded-lg">
                      <p>
                        <strong>Gift Message:</strong>
                      </p>
                      <p className="italic">"{order.giftMessage}"</p>
                    </div>
                  ) : (
                    <p>This is not a gift order.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="audit">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ClipboardList className="mr-2" size={20} /> Audit Logs
                </h3>
                <ScrollArea className="h-[400px] rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.auditLog.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.actor.toString()}</TableCell>
                          <TableCell>{formatDate(log.timestamp)}</TableCell>
                          <TableCell>{log.description || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-4">
          <Button
            variant="outline"
            disabled={
              order.orderStatus === "cancelled" ||
              order.orderStatus === "returned"
            }
          >
            Refund
          </Button>
          <Button
            variant="destructive"
            disabled={
              order.orderStatus === "cancelled" ||
              order.orderStatus === "returned"
            }
            onClick={() => setIsOrderCanceling(true)}
          >
            Cancel Order
          </Button>
        </CardFooter>
      </Card>

      {isOrderCanceling && (
        <Dialog open={isOrderCanceling} onOpenChange={setIsOrderCanceling}>
          <DialogTrigger asChild>
            <Button variant="destructive">Cancel Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="orderId" className="text-right">
                  Order ID
                </Label>
                <Input
                  id="orderId"
                  value={orderId}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation"
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            {reason.trim() === "" && (
              <div className="flex items-center space-x-2 text-sm text-destructive">
                <AlertCircle size={16} />
                <span>Please provide a reason for cancellation</span>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOrderCanceling(false)}
              >
                Keep Order
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
                disabled={reason.trim() === ""}
              >
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
