"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";


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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { useToast } from "@/hooks/use-toast";
import { createProduct } from "@/state-manager/slices/productSlice";
import Loader from "@/helper/Loader";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  childcategory: z.string().min(1, "Child category is required"),
  gender: z.enum(["mens", "womens", "kids", "null"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  basePrice: z.number().positive("Base price must be positive"),
  materials: z.array(z.string()).min(1, "At least one material is required"),
  sustainabilityRating: z.number().min(0).max(5),
  available: z.boolean(),
  brand: z.string().min(1, "Brand is required"),
  overallStock: z.number().int().nonnegative(),
  defaultImage: z.string().url("Default image must be a valid URL"),
  variants: z.array(
    z.object({
      size: z.array(
        z.object({
          size: z.string(),
          stock: z.number().int().nonnegative(),
        })
      ),
      color: z.string(),
      material: z.string(),
      price: z.number().positive(),
      stock: z.number().int().nonnegative(),
      sku: z.string(),
      images: z.array(z.string().url("Image must be a valid URL")),
      available: z.boolean(),
    })
  ),
  productDetails: z.record(z.string()),
  highlights: z.array(z.string()),
  loyalityPoints: z.number().int().nonnegative(),
  returnPolicy: z.object({
    eligible: z.boolean(),
    refundDays: z.number().int().nonnegative(),
    terms: z.string(),
  }),
  replacementPolicy: z.object({
    eligible: z.boolean(),
    replacementDays: z.number().int().nonnegative(),
    terms: z.string(),
    validReason: z.array(z.string()),
  }),
  discount: z
    .object({
      discountPercentage: z.number().min(0).max(100),
      validFrom: z.string(),
      validUntil: z.string(),
    })
    .optional(),
  rating: z.number().min(0).max(5).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function AddProduct() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { isLoading } = useAppSelector((state) => state.product);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      subcategory: "",
      childcategory: "",
      gender: "mens",
      description: "",
      basePrice: 0,
      materials: [],
      sustainabilityRating: 0,
      available: true,
      brand: "",
      overallStock: 0,
      defaultImage: "",
      variants: [],
      productDetails: {},
      highlights: [],
      loyalityPoints: 0,
      returnPolicy: {
        eligible: false,
        refundDays: 0,
        terms: "",
      },
      replacementPolicy: {
        eligible: false,
        replacementDays: 0,
        terms: "",
        validReason: [],
      },
      rating: 0,
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    name: "variants",
    control: form.control,
  });

  function onSubmit(values: ProductFormValues) {
    // Format the data to match the desired structure
    const formattedData = {
      ...values,
      variants: values.variants.map((variant) => ({
        ...variant,
        size: variant.size.map((s) => ({ size: s.size, stock: s.stock })),
      })),
      reviews: [],
    };
    dispatch(createProduct(formattedData))
      .unwrap()
      .then(() => {
        toast({
          title: "product created successfully",
         
        });
      })
      .catch((error) => {
        toast({
          title: "Faild to create product ",
          description: error,
        });
      });
    console.log("Formatted data for creating product:", formattedData);
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="policy">Policies</TabsTrigger>
              <TabsTrigger value="discount">Discount</TabsTrigger>
              <TabsTrigger value="highlight">Highlights</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Men's Formal Shirt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="clothing">
                                  Clothing
                                </SelectItem>
                                <SelectItem value="accessories">
                                  Accessories
                                </SelectItem>
                                <SelectItem value="footwear">
                                  Footwear
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="shirts">Shirts</SelectItem>
                              <SelectItem value="pants">Pants</SelectItem>
                              <SelectItem value="dresses">Dresses</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="childcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select child category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="formal-shirts">
                                Formal Shirts
                              </SelectItem>
                              <SelectItem value="casual-shirts">
                                Casual Shirts
                              </SelectItem>
                              <SelectItem value="t-shirts">T-Shirts</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-x-4"
                          >
                            {["mens", "womens", "kids", "null"].map((value) => (
                              <FormItem
                                key={value}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={value} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {value === "null"
                                    ? "Unisex"
                                    : value.charAt(0).toUpperCase() +
                                      value.slice(1)}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A sleek and sophisticated formal shirt, ideal for business meetings and events."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="UrbanStyle" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="defaultImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/images/product.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Rating</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a rating between 0 and 5
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="materials"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Materials</FormLabel>
                          <FormDescription>
                            Select the materials used in this product.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {["Cotton", "Polyester", "Wool", "Silk", "Linen"].map(
                            (item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="materials"
                                render={({ field }) => (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...field.value, item]
                                            : field.value?.filter(
                                                (value) => value !== item
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            )
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sustainabilityRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sustainability Rating</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={5}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Rate the product's sustainability from 0 to 5.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loyalityPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loyalty Points</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Details</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {Object.entries(field.value).map(
                              ([key, value], index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    placeholder="Key"
                                    value={key}
                                    onChange={(e) => {
                                      const newDetails = { ...field.value };
                                      delete newDetails[key];
                                      newDetails[e.target.value] = value;
                                      field.onChange(newDetails);
                                    }}
                                  />
                                  <Input
                                    placeholder="Value"
                                    value={value as string}
                                    onChange={(e) => {
                                      const newDetails = { ...field.value };
                                      newDetails[key] = e.target.value;
                                      field.onChange(newDetails);
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const newDetails = { ...field.value };
                                      delete newDetails[key];
                                      field.onChange(newDetails);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const newDetails = { ...field.value, "": "" };
                            field.onChange(newDetails);
                          }}
                        >
                          Add Detail
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Available</FormLabel>
                          <FormDescription>
                            Is this product currently available?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overallStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variants">
              <Card>
                <CardHeader>
                  <CardTitle>Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {variantFields.map((field, index) => (
                      <div key={field.id} className="mb-4 p-4 border rounded">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.color`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.material`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Material</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.stock`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseInt(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.sku`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`variants.${index}.size`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sizes</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  {field.value.map((sizeItem, sizeIndex) => (
                                    <div key={sizeIndex} className="flex gap-2">
                                      <Input
                                        placeholder="Size"
                                        value={sizeItem.size}
                                        onChange={(e) => {
                                          const newSizes = [...field.value];
                                          newSizes[sizeIndex].size =
                                            e.target.value;
                                          field.onChange(newSizes);
                                        }}
                                      />
                                      <Input
                                        type="number"
                                        placeholder="Stock"
                                        value={sizeItem.stock}
                                        onChange={(e) => {
                                          const newSizes = [...field.value];
                                          newSizes[sizeIndex].stock = parseInt(
                                            e.target.value
                                          );
                                          field.onChange(newSizes);
                                        }}
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                          const newSizes = [...field.value];
                                          newSizes.splice(sizeIndex, 1);
                                          field.onChange(newSizes);
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const newSizes = [
                                    ...field.value,
                                    { size: "", stock: 0 },
                                  ];
                                  field.onChange(newSizes);
                                }}
                              >
                                Add Size
                              </Button>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.images`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URLs</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  {field.value.map((image, imageIndex) => (
                                    <div
                                      key={imageIndex}
                                      className="flex gap-2"
                                    >
                                      <Input
                                        value={image}
                                        onChange={(e) => {
                                          const newImages = [...field.value];
                                          newImages[imageIndex] =
                                            e.target.value;
                                          field.onChange(newImages);
                                        }}
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                          const newImages = [...field.value];
                                          newImages.splice(imageIndex, 1);
                                          field.onChange(newImages);
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const newImages = [...field.value, ""];
                                  field.onChange(newImages);
                                }}
                              >
                                Add Image URL
                              </Button>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.available`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 mt-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Available</FormLabel>
                                <FormDescription>
                                  This variant is available for purchase
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeVariant(index)}
                          className="mt-2"
                        >
                          Remove Variant
                        </Button>
                        <Separator className="my-4" />
                      </div>
                    ))}
                  </ScrollArea>
                  <Button
                    type="button"
                    onClick={() =>
                      appendVariant({
                        size: [],
                        color: "",
                        material: "",
                        price: 0,
                        stock: 0,
                        sku: "",
                        images: [],
                        available: true,
                      })
                    }
                    className="mt-4"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Variant
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="policy">
              <Card>
                <CardHeader>
                  <CardTitle>Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="returnPolicy.eligible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Return Eligible
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="returnPolicy.refundDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Refund Days</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="returnPolicy.terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return Terms</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="replacementPolicy.eligible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Replacement Eligible
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="replacementPolicy.replacementDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Replacement Days</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="replacementPolicy.terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Replacement Terms</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="replacementPolicy.validReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Reasons for Replacement</FormLabel>
                        <FormControl>
                          <div>
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((reason, index) => (
                                <Badge key={index} variant="secondary">
                                  {reason}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-4 w-4 p-0"
                                    onClick={() => {
                                      const newReasons = [...field.value];
                                      newReasons.splice(index, 1);
                                      field.onChange(newReasons);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <Input
                              placeholder="Enter reason and press Enter"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const newReasons = [
                                    ...field.value,
                                    e.currentTarget.value,
                                  ];
                                  field.onChange(newReasons);
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discount">
              <Card>
                <CardHeader>
                  <CardTitle>Discount</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="discount.discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount.validFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid From</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount.validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Until</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="highlight">
              <Card>
                <CardHeader>
                  <CardTitle>Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="highlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Highlights</FormLabel>
                        <FormControl>
                          <div>
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((highlight, index) => (
                                <Badge key={index} variant="secondary">
                                  {highlight}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-4 w-4 p-0"
                                    onClick={() => {
                                      const newHighlights = [...field.value];
                                      newHighlights.splice(index, 1);
                                      field.onChange(newHighlights);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <Input
                              placeholder="Enter highlight and press Enter"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const newHighlights = [
                                    ...field.value,
                                    e.currentTarget.value,
                                  ];
                                  field.onChange(newHighlights);
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
