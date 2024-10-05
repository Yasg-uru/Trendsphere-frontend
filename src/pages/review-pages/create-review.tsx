

import { useState, useRef } from "react";
import { Star, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { uplaodReview } from "@/state-manager/slices/productSlice";
import {  useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/helper/Loader";

interface ImageWithDescription {
  file: File;
  description: string;
  preview: string;
}

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<ImageWithDescription[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { productId } = useParams();
  // const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useAppSelector((state) => state.product);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.slice(0, 5 - images.length).map((file) => ({
      file,
      description: "",
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setImages((prevImages) =>
      prevImages.map((img, i) => (i === index ? { ...img, description } : img))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("comment", comment);
    formData.append("rating", rating.toString());

    images.forEach((image, index) => {
      formData.append("images", image.file);
      formData.append(`description[${index}]`, image.description);
    });
    if (productId) {
      dispatch(uplaodReview({ formData, productId }))
        .then(() => {
          toast({
            title: "Review Uploaded successfully",
          });
        })
        .catch((error) => {
          toast({
            title: error,
          });
        });
    }
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <div className="max-w-3xl w-full mx-auto p-6 bg-background rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">
          Write a Review
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="comment" className="text-foreground">
              Your Review
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about the product..."
              className="mt-1 bg-background text-foreground border-input"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-foreground">Rating</Label>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-muted-foreground"
                  }`}
                >
                  <Star
                    className="w-8 h-8"
                    fill={star <= rating ? "currentColor" : "none"}
                  />
                  <span className="sr-only">
                    {star} star{star !== 1 ? "s" : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="images" className="text-foreground">
              Upload Images (Max 5)
            </Label>
            <div className="mt-1 flex items-center space-x-4">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 5}
                className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Files
              </Button>
              <Input
                type="file"
                id="images"
                ref={fileInputRef}
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <span className="text-sm text-muted-foreground">
                {images.length}/5 images uploaded
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative border border-input rounded-lg p-4 bg-background"
              >
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
                <Input
                  type="text"
                  value={image.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  placeholder={`Description for image ${index + 1}`}
                  className="mt-1 bg-background text-foreground border-input"
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
}
