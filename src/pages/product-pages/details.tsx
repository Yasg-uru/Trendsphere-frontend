import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useLocation } from "react-router-dom";
import { addcart } from "@/state-manager/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon } from "lucide-react";

export default function Details() {
  const { toast } = useToast();
  const { products } = useAppSelector((state) => state.product);
  const location = useLocation();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    const productId = location.state?.id || products[0]._id;
    setSelectedProductId(productId);
    const product = products.find((p) => p._id === productId);
    if (product) {
      setSelectedVariantId(product.variants[0]._id);
      setImage(product.variants[0].images[0]);
      setSelectedSize(product.variants[0].size[0].size);
    }
  }, [location.state?.id]);

  if (!selectedProductId) return <p>Loading...</p>;

  const selectedProduct =
    products.find((p) => p._id === selectedProductId) || products[0];
  const selectedVariant =
    selectedProduct.variants.find((v) => v._id === selectedVariantId) ||
    selectedProduct.variants[0];

  const discountedPrice = selectedProduct.discount
    ? selectedVariant.price *
      (1 - selectedProduct.discount.discountPercentage / 100)
    : 0;

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    const newVariant =
      selectedProduct.variants.find((v) => v._id === variantId) ||
      selectedProduct.variants[0];
    setSelectedSize(newVariant.size[0].size);
    setImage(newVariant.images[0]);
  };
  const handleImageChange = (image: string) => {
    setImage(image);
  };
  const dispatch = useAppDispatch();
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
        {/* <div>
          <Select onValueChange={handleProductChange} value={selectedProductId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div> */}
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
          {/* <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Color Variants</h2>
            <div className="grid grid-cols-5 gap-4">
              {selectedVariant.color > 0 &&
                selectedVariant.map((color) => (
                  <button
                    key={color.value}
                    className={`w-12 h-12 rounded-full transition-all ${
                      selectedColor === color.value
                        ? "ring-2 ring-primary"
                        : "hover:ring-2 hover:ring-muted"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    {selectedColor === color.value && (
                      <CheckIcon className="w-6 h-6 text-primary-foreground" />
                    )}
                  </button>
                ))}
            </div>
          </div> */}
          <div className="grid gap-2">
            <Label htmlFor="size" className="text-base">
              Size
            </Label>
            <RadioGroup
              id="size"
              value={selectedSize || undefined}
              onValueChange={setSelectedSize}
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
            <Button size="lg">Buy Now</Button>
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
