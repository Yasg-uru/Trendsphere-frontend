"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus, X, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const schema = z.object({
  comment: z.string().min(1, "Comment is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  images: z
    .array(
      z.object({
        file: z.any(),
        //   .refine(
        //     (file) => file?.size <= MAX_FILE_SIZE,
        //     `Max file size is 5MB.`
        //   )
        //   .refine(
        //     (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        //     "Only .jpg, .jpeg, .png and .webp formats are supported."
        //   ),
        description: z.string().min(1, "Description is required"),
      })
    )
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
});

type FormValues = z.infer<typeof schema>;

export default function AddReview() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [{ file: undefined, description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const watchedImages = watch("images");

  const onSubmit = async (data: FormValues) => {
    console.log("this is a data :", data);
    const formData = new FormData();
    formData.append("comment", data.comment);
    formData.append("rating", data.rating.toString());

    data.images.forEach((image, index) => {
      formData.append("images", image.file[0]);
      formData.append(`description[${index}]`, image.description);
    });

    console.log("this is a formdata");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}=======> ${value}`);
    }
  };
  console.log("this is errors related to the validation :", errors);
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Upload Review with Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                {...register("comment")}
                placeholder="Enter your comment"
                className="min-h-[100px]"
              />
              {errors.comment && (
                <p className="text-sm text-destructive">
                  {errors.comment.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                type="number"
                id="rating"
                {...register("rating", { valueAsNumber: true })}
                min={1}
                max={5}
              />
              {errors.rating && (
                <p className="text-sm text-destructive">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Images</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {fields.map((field, index) => (
                  <Popover key={field.id}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-24 relative"
                      >
                        {watchedImages[index]?.file?.[0] ? (
                          <img
                            src={URL.createObjectURL(
                              watchedImages[index].file[0]
                            )}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                        <span className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`image-${index}`}>Choose Image</Label>
                          <Input
                            type="file"
                            id={`image-${index}`}
                            accept="image/*"
                            {...register(`images.${index}.file` as const)}
                          />
                          {errors.images?.[index]?.file?.message && (
                            <p className="text-sm  font-bold text-red-600">
                              {errors.images[index].description?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description-${index}`}>
                            Image Description
                          </Label>
                          <Input
                            type="text"
                            id={`description-${index}`}
                            {...register(
                              `images.${index}.description` as const
                            )}
                            placeholder="Describe the image"
                          />
                          {errors.images?.[index]?.description && (
                            <p className="text-sm text-destructive">
                              {errors.images[index].description.message}
                            </p>
                          )}
                        </div>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                            className="w-full"
                          >
                            <X className="mr-2 h-4 w-4" /> Remove Image
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
                {fields.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ file: undefined, description: "" })}
                    className="w-full h-24"
                  >
                    <Plus className="h-8 w-8" />
                  </Button>
                )}
              </div>
              {errors.images && (
                <p className="text-sm text-destructive">
                  {errors.images.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </form>

          {submitStatus === "success" && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your review has been submitted successfully.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was an error submitting your review. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
