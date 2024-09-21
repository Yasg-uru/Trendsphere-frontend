import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SiRazorpay } from "react-icons/si";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronDown,
  Edit2,
  MapPin,
  Plus,
  ShieldCheck,
  Truck,
  CreditCard,
  DollarSign,
  ShoppingBag,
  Percent,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { useNavigate } from "react-router-dom";
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
export default function CreateOrder() {
  const { userInfo, isLoading } = useAppSelector((state) => state.auth);
  const [selectedAddress, setSelectedAddress] = useState(
    userInfo?.address[0]._id
  );
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setIsEditingAddress] = useState<any>(null);

  const dispatch = useAppDispatch();
  const { toast } = useToast();
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

  const items = [
    { name: "Trendy T-Shirt", price: 29.99, quantity: 2 },
    { name: "Designer Jeans", price: 89.99, quantity: 1 },
  ];

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 20;
  const deliveryCharge = expressDelivery ? 10 : 0;
  const finalTotal = totalPrice - discount + deliveryCharge;

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
  const navigate = useNavigate();
  if (isLoading) {
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
                {userInfo?.address.map((address) => (
                  <motion.div
                    key={address._id}
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
              <Tabs defaultValue="credit-card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="razorpay">Credit Card</TabsTrigger>

                  <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
                </TabsList>
                <TabsContent value="razorpay">
                  <Card>
                    <CardHeader>
                      <CardTitle>Razorpay</CardTitle>
                      <CardDescription>Pay using your Razorpay</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full">
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
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
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
                  <span>Price ({items.length} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    - ${discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={expressDelivery ? "" : "text-green-600"}>
                    {expressDelivery ? `$${deliveryCharge.toFixed(2)}` : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total Amount</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-green-600 font-semibold mt-4">
                You will save ${discount.toFixed(2)} on this order
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
              <Button>Apply</Button>
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
