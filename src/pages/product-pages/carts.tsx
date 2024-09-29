import { Button } from "@/components/ui/button";
import Loader from "@/helper/Loader";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { GetCarts, removeCart } from "@/state-manager/slices/authSlice";
import { updateCartQuantity } from "@/state-manager/slices/productSlice";
import { selectProductsForOrder } from "@/types/ordertypes/initialState";
import { SVGProps, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import { ConfirmationModal } from "./confirmation-modal";
import { useProductSelection } from "@/custom-hooks/select-unselect";

export default function Carts() {
  const { carts = [], isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const {
    selectedProducts,
    unSelectedProducts,
    handleAddToSelected,
    handleRemoveProduct,
    setSelectedProducts,
    setUnselectedProducts,
  } = useProductSelection();

  useEffect(() => {
    dispatch(GetCarts())
      .then(() => {
        toast({ title: "Successfully fetched carts" });
      })
      .catch((error) => {
        toast({ title: error.message });
      });
  }, [dispatch, toast]);

  if (isLoading) {
    return <Loader />;
  }

  const handleRemove = ({
    productId,
    variantId,
  }: {
    productId: string;
    variantId: string;
  }) => {
    dispatch(removeCart({ productId, variantId }))
      .then(() => {
        toast({ title: "Successfully removed your cart" });
        dispatch(GetCarts());
      })
      .catch((error) => {
        toast({ title: error.message });
      });
  };
  const handlePlaceOrder = () => {
    const unavailable = carts.filter((item) => !isAvailable(item.stocks));
    const AvailableProducts = carts.filter((item) => isAvailable(item.stocks));
    if (AvailableProducts.length > 0) {
      setSelectedProducts(
        AvailableProducts.map((product) => ({
          productId: product.productId,
          variantId: product.variantId,
          quantity: product.quantity,
          priceAtPurchase: product.price,
          discount:
            (product.price * product?.discount?.discountPercentage ?? 0) / 100,
          size: product.size,
        }))
      );
    }
    if (unavailable.length > 0) {
      setUnselectedProducts(
        unavailable.map((product) => ({
          productId: product.productId,
          variantId: product.variantId,
          quantity: product.quantity,
          priceAtPurchase: product.price,
          discount:
            (product.price * product?.discount?.discountPercentage ?? 0) / 100,
          size: product.size,
        }))
      );
      setShowConfirmationModal(true);
    } else {
      //directly we can place order
      placeWithOrder(selectedProducts);
    }
  };
  const placeWithOrder = (selectedProducts: selectProductsForOrder[]) => {
    setIsPlacingOrder(true);
    const productIds = selectedProducts.map((product) => product.productId);
    navigate("/order", {
      state: {
        selectedProducts,
        selectedProductIds: Array.from(new Set(productIds)),
      },
    });
  };
  const handleQuantityChange = (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    if (quantity > 0) {
      dispatch(updateCartQuantity({ productId, variantId, quantity }))
        .then(() => {
          toast({ title: "Successfully updated quantity" });
          dispatch(GetCarts());
        })
        .catch((error) => {
          toast({ title: error.message });
        });
    }
  };

  const isAvailable = (stock: number) => stock > 0;

  const isDiscountValid = (validFrom: string, validUntil: string) => {
    const currentDate = new Date();
    return (
      currentDate >= new Date(validFrom) && currentDate <= new Date(validUntil)
    );
  };

  const totalItems = carts.reduce((acc, item) => {
    return isAvailable(item.stocks) ? acc + item.quantity : acc;
  }, 0);

  const totalCost = carts.reduce((acc, item: any) => {
    if (!isAvailable(item.stocks)) return acc;

    const validDiscount = item.discount
      ? isDiscountValid(item.discount.validFrom, item.discount.validUntil)
      : false;

    const discountedPrice = validDiscount
      ? item.price * (1 - item.discount.discountPercentage / 100)
      : item.price;

    return acc + item.quantity * discountedPrice;
  }, 0);

  const TotalPriceWithoutDiscount = carts.reduce(
    (acc, item) =>
      isAvailable(item.stocks) ? acc + item.price * item.quantity : acc,
    0
  );

  const totalLoyaltyPoints = carts.reduce(
    (acc, item: any) => acc + item.loyaltyPoints,
    0
  );

  if (carts.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-red-600 font-bold italic">Your Cart Is Empty</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="grid gap-8">
        <div className="grid gap-6">
          {carts.map((item, index) => {
            const validDiscount = item.discount
              ? isDiscountValid(
                  item.discount.validFrom,
                  item.discount.validUntil
                )
              : false;
            const available = item.stocks > 0;

            return (
              <div
                key={index}
                className={`grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b pb-4 ${
                  !available ? "opacity-50" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-md object-cover w-20 h-20"
                />
                <div className="grid gap-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    Size: {item.size}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Color: {item.color}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Return:{" "}
                    {item.returnPolicy.eligible
                      ? `${item.returnPolicy.refundDays} days`
                      : "Not eligible"}
                  </div>
                  {item.replacementPolicy && (
                    <div className="text-sm text-muted-foreground">
                      Replacement:{" "}
                      {item.replacementPolicy.elgible
                        ? `${item.replacementPolicy.replacementDays} days`
                        : "Not eligible"}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Loyalty Points: {item.loyaltyPoints}
                  </div>
                  {!available && (
                    <div className="text-sm text-red-600 font-semibold">
                      Currently Unavailable
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-medium flex items-center gap-2">
                    {item.discount && validDiscount ? (
                      <>
                        <span className="line-through text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-green-600">
                          $
                          {(
                            item.price *
                            (1 - item.discount.discountPercentage / 100)
                          ).toFixed(2)}
                        </span>
                        <span className="text-sm text-green-600">
                          ({item.discount.discountPercentage}% off)
                        </span>
                      </>
                    ) : (
                      <span>${item.price.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.variantId,
                          item.quantity - 1
                        )
                      }
                      disabled={!available || item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.variantId,
                          item.quantity + 1
                        )
                      }
                      disabled={!available}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(item)}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Total Items</div>
              <div className="font-medium">{totalItems}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Total Cost</div>
              <div className="flex items-center gap-2 font-medium">
                {totalCost !== TotalPriceWithoutDiscount ? (
                  <>
                    <span className="line-through text-muted-foreground">
                      ${TotalPriceWithoutDiscount.toFixed(2)}
                    </span>
                    <span className="text-green-600 ">
                      ${totalCost.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>${totalCost.toFixed(2)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Total Loyalty Points</div>
              <div className="font-medium">{totalLoyaltyPoints}</div>
            </div>
          </div>
          <div className="grid gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
            <Button
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        unavailableProducts={unSelectedProducts}
        selectproducts={selectedProducts}
        onConfirm={placeWithOrder}
      />
    </div>
  );
}

function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
