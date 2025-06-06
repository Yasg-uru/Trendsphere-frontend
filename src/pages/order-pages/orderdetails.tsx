import  { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { IOrder, RefundOrders } from "@/types/ordertypes/initialState";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  cancelorder,
  refundOrder,
  replaceorders,
  userorders,
} from "@/state-manager/slices/orderSlice";
import Loader from "@/helper/Loader";
// import { title } from "process";
import { Checkbox } from "@/components/ui/checkbox";
// import { JSX } from "react/jsx-runtime";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const replacementSchema = z.object({
  items: z.array(z.string()).min(1, "Select at least one item for replacement"),
  reason: z.string().min(10, "Reason must be at least 10 characters long"),
});

type ReplacementFormValues = z.infer<typeof replacementSchema>;
export default function OrderDetail() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { Myorders, isLoading } = useAppSelector((state) => state.order);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [refundItems, setRefundItems] = useState<RefundOrders[]>([]);
  const [replacementItems, setReplacementItems] = useState<RefundOrders[]>([]);
  const [isReplacing, setIsReplacing] = useState<boolean>(false);

  const [isOrderCanceling, setIsOrderCanceling] = useState<boolean>(false);
  const [isRefunding, setIsRefunding] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  // const role = "";
  const { orderId } = useParams();
  const form = useForm<ReplacementFormValues>({
    resolver: zodResolver(replacementSchema),
    defaultValues: {
      items: [],
      reason: "",
    },
  });
  useEffect(() => {
    if (Myorders.length > 0 && orderId) {
      const CurrentOrder = Myorders.find((order) => order._id === orderId);
      if (CurrentOrder) {
        setOrder(CurrentOrder);
      }
    }
  }, [Myorders, orderId]);

  useEffect(() => {
    dispatch(userorders({}));
  }, []);

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
        dispatch(userorders({}));
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });
  };
  const handleRefundCheckBox = (productId: string, variantId: string) => {
    const isAlreadyExist = refundItems.find(
      (product) =>
        product.productId === productId && product.variantId === variantId
    );
    if (isAlreadyExist) {
      setRefundItems((prevItems) =>
        prevItems.filter(
          (product) =>
            product.productId !== productId && product.variantId !== variantId
        )
      );
    } else {
      const item = order.products.find(
        (product) =>
          product.productId._id === productId && product.variantId === variantId
      );
      if (item) {
        setRefundItems((prevItems) => [
          ...prevItems,
          { ...item, productId: item.productId._id },
        ]);
      }
    }
  };
  const handleReplacementCheckbox = (productId: string, variantId: string) => {
    const isAlreadyExist = replacementItems.find(
      (item) => item.productId === productId && item.variantId === variantId
    );
    if (isAlreadyExist) {
      setReplacementItems((prevItems) =>
        prevItems.filter(
          (item) => item.productId === productId && item.variantId === variantId
        )
      );
    } else {
      const Item = order.products.find(
        (product) =>
          product.productId._id === productId && variantId === variantId
      );
      if (Item) {
        setReplacementItems((prevItems) => [
          ...prevItems,
          { ...Item, productId: Item.productId._id },
        ]);
      }
    }
  };

  const handleOrderRefund = () => {
    dispatch(refundOrder({ orderId: order._id, returnItems: refundItems }))
      .then(() => {
        toast({
          title: "Refunded successfully",
        });
        dispatch(userorders({}));
        setIsRefunding(false);
      })
      .catch((error) => {
        toast({
          title: error,
          variant: "destructive",
        });
      });
  };
  console.log("this is a data of the refund selected items :", refundItems);
  const onReplacementSubmit = (data: ReplacementFormValues) => {
    const replacementItems = order.products.filter((product) =>
      data.items.includes(`${product.productId._id}-${product.variantId}`)
    );

    const replaceRequestData = {
      orderId: order._id,
      replaceItems: replacementItems.map((item) => ({
        ...item,
        productId: item.productId._id,
      })),
      reason: data.reason,
    };
    // console.log(
    //   "this is a replacement request data  for validation to check whether the data is correct or not :",
    //   data
    // );
    // console.log("this is a replacement items ", replaceRequestData);

    dispatch(replaceorders(replaceRequestData))
      .then(() => {
        toast({
          title: "Replacement request created successfully",
        });
        setIsReplacing(false);
        form.reset();
      })
      .catch((error) => {
        toast({
          title: error,
          variant: "destructive",
        });
      });
  };
  // const processReplaceRequest = () => {
    // dispatch(processReplacement())
    //   .then(() => {
    //     toast({
    //       title: `${status} updated on order successfully`,
    //     });
    //   })
    //   .catch((error) => {
    //     toast({
    //       title: error,
    //       variant: "destructive",
    //     });
    //   });
  // };
  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-xl sm:text-3xl font-bold break-all">
                Order #{order._id}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Placed on {formatDate(order.createdAt)}
              </CardDescription>
            </div>
            <Badge
              className={`${getStatusColor(
                order.orderStatus
              )} text-white px-3 py-1 rounded-full mt-2 sm:mt-0`}
            >
              {order.orderStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <CreditCard className="mr-2" size={20} /> Payment
                  </h3>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Method:</strong> {order.payment.paymentMethod}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong> {order.payment.paymentStatus}
                    </p>
                    <p className="text-sm">
                      <strong>Date:</strong>{" "}
                      {formatDate(order.payment.paymentDate || new Date())}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Package className="mr-2" size={20} /> Summary
                  </h3>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm">
                      Total: {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-sm">
                      Discount: {formatCurrency(order.discountAmount || 0)}
                    </p>
                    <p className="text-sm">
                      Tax: {formatCurrency(order.taxAmount || 0)}
                    </p>
                    <p className="text-sm">
                      Delivery: {formatCurrency(order.deliveryCharge || 0)}
                    </p>
                    <Separator className="my-2" />
                    <p className="font-semibold text-base">
                      Final: {formatCurrency(order.finalAmount)}
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
                      <TableHead className="w-[140px]">Product</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Qty</TableHead>
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
                          {product.isReplaceable && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={order.orderStatus !== "delivered"}
                              className={`transition-opacity ${
                                order.orderStatus !== "delivered"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Replace
                            </Button>
                          )}
                          {product.isReturnable && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={order.orderStatus !== "delivered"}
                              className={`transition-opacity ${
                                order.orderStatus !== "delivered"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Return
                            </Button>
                          )}
                          {
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigate(`/review/${product.productId._id}`);
                              }}
                              disabled={order.orderStatus !== "delivered"}
                              className={`transition-opacity ${
                                order.orderStatus !== "delivered"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              } bg-green-600`}
                            >
                              ADD REVIEW
                            </Button>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="shipping">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Truck className="mr-2" size={20} /> Shipping Address
                  </h3>
                  <div className="bg-secondary p-4 rounded-lg text-sm">
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
                    <div className="bg-secondary p-4 rounded-lg text-sm">
                      <p>
                        <strong>Gift Message:</strong>
                      </p>
                      <p className="italic">"{order.giftMessage}"</p>
                    </div>
                  ) : (
                    <p className="text-sm">This is not a gift order.</p>
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
                          <TableCell className="text-sm">
                            {log.action}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.actor.toString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(log.timestamp)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.description || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 border-t pt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            // disabled={
            //   order.orderStatus === "cancelled" ||
            //   order.orderStatus === "returned" ||
            //   order.orderStatus === "processing" ||
            //   order.orderStatus === "pending" ||
            //   order.payment.paymentStatus === "refunded"
            // }
            onClick={() => setIsReplacing(true)}
          >
            Replace
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            disabled={
              order.orderStatus === "cancelled" ||
              order.orderStatus === "returned" ||
              order.orderStatus === "processing" ||
              order.orderStatus === "pending" ||
              order.payment.paymentStatus === "refunded"
            }
            onClick={() => setIsRefunding(true)}
          >
            Refund
          </Button>

          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            disabled={
              order.orderStatus === "cancelled" ||
              order.orderStatus === "returned" ||
              order.orderStatus === "delivered" ||
              order.orderStatus === "shipped"
            }
            onClick={() => setIsOrderCanceling(true)}
          >
            Cancel Order
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOrderCanceling} onOpenChange={setIsOrderCanceling}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
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
              className="w-full sm:w-auto"
            >
              Keep Order
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
              disabled={reason.trim() === ""}
              className="w-full sm:w-auto"
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRefunding} onOpenChange={setIsRefunding}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Select Items for Refund</h2>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-muted/20 px-4 py-3 rounded-md">
                <div className="font-medium">Product ID</div>
                <div className="font-medium">Variant / Size / Qty / Price</div>
                <div className="font-medium">Refund</div>
              </div>
              {order.products.map((product, index) => {
                return (
                  product.isReturnable && (
                    <div
                      key={index}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-muted/10 px-4 py-3 rounded-md shadow-lg"
                    >
                      <div>{product.productId._id}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <img
                            width={50}
                            height={50}
                            className="rounded-md"
                            src={
                              product.productId.variants.find(
                                (variant) => variant._id === product.variantId
                              )?.images[0] || ""
                            }
                            alt=""
                          />
                          <div>Size: {product.size}</div>
                          <div>Qty: {product.quantity}</div>
                          <div>Price: ${product.priceAtPurchase}</div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div>Discount: ${product.discount}</div>
                          <div>Coupon: ${product.discountByCoupon}</div>
                        </div>
                      </div>
                      <div>
                        <Checkbox
                          checked={refundItems.some(
                            (item) =>
                              item.productId === product.productId._id &&
                              item.variantId === product.variantId
                          )}
                          onCheckedChange={() =>
                            handleRefundCheckBox(
                              product.productId._id,
                              product.variantId
                            )
                          }
                        />
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
          <DialogFooter className="justify-end">
            <Button type="submit" onClick={handleOrderRefund}>
              Submit Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isReplacing} onOpenChange={setIsReplacing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Replacement</DialogTitle>
            <DialogDescription>
              Select the items you want to replace and provide a reason.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onReplacementSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Replaceable Items
                      </FormLabel>
                      <FormDescription>
                        Select the items you want to replace.
                      </FormDescription>
                    </div>
                    {order.products.map(
                      (product) =>
                        product.isReplaceable && (
                          <FormField
                            key={`${product.productId._id}-${product.variantId}`}
                            control={form.control}
                            name="items"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={`${product.productId._id}-${product.variantId}`}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        `${product.productId._id}-${product.variantId}`
                                      )}
                                      onCheckedChange={(checked) => {
                                        handleReplacementCheckbox(
                                          product.productId._id,
                                          product.variantId
                                        );
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              `${product.productId._id}-${product.variantId}`,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value: string) =>
                                                  value !==
                                                  `${product.productId._id}-${product.variantId}`
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {product.productId.name} - {product.size} -
                                    ${product.priceAtPurchase}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        )
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Replacement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a reason for the replacement request"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain why you're requesting a replacement for the
                      selected items.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Submit Replacement Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
