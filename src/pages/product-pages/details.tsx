import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SVGProps } from "react";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
// import { IProductFrontend } from "@/types/productState/product.type";
import { useLocation, useNavigate } from "react-router-dom";
import { addcart, getsingleProduct } from "@/state-manager/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { selectProductsForOrder } from "@/types/ordertypes/initialState";
import { Input } from "@/components/ui/input";
import Loader from "@/helper/Loader";

export default function Details() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { singleProduct, isLoading } = useAppSelector((state) => state.product);
  const location = useLocation();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  const [selectedProducts, setSelectedProducts] = useState<
    selectProductsForOrder[]
  >([]);
  const [unSelectedProducts, setUnselectedProducts] = useState<
    selectProductsForOrder[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [image, setImage] = useState<string>("");

  const isDiscountValid = (validFrom: string, validUntil: string) => {
    const currentDate = new Date();
    return (
      currentDate >= new Date(validFrom) && currentDate <= new Date(validUntil)
    );
  };

  useEffect(() => {
    if (location.state && location.state.id) {
      dispatch(getsingleProduct(location.state.id))
        .unwrap()
        .then(() => {
          toast({
            title: "Successfully fetched product details",
          });
        })
        .catch((error) => {
          toast({
            title: error,
            variant: "destructive",
          });
        });
    }
  }, [location.state?.id]);

  useEffect(() => {
    if (singleProduct) {
      setSelectedProductId(singleProduct._id);
      const initialVariant = singleProduct.variants[0];
      setSelectedVariantId(initialVariant._id);
      setImage(initialVariant.images[0]);
      setSelectedSize(initialVariant.size[0].size);

      // Check for a valid discount
      const validDiscount = singleProduct.discount
        ? isDiscountValid(
            singleProduct.discount.validFrom,
            singleProduct.discount.validUntil
          )
        : false;

      const discountedPrice = validDiscount
        ? (initialVariant.price *
            (singleProduct?.discount?.discountPercentage ?? 0)) /
          100
        : 0;

      setSelectedProducts([
        {
          productId: singleProduct._id,
          variantId: initialVariant._id,
          quantity: 1,
          priceAtPurchase: initialVariant.price,
          discount: discountedPrice,
          size: initialVariant.size[0].size,
        },
      ]);

      const remainingVariants = singleProduct.variants.slice(1);
      const unselectedVariants = remainingVariants.map((variant) => {
        const variantDiscountedPrice = validDiscount
          ? (variant.price *
              (singleProduct?.discount?.discountPercentage ?? 0)) /
            100
          : 0;

        return {
          productId: singleProduct._id,
          variantId: variant._id,
          quantity: 1,
          priceAtPurchase: variant.price,
          discount: variantDiscountedPrice,
          size: variant.size[0].size,
        };
      });

      setUnselectedProducts(unselectedVariants);
    }
  }, [singleProduct]);

  if (isLoading || !singleProduct || !selectedProductId) return <Loader />;

  const selectedProduct = singleProduct;
  const selectedVariant =
    selectedProduct.variants.find((v) => v._id === selectedVariantId) ||
    selectedProduct.variants[0];

  const discountedPrice = selectedProduct.discount
    ? selectedVariant.price -
      (selectedVariant.price * selectedProduct.discount.discountPercentage) /
        100
    : selectedVariant.price;

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    const newVariant =
      selectedProduct.variants.find((v) => v._id === variantId) ||
      selectedProduct.variants[0];
    setSelectedSize(newVariant.size[0].size);
    setImage(newVariant.images[0]);
    const discountPercentage =
      selectedProduct?.discount?.discountPercentage ?? 0;
    const discountAmount = (newVariant.price * discountPercentage) / 100;
    setSelectedProducts([
      {
        productId: selectedProductId,
        variantId,
        quantity: 1,
        discount: discountAmount,
        priceAtPurchase: newVariant.price,
        size: newVariant.size[0].size,
      },
    ]);
    setUnselectedProducts(
      selectedProduct.variants
        .filter(
          (variant) =>
            !selectedProducts.some((p) => p.variantId === variant._id)
        )
        .map((Item) => ({
          productId: selectedProductId,
          variantId: Item._id,
          quantity: 1,
          discount:
            (Item.price *
              (selectedProduct?.discount?.discountPercentage ?? 0)) /
            100,
          priceAtPurchase: Item.price,
          size: Item.size[0].size,
        }))
    );
  };

  const handleImageChange = (image: string) => {
    setImage(image);
  };

  const handleCart = () => {
    if (selectedVariantId) {
      if (!selectedSize) {
        toast({
          title: "Please select size",
        });
        return;
      }
      const formData = {
        productId: selectedProductId,
        variantId: selectedVariantId,
        size: selectedSize,
        quantity: 1,
      };

      dispatch(addcart(formData))
        .unwrap()
        .then(() => {
          toast({
            title: "Cart Added Successfully",
          });
        })
        .catch((error) => {
          toast({
            title: "Failed to add cart",
          });
        });
    }
  };
  const handleOrder = () => {
    setIsModalOpen(true);
  };
  const handlechangeSize = (size: string) => {
    setSelectedSize(size);
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        size,
      }))
    );
  };

  const confirmAndBuyOrder = () => {
    navigate("/order", {
      state: { selectedProductId, selectedProducts },
    });
  };
  const handleQuantityChange = (index: number, Quantity: number) => {
    if (Quantity < 1) {
      return;
    }
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, quantity: Quantity } : product
      )
    );
  };
  const handleRemoveProduct = (index: number) => {
    const productToBeRemove = selectedProducts.find((_, i) => i === index);
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );

    //if user remove the product from the select product variants then we need to push it into the unselect product variants
    if (productToBeRemove) {
      setUnselectedProducts([...unSelectedProducts, productToBeRemove]);
    }
    toast({
      title: "Removed successfully product ",
    });
  };
  const handleAddToSelected = (
    variant: selectProductsForOrder,
    index: number
  ) => {
    // we need to push the product and remove from the unselected product variants
    setSelectedProducts([...selectedProducts, variant]);
    setUnselectedProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index).map((product) => product)
    );
  };
  const handleSizeChange = (index: number, newSize: string) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, size: newSize } : product
      )
    );
  };
  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
      <div className="grid gap-4">
        <img
          src={image}
          alt={selectedProduct.name}
          width={600}
          height={900}
          className="aspect-[2/3] object-cover border w-full rounded-lg overflow-hidden"
        />
        <div className=" md:grid grid-cols-4 gap-3">
          {selectedVariant.images.map((image, index) => (
            <button
              type="button"
              onClick={() => handleImageChange(image)}
              key={index}
              className="border hover:border-primary rounded-lg overflow-hidden transition-colors"
            >
              <img
                src={image}
                alt={`${selectedProduct.name} - Image ${index + 1}`}
                width={100}
                height={120}
                className="aspect-[5/6] object-cover"
              />
              <span className="sr-only">View Image {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold mt-4">{selectedProduct.name}</h1>
          <p className="text-muted-foreground">{selectedProduct.description}</p>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <StarIcon
                className={`w-5 h-5 ${
                  val <= selectedProduct.rating
                    ? "fill-primary"
                    : "fill-muted stroke-muted-foreground"
                }`}
              />
            ))}

            <span className="text-muted-foreground text-sm">
              (
              {selectedProduct.reviews.length === 0
                ? "No reviews yet"
                : selectedProduct.reviews.length}
              )
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">
              ${discountedPrice.toFixed(2)}
            </span>
            <span className="text-muted-foreground line-through">
              ${selectedVariant.price.toFixed(2)}
            </span>
            <Badge variant="outline" className="px-2 py-1">
              {selectedProduct.available
                ? "Available"
                : "currently unavailable"}
            </Badge>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="variant" className="text-base">
              Variant
            </Label>
            <Select
              onValueChange={handleVariantChange}
              value={selectedVariantId || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a variant" />
              </SelectTrigger>
              <SelectContent>
                {selectedProduct.variants.map((variant) => (
                  <SelectItem key={variant._id} value={variant._id}>
                    {variant.color} - {variant.material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="size" className="text-base">
              Size
            </Label>
            <RadioGroup
              id="size"
              value={selectedSize || undefined}
              onValueChange={handlechangeSize}
              className="flex items-center gap-2"
            >
              {selectedVariant.size.map((sizeOption) => (
                <Label
                  key={sizeOption._id}
                  htmlFor={`size-${sizeOption.size}`}
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                >
                  <RadioGroupItem
                    id={`size-${sizeOption.size}`}
                    value={sizeOption.size}
                  />
                  <div className="flex flex-col gap-1">
                    <p>{sizeOption.size}</p>
                    <p>
                      {" "}
                      (
                      {sizeOption.stock > 0
                        ? `${sizeOption.stock} in stock`
                        : "Out of stock"}
                      )
                    </p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex gap-1 w-full">
            <Button size="lg" onClick={handleCart}>
              Add to Cart
            </Button>
            <Button size="lg" onClick={handleOrder}>
              Buy Now
            </Button>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <h2 className="text-xl font-bold">Product Details</h2>
          <div className="grid gap-2 text-sm leading-loose">
            <p>{selectedProduct.description}</p>
            <ul>
              {selectedProduct.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
            <p>Material: {selectedProduct.productDetails.Material}</p>
            <p>
              Care Instructions:{" "}
              {selectedProduct.productDetails["Care Instructions"]}
            </p>
            <p>Origin: {selectedProduct.productDetails.Origin}</p>
          </div>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
            <DialogDescription>
              Review and modify your selected items before proceeding to
              checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedProducts.map((product, index) => {
              const variant = selectedProduct.variants.find(
                (v) => v._id === product.variantId
              );
              if (!variant) return null;
              return (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={variant.images[0]}
                    alt={selectedProduct.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {variant.color} - {variant.material}
                    </p>
                    <Select
                      value={product.size}
                      onValueChange={(newSize) =>
                        handleSizeChange(index, newSize)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {variant.size.map((sizeOption) => (
                          <SelectItem
                            key={sizeOption._id}
                            value={sizeOption.size}
                          >
                            {sizeOption.size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(index, product.quantity - 1)
                        }
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            index,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(index, product.quantity + 1)
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground line-through">
                        $
                        {(product.priceAtPurchase * product.quantity).toFixed(
                          2
                        )}
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        $
                        {(
                          (product.priceAtPurchase - product.discount) *
                          product.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          {unSelectedProducts.length > 0 && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">
                Unselected Variants
              </h3>
              <div className="grid gap-4">
                {unSelectedProducts.map((product, index) => {
                  const variant = selectedProduct.variants.find(
                    (v) => v._id === product.variantId
                  );
                  if (!variant) return null;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={variant.images[0]}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {variant.color} - {variant.material} -{" "}
                          {variant.size[0].size}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          onClick={() => handleAddToSelected(product, index)}
                        >
                          Add to Order
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={confirmAndBuyOrder}>Confirm and Buy Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
