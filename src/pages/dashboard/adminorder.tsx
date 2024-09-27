import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  MapPin,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import {
  IOrder,
  orderproduct,
  OrderProductWithProduct,
} from "@/types/ordertypes/initialState";
import { replace, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import Loader from "@/helper/Loader";
import {
  filtersOrders,
  processReplacement,
  updateOrderStatus,
} from "@/state-manager/slices/orderSlice";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const adminCancellationReasons = [
  "Customer requested cancellation",
  "Fraudulent order",
  "Payment issues",
  "Out of stock",
  "Other",
];
const statusSchema = z.object({
  status: z.enum(["approved", "pending", "rejected"]),
});
type FormData = z.infer<typeof statusSchema>;

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<IOrder | null>(null); // Set the initial value explicitly as `null`
  const { orders } = useAppSelector((state) => state.order);
  const { orderId } = useParams();
  const [orderStatus, setOrderStatus] = useState("pending");
  const [refundStatus, setRefundStatus] = useState<string>("Not Requested");
  const [replacementStatus, setReplacementStatus] =
    useState<string>("Not Requested");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isOrderCancelling, setIsOrderCancelling] = useState<boolean>(false);
  const [isOrderReplacing, setIsOrderReplacing] = useState<boolean>(false);
  const [isOrderReturning, setIsOrderReturning] = useState<boolean>(false);
  const [replaceItems, setReplaceItems] = useState<orderproduct[]>([]);
  const [returnItems, setReturnItems] = useState<orderproduct[]>([]);

  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(statusSchema),
  });
  useEffect(() => {
    if (orderId) {
      const Order = orders.find((order) => order._id === orderId);
      if (Order) {
        setOrder(Order);
        setOrderStatus(Order.orderStatus);
        if (Order.products[0].refund?.requested) {
          setRefundStatus("Requested");
        }
        console.log(
          "this is a order for checking whether variant is exist or not :",
          Order
        );
        if (Order.products[0].replacement?.requested) {
          setReplacementStatus("Requested");
        }
      }
    }
  }, []); // Ensure `orders` is added as a dependency

  if (!order) {
    return <Loader />;
  }

  const handleStatusUpdate = (newStatus: string) => {
    setOrderStatus(newStatus);
    if (newStatus === "cancelled") {
      setIsOrderCancelling(true);
    } else {
      dispatch(updateOrderStatus({ orderId: order._id, status: orderStatus }))
        .then(() => {
          toast({
            title: "status updated successfully",
          });
        })
        .catch((error) => {
          toast({
            title: error,
            variant: "destructive",
          });
        });
    }
  };
  const handleReplacementRequestCheckbox = (
    product: OrderProductWithProduct
  ) => {
    const isAlreadyExist = replaceItems.find(
      (p) =>
        p.productId === product.productId._id && // Using _id for string comparison
        p.variantId === product.variantId
    );

    if (isAlreadyExist) {
      setReplaceItems((prevItems) =>
        prevItems.filter(
          (p) =>
            p.productId !== product.productId._id && // Fix the filter condition
            p.variantId !== product.variantId
        )
      );
    } else {
      setReplaceItems((prevItems) => [
        ...prevItems,
        {
          productId: product.productId._id, // Extract _id from IProductFrontend
          variantId: product.variantId,
          quantity: product.quantity,
          size: product.size,
          priceAtPurchase: product.priceAtPurchase,
          discount: product.discount,
          discountByCoupon: product.discountByCoupon,
          isReplaceable: product.isReplaceable,
          isReturnable: product.isReturnable,
          refund: {
            requested: product.refund?.requested ?? false, // Provide default value
            amount: product.refund?.amount ?? 0,
            status: product.refund?.status ?? "pending",
            requestDate: product.refund?.requestDate,
            completionDate: product.refund?.completionDate,
          },
          replacement: {
            requested: product.replacement?.requested ?? false, // Provide default value
            reason: product.replacement?.reason ?? "",
            status: product.replacement?.status ?? "pending",
            requestDate: product.replacement?.requestDate,
            responseDate: product.replacement?.responseDate,
          },
        },
      ]);
    }
  };

  const handleCancel = () => {
    const finalReason =
      selectedReason === "Other" ? otherReason : selectedReason;
    //after this we need to dispatch the cancel order
    dispatch(
      updateOrderStatus({
        orderId: order._id,
        status: orderStatus,
        cancelReason: finalReason,
      })
    )
      .then(() => {
        toast({
          title: "cancelled order successfully",
        });
      })
      .catch((error) => {
        toast({
          title: error,
          variant: "destructive",
        });
      });
    setIsOrderCancelling(false);
  };
  const handleReplaceItems = (data: FormData) => {
    const formdata = {
      orderId: order._id,
      replacementItems: replaceItems,
      status: data.status,
    };
    console.log("this is replacement items :", formdata);
    dispatch(processReplacement(formdata))
      .then(() => {
        toast({
          title: "replacement items status updated successfully",
        });
      })
      .catch((error) => {
        toast({
          title: error,
          variant: "destructive",
        });
      });
  };
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Button variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Order {order.payment.paymentId}
          </CardTitle>
          <Badge
            variant={orderStatus === "completed" ? "outline" : "secondary"}
          >
            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <Select
              onValueChange={handleStatusUpdate}
              defaultValue={orderStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="replaced">Replaced</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          {order.products.map((product, index) => (
            <div key={index} className="flex items-start space-x-4 py-4">
              <img
                src={product.productId.defaultImage}
                alt={product.productId.name}
                width={100}
                height={100}
                className="rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{product.productId.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Size: {product.size}
                </p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {product.quantity}
                </p>
                <p className="text-sm text-muted-foreground">
                  Price: ${product.priceAtPurchase.toFixed(2)}
                </p>
                {product.discount > 0 && (
                  <p className="text-sm text-green-600">
                    Discount: ${product.discount.toFixed(2)}
                  </p>
                )}
                {product.discountByCoupon > 0 && (
                  <p className="text-sm text-green-600">
                    Coupon Discount: ${product.discountByCoupon.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Badge
                  variant={product.isReplaceable ? "secondary" : "outline"}
                >
                  {product.isReplaceable ? "Replaceable" : "Non-replaceable"}
                </Badge>
                <Badge variant={product.isReturnable ? "secondary" : "outline"}>
                  {product.isReturnable ? "Returnable" : "Non-returnable"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 mt-1" />
              <div>
                <p className="font-semibold">{order.address.name}</p>
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
                <p className="mt-2 text-sm text-muted-foreground">
                  Address Type: {order.address.type}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <p>
                  <strong>Payment ID:</strong> {order.payment.paymentId}
                </p>
              </div>
              <p>
                <strong>Provider:</strong> {order.payment.provider}
              </p>
              <p>
                <strong>Method:</strong> {order.payment.paymentMethod}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  order.payment.paymentDate as unknown as string
                ).toLocaleDateString()}
              </p>
              <Badge
                variant={
                  order.payment.paymentStatus === "completed"
                    ? "outline"
                    : "secondary"
                }
              >
                {order.payment.paymentStatus.charAt(0).toUpperCase() +
                  order.payment.paymentStatus.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-${order.finalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${order?.taxAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge:</span>
            <span>${order?.deliveryCharge?.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${order.finalAmount.toFixed(2)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Coupon Applied: {order.couponCode}</p>
            <p>Loyalty Points Used: {order.loyaltyPointsUsed}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Replacement Requestes</CardTitle>
        </CardHeader>
        <CardContent>
          {order.products.map(
            (product, index) =>
              product.replacement?.requested && (
                <div key={index} className="flex items-start space-x-4 py-4">
                  <Checkbox
                    checked={replaceItems.some(
                      (p) =>
                        p.productId === product.productId._id &&
                        p.variantId === product.variantId
                    )}
                    onCheckedChange={() =>
                      handleReplacementRequestCheckbox(product)
                    }
                  />
                  <img
                    src={product.productId.defaultImage}
                    alt={product.productId.name}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.productId.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Size: {product.size}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Price: ${product.priceAtPurchase.toFixed(2)}
                    </p>
                    {product.discount > 0 && (
                      <p className="text-sm text-green-600">
                        Discount: ${product.discount.toFixed(2)}
                      </p>
                    )}
                    {product.discountByCoupon > 0 && (
                      <p className="text-sm text-green-600">
                        Coupon Discount: ${product.discountByCoupon.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Badge
                      variant={product.isReplaceable ? "secondary" : "outline"}
                    >
                      {product.isReplaceable
                        ? "Replaceable"
                        : "Non-replaceable"}
                    </Badge>
                    <Badge
                      variant={product.isReturnable ? "secondary" : "outline"}
                    >
                      {product.isReturnable ? "Returnable" : "Non-returnable"}
                    </Badge>
                  </div>
                </div>
              )
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className={replaceItems.length === 0 ? `opacity-50` : "opacity-100"} // Reduced opacity when disabled
            disabled={replaceItems.length === 0} // Button is disabled when no items to replace
            onClick={() => setIsOrderReplacing(true)}
          >
            Replace
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Return Requestes</CardTitle>
        </CardHeader>
        <CardContent>
          {order.products.map(
            (product, index) =>
              product.refund?.requested && (
                <div key={index} className="flex items-start space-x-4 py-4">
                  <img
                    src={product.productId.defaultImage}
                    alt={product.productId.name}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.productId.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Size: {product.size}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Price: ${product.priceAtPurchase.toFixed(2)}
                    </p>
                    {product.discount > 0 && (
                      <p className="text-sm text-green-600">
                        Discount: ${product.discount.toFixed(2)}
                      </p>
                    )}
                    {product.discountByCoupon > 0 && (
                      <p className="text-sm text-green-600">
                        Coupon Discount: ${product.discountByCoupon.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Badge
                      variant={product.isReplaceable ? "secondary" : "outline"}
                    >
                      {product.isReplaceable
                        ? "Replaceable"
                        : "Non-replaceable"}
                    </Badge>
                    <Badge
                      variant={product.isReturnable ? "secondary" : "outline"}
                    >
                      {product.isReturnable ? "Returnable" : "Non-returnable"}
                    </Badge>
                  </div>
                </div>
              )
          )}
        </CardContent>
        <CardFooter>
          <Button variant={"outline"}>Return</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.auditLog.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                {index === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-semibold">{log.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isOrderCancelling} onOpenChange={setIsOrderCancelling}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Admin Order Cancellation</DialogTitle>
            <DialogDescription>
              Please select a reason for cancelling order #{orderId}. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Admin reason selection */}
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
            >
              {adminCancellationReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason}>{reason}</Label>
                </div>
              ))}
            </RadioGroup>
            {/* Conditional rendering for 'Other' reason input */}
            {selectedReason === "Other" && (
              <div className="grid w-full gap-1.5">
                <Label htmlFor="other-reason">Please specify:</Label>
                <Textarea
                  id="other-reason"
                  placeholder="Enter your reason here"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOrderCancelling(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={
                !selectedReason ||
                (selectedReason === "Other" && !otherReason.trim())
              }
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isOrderReplacing} onOpenChange={setIsOrderReplacing}>
        <DialogTrigger asChild>
          <Button variant="outline">Select Status</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
            <DialogDescription>
              Select a status for the user. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleReplaceItems)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">
                  <RadioGroup {...register("status")} defaultValue="pending">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="approved" id="approved" />
                      <Label htmlFor="approved">Approved</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="pending" />
                      <Label htmlFor="pending">Pending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rejected" id="rejected" />
                      <Label htmlFor="rejected">Rejected</Label>
                    </div>
                  </RadioGroup>

                  {errors.status && (
                    <p className="text-red-500 text-sm mt-2 italic">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
