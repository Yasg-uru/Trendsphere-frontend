 /* eslint-disable */ 
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {  SiRazorpay } from "react-icons/si";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  // CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  // Check,
  // ChevronDown,
  Edit2,
  MapPin,
  Plus,
  ShieldCheck,
  Truck,
  // CreditCard,
  DollarSign,
  ShoppingBag,
  Percent,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import {
 
  useLocation,
  useNavigate,
} from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { AddnewAddress, UpdateAddress } from "@/state-manager/slices/authSlice";
import Loader from "@/helper/Loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  orderDataType,
  selectProductsForOrder,
} from "@/types/ordertypes/initialState";
// import { IProductFrontend } from "@/types/productState/product.type";
import { createOrder, verifyOrder } from "@/state-manager/slices/orderSlice";
import { getProductByIds } from "@/state-manager/slices/productSlice";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  addressLine1: z
    .string()
    .min(5, { message: "Address Line 1 must be at least 5 characters." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  postalCode: z
    .string()
    .min(5, { message: "Postal Code must be at least 5 characters." }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." }),
  type: z.enum(["Home", "University", "Work", "Hotel"], {
    message: "Invalid address type",
  }),
});
export type ChangeAddressForm = z.infer<typeof formSchema>;
export interface orderDetails {
  quantity: number;
  variantInfo: string;
  firstImage: string;
  price: number;
}
export default function CreateOrder() {
  const { userInfo, isLoading } = useAppSelector((state) => state.auth);
  const [selectedAddress, setSelectedAddress] = useState(
    userInfo?.address[0]?._id || ""
  );
  const { orderinfo } = useAppSelector((state) => state.order);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setIsEditingAddress] = useState<any>(null);
  const [orderData, setOrderData] = useState<orderDataType | null>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const location = useLocation();
  const { productsByIds } = useAppSelector((state) => state.product);
  const ProductsLoading = useAppSelector((state) => state.product.isLoading);
  const { selectedProductIds, selectedProducts } = location.state;

  const [orderSummaryDetails, setOrderSummayDetails] = useState<orderDetails[]>(
    []
  );
  const [couponCode] = useState<string>("");
  const [TotalPrice, SetTotalPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  // const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(true);
  console.log(
    "this is a vlaue of the selected address after change ",
    selectedAddress
  );
  console.log("this is a selected ids array :", selectedProductIds);
  const handleCreateOrder = () => {
    console.log(
      "This is the order data inside the handleCreateOrder function:",
      orderData
    );

    if (orderData) {
      dispatch(createOrder(orderData))
        .then(() => {
          toast({
            title: "Order created successfully",
          });
        })
        .catch((error) => {
          toast({
            title: error,
            variant: "destructive",
          });
          return;
        });
    }
  };
  useEffect(() => {
    const paymentVerify = () => {
      if (orderinfo) {
        const options = {
          // key: "rzp_live_tK7jKIBkQuTeH7", // Enter the Key ID generated from the Dashboard
          key: "rzp_test_7dU2Zk3usqjmRX", // Enter the Key ID generated from the Dashboard
          amount: orderinfo.finalAmount,
          currency: "INR",
          name: "Trendsphere",
          description: "Trendsphere product payment",
          image:
            "https://res.cloudinary.com/duzmyzmpa/image/upload/v1721313988/x9nno0siixwdva4beymy.jpg",
          order_id: orderinfo.payment.paymentId,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            console.log(
              "this is a response of the razorpay payment order and signature for postman testing ",
              response
            );
            const data = {
              orderCreationId: orderinfo.payment.paymentId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            // Dispatch the verifyOrder action after payment is completed
            dispatch(verifyOrder(data))
              .then(() => {
                toast({
                  title: "Your payment verified successfully",
                });
              })
              .catch((error) => {
                toast({
                  title: error,
                  variant: "destructive",
                });
              });
          },
        };

        // Open Razorpay payment gateway
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        toast({
          title: "All the order info is required",
        });
      }
    };

    // Invoke the paymentVerify function when orderinfo changes
    if (orderinfo) {
      paymentVerify();
    }
  }, [orderinfo]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    if (selectedProductIds.length > 0) {
      setIsLoadingProducts(true);
      dispatch(getProductByIds(selectedProductIds))
        .then(() => {
          toast({
            title: "Fetched all the information of the products by their ids",
          });
          console.log(
            "this is selected products ids for testing because price is not calculatinf  :",
            productsByIds
          );
        })
        .catch((error) => {
          toast({
            title: error,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoadingProducts(false);
        });
    }
  }, [selectedProductIds]);

  // useEffect(() => {
  //   if (selectedProductIds && Array.isArray(selectedProductIds)) {
  //     const selectedProductDetails = selectedProductIds.map((selected:selectProductsForOrder)=>{
  //       const product=productsByIds.find(product=>product._id===selected.productId);
  //       if(product){
  //         const variant=product.variants.find(v=>v._id===selected.variantId);

  //       }
  //     })
  //   }
  //   const Product = products.find((p) => p._id === selectedProductId);
  //   if (Product) {
  //     setProduct(Product);
  //     calculatePrice();
  //     const address = userInfo?.address.find(
  //       (address) => address._id === selectedAddress
  //     );
  //     if (address) {
  //       setOrderData({
  //         products: selectedProducts,
  //         address,
  //         couponCode,
  //         loyaltyPointsUsed: 0,
  //         isGiftOrder: false,
  //         giftMessage: "",
  //         deliveryType: expressDelivery ? "express" : "standard",
  //       });
  //       console.log("this is a order data :", orderData);
  //     }
  //   }
  // }, [expressDelivery, selectedProducts, product, selectedAddress]);
  useEffect(() => {
    if (selectedProducts.length > 0) {
      calculatePrice();
      const address = userInfo?.address.find(
        (address) => address._id === selectedAddress
      );
      if (address) {
        setOrderData({
          products: selectedProducts,
          address,
          couponCode,
          loyaltyPointsUsed: 0,
          isGiftOrder: false,
          giftMessage: "",
          deliveryType: expressDelivery ? "express" : "standard",
        });
      }
    }
  }, [expressDelivery, selectedProducts, selectedAddress]);
  const calculatePrice = () => {
    let discount = 0;
    let totalPrice = 0;
    console.log("this is selected products :", selectedProducts);
    selectedProducts.forEach((product: selectProductsForOrder) => {
      discount += product.discount * product.quantity;
      totalPrice += product.priceAtPurchase * product.quantity;
    });
    if (expressDelivery) {
      setFinalPrice(totalPrice - discount + 10);
    } else {
      setFinalPrice(totalPrice - discount);
    }
    SetTotalPrice(totalPrice);
    setDiscountPrice(discount);
    // console.log("this is a discount price after calculation :",discount)
    console.log("this is a total price after calculation :", totalPrice);
    console.log("this is a final price after calculation :", discount);
  };

  const onSubmit = (data: ChangeAddressForm) => {
    console.log("this is a new address data :", data);

    if (editingAddress) {
      dispatch(UpdateAddress({ addressId: editingAddress._id, data }))
        .then(() => {
          toast({
            title: "Successfully updated your address",
          });
          setIsEditingAddress(null);
        })
        .catch((error) => {
          toast({
            title: error,
          });
        });
    } else {
      dispatch(AddnewAddress(data))
        .then(() => {
          toast({
            title: "successfully added new address",
          });
          setIsModalOpen(false);
        })
        .catch((error) => {
          toast({
            title: error,
            variant: "destructive",
          });
        });
    }
  };
  const handleEditAddress = (address: ChangeAddressForm) => {
    setIsEditingAddress(address);
    form.reset(address);
    setIsModalOpen(true);
  };

  

  // const totalPrice = items.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // );

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // my implementation
  const form = useForm<ChangeAddressForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      type: "Home",
    },
  });

  useEffect(() => {
    const GetSelectedVariantinfo = () => {
      const orderSummary = selectedProducts.map(
        (selected: selectProductsForOrder) => {
          const product = productsByIds.find(
            (product) => product._id === selected.productId
          );
          if (product) {
            const variant = product.variants.find(
              (variant) => variant._id === selected.variantId
            );
            if (variant) {
              const variantInfo = `${variant.color} - ${variant.material} -
                          ${variant.size[0].size}`;
              return {
                variantInfo,
                quantity: selected.quantity,
                firstImage: variant.images[0],
                price: variant.price,
              };
            }
          }
        }
      );
      setOrderSummayDetails(orderSummary);
      console.log("this is a order summary :", orderSummary);
    };
    GetSelectedVariantinfo();
  }, []);
  const navigate = useNavigate();
  if (isLoading || ProductsLoading || isLoadingProducts) {
    return <Loader />;
  }
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Trendsphere Checkout
      </h1>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step}
              </div>
              <span className="text-sm mt-2">
                {["Login", "Address", "Delivery", "Payment"][step - 1]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep - 1) * 33.33}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className={currentStep === 1 ? "" : "opacity-50"}>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-xl font-bold">1. LOGIN</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{userInfo?.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {userInfo?.isVerified ? "Verified" : "Un Verified"}
                  </Badge>
                </div>
                <Button variant="outline" onClick={() => navigate("/Sign-in")}>
                  CHANGE
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={currentStep === 2 ? "" : "opacity-50"}>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-xl font-bold">
                2. DELIVERY ADDRESS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup
                value={selectedAddress}
                onValueChange={setSelectedAddress}
              >
                {userInfo?.address.map((address, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 mb-4 p-4 border rounded-lg hover:border-primary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroupItem value={address._id} id={address._id} />
                    <Label
                      htmlFor={address._id}
                      className="flex-grow cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {address.name} <Badge>{address.type}</Badge>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {`${address.addressLine1}, ${
                              address.addressLine2
                                ? address.addressLine2 + ", "
                                : ""
                            }${address.city}, ${address.state} ${
                              address.postalCode
                            }, ${address.country}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> ADD NEW ADDRESS
              </Button>
            </CardContent>
          </Card>

          <Card className={currentStep === 3 ? "" : "opacity-50"}>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-xl font-bold">
                3. DELIVERY OPTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Standard Delivery</span>
                </div>
                <Badge variant="secondary">FREE</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={expressDelivery}
                    onCheckedChange={setExpressDelivery}
                    id="express-delivery"
                  />
                  <Label htmlFor="express-delivery">
                    Express Delivery (+$10)
                  </Label>
                </div>
                <Badge variant="secondary">1-2 DAYS</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className={currentStep === 4 ? "" : "opacity-50"}>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-xl font-bold">
                4. PAYMENT OPTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="razorpay" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="razorpay">Pay Via Razorpay</TabsTrigger>

                  <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
                </TabsList>
                <TabsContent value="razorpay">
                  <Card>
                    <CardHeader>
                      <CardTitle>Razorpay</CardTitle>
                      <CardDescription>Pay using your Razorpay</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full" onClick={handleCreateOrder}>
                        <SiRazorpay className="mr-2 h-4 w-4" />
                        Pay with Razorpay
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* <TabsContent value="paypal">
                  <Card>
                    <CardHeader>
                      <CardTitle>PayPal</CardTitle>
                      <CardDescription>
                        Pay using your PayPal account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full">
                        
                        Pay with PayPal
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent> */}
                <TabsContent value="cash">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cash on Delivery</CardTitle>
                      <CardDescription>
                        Pay when your order is delivered
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground mb-4">
                        You'll pay for your order when it's delivered to your
                        address.
                      </p>
                      <Button className="w-full">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Confirm Cash on Delivery
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button onClick={handlePrevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={handleNextStep} disabled={currentStep === 4}>
              Next
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                ORDER SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {orderSummaryDetails.map((item, index) => (
                  <Card
                    key={index}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <img
                      src={item?.firstImage || ""}
                      alt=""
                      width={64}
                      height={64}
                      className="rounded-md"
                      style={{ aspectRatio: "64/64", objectFit: "cover" }}
                    />
                    <div className="flex-1 grid gap-1">
                      <div className="font-medium">{item?.variantInfo}</div>
                      <div className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                PRICE DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price ({selectedProducts.length} items)</span>
                  <span>${TotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    - ${discountPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={expressDelivery ? "" : "text-green-600"}>
                    {expressDelivery ? `$${10}` : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total Amount</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-green-600 font-semibold mt-4">
                You will save ${discountPrice.toFixed(2)} on this order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Delivery to:</p>
                  <p className="text-sm text-muted-foreground">
                    {`${
                      userInfo?.address.find((a) => a._id === selectedAddress)
                        ?.addressLine1
                    }, ${
                      userInfo?.address.find((a) => a._id === selectedAddress)
                        ?.addressLine2
                        ? userInfo?.address.find(
                            (a) => a._id === selectedAddress
                          )?.addressLine2 + ", "
                        : ""
                    }${
                      userInfo?.address.find((a) => a._id === selectedAddress)
                        ?.city
                    }, ${
                      userInfo?.address.find((a) => a._id === selectedAddress)
                        ?.state
                    } ${
                      userInfo?.address.find((a) => a._id === selectedAddress)
                        ?.postalCode
                    }, ${
                      userInfo?.address.find((a) => a._id === selectedAddress)
                        ?.country
                    }`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-primary/10 p-4 rounded-lg flex items-center space-x-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Safe and Secure Payments</p>
              <p className="text-sm text-muted-foreground">
                100% Authentic products
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-code">Promo Code</Label>
            <div className="flex space-x-2">
              <Input id="promo-code" placeholder="Enter promo code" />
              <Button>~</Button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-background p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Address</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white text-black">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-sm font-semibold italic text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white text-black">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage className="text-sm font-semibold italic text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white text-black">
                        Address Line 1
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-sm font-semibold italic text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white text-black">
                        Address Line 2 (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-sm font-semibold italic text-red-600" />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white text-black">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-sm font-semibold italic text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white text-black">
                          State
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-sm font-semibold italic text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white text-black">
                          Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-sm font-semibold italic text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white text-black">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-sm font-semibold italic text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-white text-black">
                        Address Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an address type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Address Types</SelectLabel>
                            <SelectItem value="Home">Home</SelectItem>
                            <SelectItem value="University">
                              University
                            </SelectItem>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Hotel">Hotel</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-sm font-semibold italic text-red-600" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2 mt-6">
                  <Button type="submit">Save Address</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
