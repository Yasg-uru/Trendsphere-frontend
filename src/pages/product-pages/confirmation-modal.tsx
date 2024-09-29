import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { selectProductsForOrder } from "@/types/ordertypes/initialState";
import { useProductSelection } from "@/custom-hooks/select-unselect";
import { useAppSelector } from "@/state-manager/hook";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectproducts: selectProductsForOrder[];
  unavailableProducts: selectProductsForOrder[];
  onConfirm: (selectedProducts: selectProductsForOrder[]) => void;
}
// availableProducts={availableProducts}
// setavailableProducts={setAvailableProducts}
export function ConfirmationModal({
  isOpen,
  onClose,
  unavailableProducts,
  selectproducts,
  onConfirm,
}: ConfirmationModalProps) {
  const {
    selectedProducts,
    unSelectedProducts,
    handleAddToSelected,
    handleRemoveProduct,
    setSelectedProducts,
    setUnselectedProducts,
  } = useProductSelection();

  const { carts } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setUnselectedProducts(unavailableProducts);
    setSelectedProducts(selectproducts);
  }, [unavailableProducts, setUnselectedProducts]);

  const handleConfirm = () => {
    console.log("this is a selected products ", selectedProducts);
    onConfirm(selectedProducts);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            The following products are currently unavailable. Please select the
            ones you'd like to keep in your order:
          </p>
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-4">
              {unSelectedProducts.map((product, index) => {
                const cartItem = carts.find(
                  (item) =>
                    item.productId === product.productId &&
                    item.variantId === product.variantId
                );

                if (!cartItem) return null;

                return (
                  <li
                    key={`${product.productId}-${product.variantId}`}
                    className="flex items-start space-x-4"
                  >
                    <Checkbox
                      id={`product-${index}`}
                      checked={selectedProducts.some(
                        (p) =>
                          p.productId === product.productId &&
                          p.variantId === product.variantId
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleAddToSelected(product, index);
                        } else {
                          handleRemoveProduct(
                            selectedProducts.findIndex(
                              (p) =>
                                p.productId === product.productId &&
                                p.variantId === product.variantId
                            )
                          );
                        }
                      }}
                    />
                    <div className="flex-shrink-0">
                      <img
                        src={cartItem.image}
                        alt={cartItem.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <Label
                        htmlFor={`product-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cartItem.title}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Size: {cartItem.size} | Color: {cartItem.color}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
