import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, RefreshCcw } from 'lucide-react';
import { useAppSelector } from "@/state-manager/hook";
import Loader from "@/helper/Loader";
import { IProductFrontend } from "@/types/productState/product.type";
import { useToast } from "@/hooks/use-toast";
import { useLocation} from "react-router-dom";
import ProductCard from "./product-card";

export default function ProductsPage() {
  const { isLoading, products } = useAppSelector((state) => state.product);
  const [filteredProducts, setFilteredProducts] = useState<IProductFrontend[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [childcategory, setChildcategory] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [isRefreshFunctionCalled, setIsRefreshFunctionCalled] = useState<boolean>(false);
  
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    childcategory: "",
    priceRange: [0, 200],
    selectedBrands: [] as string[],
    selectedColors: [] as string[],
    selectedSizes: [] as string[],
    selectedMaterials: [] as string[],
    sustainabilityRating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isPriceFilterEnabled, setIsPriceFilterEnabled] = useState<boolean>(false);
  const { toast } = useToast();
  const location = useLocation();
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    if (products.length > 0) {
      const Genders = products.map((product) => product.gender).filter(Boolean);
      setGenders([...new Set(Genders)]);

      const ChildCategories = products.map((product) => product.childcategory);
      setChildcategory([...new Set(ChildCategories)]);

      let MaxPrice = Math.max(...products.map((product) => product.basePrice));
      let MinPrice = Math.min(...products.map((product) => product.basePrice));
      setMaxPrice(MaxPrice);
      setMinPrice(MinPrice);
      setFilters((prev) => ({ ...prev, priceRange: [MinPrice, MaxPrice] }));

      const Colors = [
        ...new Set(
          products.flatMap((product) =>
            product.variants.map((variant) => variant.color)
          )
        ),
      ];
      setColors(Colors);

      const Brands = [...new Set(products.map((product) => product.brand))];
      setBrands(Brands);

      const Sizes = [
        ...new Set(
          products.flatMap((product) =>
            product.variants.flatMap((variant) =>
              variant.size.map((size) => size.size)
            )
          )
        ),
      ];
      setSizes(Sizes);

      const Materials = [
        ...new Set(products.flatMap((product) => product.materials)),
      ];
      setMaterials(Materials);

      setFilteredProducts(products);
    }
  }, [products]);

  useEffect(() => {
    if (location.state?.fromNavbar) {
      location.state.fromNavbar = false;
      return;
    }
    if (JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)) {
      applyFilters();
      prevFiltersRef.current = filters;
    }
  }, [filters, location.state]);

  const applyFilters = () => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply gender filter
    if (filters.gender && filters.gender !== "all") {
      filtered = filtered.filter((product) => product.gender === filters.gender);
    }

    // Apply childcategory filter
    if (filters.childcategory && filters.childcategory !== "all") {
      filtered = filtered.filter(
        (product) => product.childcategory === filters.childcategory
      );
    }

    // Apply price range filter
    if (isPriceFilterEnabled) {
      filtered = filtered.filter(
        (product) =>
          product.basePrice >= filters.priceRange[0] &&
          product.basePrice <= filters.priceRange[1]
      );
    }

    // Apply brand filter
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedBrands.includes(product.brand)
      );
    }

    // Apply color filter
    if (filters.selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.variants.some((variant) =>
          filters.selectedColors.includes(variant.color)
        )
      );
    }

    // Apply size filter
    if (filters.selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.variants.some((variant) =>
          variant.size.some((s) => filters.selectedSizes.includes(s.size))
        )
      );
    }

    // Apply material filter
    if (filters.selectedMaterials.length > 0) {
      filtered = filtered.filter((product) =>
        product.materials.some((material) =>
          filters.selectedMaterials.includes(material)
        )
      );
    }

    // Apply sustainability rating filter
    if (filters.sustainabilityRating > 0) {
      filtered = filtered.filter(
        (product) => product.sustainabilityRating >= filters.sustainabilityRating
      );
    }

    setFilteredProducts(filtered);
    toast({
      title: filtered.length > 0 ? "Filters applied successfully" : "No results found",
    });
  };

  const handlePriceFilterToggle = () => {
    setIsPriceFilterEnabled(!isPriceFilterEnabled);
    if (!isPriceFilterEnabled) {
      setFilters((prev) => ({ ...prev, priceRange: [minPrice, maxPrice] }));
    } else {
      setFilters((prev) => ({ ...prev, priceRange: [0, maxPrice] }));
    }
  };

  const handleCheckboxChange = (
    filterKey:
      | "selectedBrands"
      | "selectedColors"
      | "selectedSizes"
      | "selectedMaterials",
    value: string
  ) => {
    setFilters((prev) => {
      const current = prev[filterKey] as string[];
      const isSelected = current.includes(value);
      const updated = isSelected
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
  };

  const handleFilterChange = (
    key: string,
    value: string | number | number[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    setIsRefreshFunctionCalled(true);
    setFilters({
      search: "",
      gender: "",
      childcategory: "",
      priceRange: [minPrice, maxPrice],
      selectedBrands: [],
      selectedColors: [],
      selectedSizes: [],
      selectedMaterials: [],
      sustainabilityRating: 0,
    });
    setFilteredProducts(products);
    setIsRefreshFunctionCalled(false);
    toast({ title: "Filters reset successfully" });
  };

  if (isLoading && !isRefreshFunctionCalled) {
    return <Loader />;
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 font-bold text-xl mb-4">
          Sorry, No results Found
        </div>
        <Button
          onClick={handleRefresh}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isLoading ? (
            <RefreshCcw className="h-6 w-6 animate-spin" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">
            TrendSphere Products
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside
            className={`w-full md:w-1/4 space-y-6 bg-card p-6 rounded-lg shadow-md ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
           <div>
              <Label
                htmlFor="search"
                className="text-lg font-semibold mb-2 block"
              >
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search products..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            {genders.length > 0 && (
              <div>
                <Label
                  htmlFor="gender"
                  className="text-lg font-semibold mb-2 block"
                >
                  Gender
                </Label>
                <Select
                  value={filters.gender}
                  onValueChange={(value) => handleFilterChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label
                htmlFor="childcategory"
                className="text-lg font-semibold mb-2 block"
              >
                Category
              </Label>
              <Select
                value={filters.childcategory}
                onValueChange={(value) =>
                  handleFilterChange("childcategory", value)
                }
              >
                <SelectTrigger id="childcategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {childcategory.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-lg font-semibold">Price Range</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePriceFilterToggle}
                >
                  {isPriceFilterEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1}
                value={filters.priceRange}
                onValueChange={(value) =>
                  handleFilterChange("priceRange", value)
                }
                disabled={!isPriceFilterEnabled}
                className="mt-2"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>

            <div>
              <Label
                htmlFor="brand"
                className="text-lg font-semibold mb-2 block"
              >
                Brands
              </Label>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <div
                    key={brand}
                    className="flex items-center space-x-2 bg-secondary rounded-full px-3 py-1"
                  >
                    <Checkbox
                      id={brand}
                      checked={filters.selectedBrands.includes(brand)}
                      onCheckedChange={() =>
                        handleCheckboxChange("selectedBrands", brand)
                      }
                      className="rounded-full"
                    />
                    <label
                      htmlFor={brand}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="color"
                className="text-lg font-semibold mb-2 block"
              >
                Colors
              </Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="flex items-center space-x-2 bg-secondary rounded-full px-3 py-1"
                  >
                    <Checkbox
                      id={color}
                      checked={filters.selectedColors.includes(color)}
                      onCheckedChange={() =>
                        handleCheckboxChange("selectedColors", color)
                      }
                      className="rounded-full"
                    />
                    <label
                      htmlFor={color}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="size"
                className="text-lg font-semibold mb-2 block"
              >
                Sizes
              </Label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center space-x-2 bg-secondary rounded-full px-3 py-1"
                  >
                    <Checkbox
                      id={size}
                      checked={filters.selectedSizes.includes(size)}
                      onCheckedChange={() =>
                        handleCheckboxChange("selectedSizes", size)
                      }
                      className="rounded-full"
                    />
                    <label
                      htmlFor={size}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="material"
                className="text-lg font-semibold mb-2 block"
              >
                Materials
              </Label>
              <div className="flex flex-wrap gap-2">
                {materials.map((material) => (
                  <div
                    key={material}
                    className="flex items-center space-x-2 bg-secondary rounded-full px-3 py-1"
                  >
                    <Checkbox
                      id={material}
                      checked={filters.selectedMaterials.includes(material)}
                      onCheckedChange={() =>
                        handleCheckboxChange("selectedMaterials", material)
                      }
                      className="rounded-full"
                    />
                    <label
                      htmlFor={material}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {material}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="sustainabilityRating"
                className="text-lg font-semibold mb-2 block"
              >
                Minimum Sustainability Rating
              </Label>
              <Select
                value={filters.sustainabilityRating.toString()}
                onValueChange={(value) =>
                  handleFilterChange("sustainabilityRating", parseInt(value))
                }
              >
                <SelectTrigger id="sustainabilityRating">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </aside>

          <section className="flex-1">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                {location.state?.category && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink>{location.state.category}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                {location.state?.subcategory && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        {location.state.subcategory}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                {location.state?.childcategory && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        {location.state.childcategory}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2">
              {filteredProducts.map((product) => (
                <ProductCard product={product}/>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}