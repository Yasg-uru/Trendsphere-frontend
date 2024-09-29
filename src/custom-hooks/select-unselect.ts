import { useState } from "react";
import { selectProductsForOrder } from "@/types/ordertypes/initialState";
import { useToast } from "@/hooks/use-toast";

export function useProductSelection() {
  const { toast } = useToast();

  const [selectedProducts, setSelectedProducts] = useState<
    selectProductsForOrder[]
  >([]);
  const [unSelectedProducts, setUnselectedProducts] = useState<
    selectProductsForOrder[]
  >([]);

  const handleAddToSelected = (
    variant: selectProductsForOrder,
    index: number
  ) => {
    // Add product to selectedProducts and remove it from unSelectedProducts
    setSelectedProducts((prevSelected) => [...prevSelected, variant]);
    setUnselectedProducts((prevUnselected) =>
      prevUnselected.filter((_, i) => i !== index)
    );
    toast({
      title: "Product added successfully",
    });
  };

  const handleRemoveProduct = (index: number) => {
    const productToBeRemoved = selectedProducts.find((_, i) => i === index);
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((_, i) => i !== index)
    );

    // Add the removed product to unSelectedProducts
    if (productToBeRemoved) {
      setUnselectedProducts((prevUnselected) => [
        ...prevUnselected,
        productToBeRemoved,
      ]);
    }
    toast({
      title: "Product removed successfully",
    });
  };

  const handleSizeChange = (index: number, newSize: string) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product, i) =>
        i === index ? { ...product, size: newSize } : product
      )
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return;

    setSelectedProducts((prevSelected) =>
      prevSelected.map((product, i) =>
        i === index ? { ...product, quantity } : product
      )
    );
  };

  return {
    selectedProducts,
    unSelectedProducts,
    handleAddToSelected,
    handleRemoveProduct,
    handleSizeChange,
    handleQuantityChange,
    setSelectedProducts,
    setUnselectedProducts,
  };
}
