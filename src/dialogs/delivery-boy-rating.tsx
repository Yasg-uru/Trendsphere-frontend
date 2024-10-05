import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/state-manager/hook";
import { RateDeliveryBoy } from "@/state-manager/slices/deliverySlice";
import { useToast } from "@/hooks/use-toast";
interface props {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  ID: string;
}
const DeliveryRatingDialog: React.FunctionComponent<props> = ({
  isOpen,
  setIsOpen,
  ID,
}) => {
  const [rating, setRating] = useState(0);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleSubmit = () => {
    dispatch(RateDeliveryBoy({ rating, deliveryBoyID: ID })).unwrap()
      .then(() => {
        toast({
          title: "Your rating added successfully",
        });
      })
      .catch((error) => {
        toast({
          title: error,
          variant: "destructive",
        });
      });
    setIsOpen(false);
    setRating(0);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Your Delivery</DialogTitle>
          <DialogDescription>
            How would you rate your delivery experience? Your feedback helps us
            improve our service.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => handleRatingChange(star)}
            />
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeliveryRatingDialog;
