import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/state-manager/hook";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IProductFrontend } from "@/types/productState/product.type";

export function SearchResults() {
  const { searchedProducts, isLoading } = useAppSelector(
    (state) => state.product
  );
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(searchedProducts && searchedProducts.length > 0);

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchedProducts]);

  if (!isVisible) return null;

  return (
    <Card
      className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50"
      ref={ref}
    >
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : searchedProducts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No results found</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {searchedProducts.map((product: IProductFrontend) => (
                <li
                  key={product._id}
                  className="p-4 hover:bg-accent transition-colors"
                >
                  <Link
                    to={`/details`}
                    state={{ id: product._id }}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={product.defaultImage}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.brand}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-medium">
                          ${product.basePrice.toFixed(2)}
                        </span>
                        {product.discount && (
                          <span className="text-xs text-green-600 font-medium">
                            {product.discount.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
