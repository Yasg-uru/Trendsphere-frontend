

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, X } from "lucide-react"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  childcategory: z.string().min(1, "Child category is required"),
  gender: z.enum(["mens", "womens", "kids"]),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  basePrice: z.number().positive("Base price must be positive"),
  materials: z.array(z.string()).min(1, "At least one material is required"),
  sustainabilityRating: z.number().min(0).max(5),
  available: z.boolean(),
  brand: z.string().min(1, "Brand is required"),
  overallStock: z.number().int().nonnegative(),
  defaultImage: z.string().url("Default image must be a valid URL"),
  variants: z.array(z.object({
    size: z.array(z.object({
      size: z.string(),
      stock: z.number().int().nonnegative(),
    })),
    color: z.string(),
    material: z.string(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    sku: z.string(),
    images: z.array(z.string().url("Image must be a valid URL")),
    available: z.boolean(),
  })),
  highlights: z.array(z.string()),
  productDetails: z.record(z.string()),
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
  discount: z.object({
    discountPercentage: z.number().min(0).max(100),
    validFrom: z.string(),
    validUntil: z.string(),
  }).optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

export function AddProduct() {
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
      highlights: [],
      productDetails: {},
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
    },
  })

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    name: "variants",
    control: form.control,
  })

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    name: "highlights",
    control: form.control,
  })

  function onSubmit(values: ProductFormValues) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="discount">Discount</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Men's Casual Shirt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                            <SelectItem value="footwear">Footwear</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select child category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casual-shirts">Casual Shirts</SelectItem>
                            <SelectItem value="formal-shirts">Formal Shirts</SelectItem>
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
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="mens" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Men's
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="womens" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Women's
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="kids" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Kids
                            </FormLabel>
                          </FormItem>
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
                          placeholder="A stylish and comfortable casual shirt perfect for everyday wear."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                        <Input placeholder="https://example.com/images/mens_casual_shirt.jpg" {...field} />
                      </FormControl>
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
              <CardContent className="space-y-4">
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
                        {["Cotton", "Polyester", "Wool", "Silk", "Linen"].map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="materials"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Highlights</FormLabel>
                  {highlightFields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`highlights.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeHighlight(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => appendHighlight("")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Highlight
                  </Button>
                </div>
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
                                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                        name={`variants.${index}.images`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((image, imageIndex) => (
                                  <div key={imageIndex} className="relative">
                                    <img src={image} alt={`Variant ${index + 1} Image ${imageIndex + 1}`} className="w-20 h-20 object-cover rounded" />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-0 right-0 h-6 w-6"
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
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-20 h-20"
                                  onClick={() => {
                                    const newImage = prompt("Enter image URL");
                                    if (newImage) {
                                      field.onChange([...field.value, newImage]);
                                    }
                                  }}
                                >
                                  <PlusCircle className="h-6 w-6" />
                                </Button>
                              </div>
                            </FormControl>
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
                              <FormLabel>
                                Available
                              </FormLabel>
                              <FormDescription>
                                This variant is available for purchase
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" onClick={() => removeVariant(index)} className="mt-2">Remove Variant</Button>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </ScrollArea>
                <Button
                  type="button"
                  onClick={() => appendVariant({
                    size: [],
                    color: "",
                    material: "",
                    price: 0,
                    stock: 0,
                    sku: "",
                    images: [],
                    available: true
                  })}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle>Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="returnPolicy.eligible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Return Eligible</FormLabel>
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                        <FormLabel className="text-base">Replacement Eligible</FormLabel>
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((reason, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                              <span>{reason}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full"
                                onClick={() => {
                                  const newReasons = [...field.value];
                                  newReasons.splice(index, 1);
                                  field.onChange(newReasons);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newReason = prompt("Enter a valid reason for replacement");
                              if (newReason) {
                                field.onChange([...field.value, newReason]);
                              }
                            }}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Reason
                          </Button>
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
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="discount.discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
        </Tabs>

        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  )
}