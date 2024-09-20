import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/state-manager/hook";
import { cart } from "@/types/authState/initialState";
import { SVGProps, useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";

export default function Carts() {
    const {userInfo}=useAppSelector(state=>state.auth);
    const [carts,setCarts]=useState<cart[]>([]);
//     useEffect(()=>{
//         if(userInfo && userInfo.cart.length>0){
// const Carts=userInfo.cart.map((cart)=>)
//         }
//     })
  const cartItems = [
    {
      id: 1,
      image: "/placeholder.svg",
      name: "Cozy Knit Sweater",
      quantity: 2,
      price: 49.99,
    },
    {
      id: 2,
      image: "/placeholder.svg",
      name: "Leather Backpack",
      quantity: 1,
      price: 79.99,
    },
    {
      id: 3,
      image: "/placeholder.svg",
      name: "Distressed Denim Jeans",
      quantity: 1,
      price: 59.99,
    },
  ];
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="grid gap-8">
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[80px_1fr_auto] items-center gap-4"
            >
              <img
                src="/placeholder.svg"
                alt={item.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
                style={{ aspectRatio: "80/80", objectFit: "cover" }}
              />
              <div className="grid gap-1">
                <h3 className="font-medium">{item.name}</h3>
                <div className="text-muted-foreground">
                  Quantity: {item.quantity}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-medium">${item.price.toFixed(2)}</div>
                <Button variant="outline" size="icon">
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Total Items</div>
              <div className="font-medium">{totalItems}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Total Cost</div>
              <div className="font-medium">${totalCost.toFixed(2)}</div>
            </div>
          </div>
          <div className="grid gap-4">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
            <Button className="w-full">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
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
