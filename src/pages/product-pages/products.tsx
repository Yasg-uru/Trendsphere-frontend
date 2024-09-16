import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, RefreshCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import Loader from "@/helper/Loader";
import { IProductFrontend } from "@/types/productState/product.type";
import { ApplyFilter } from "@/state-manager/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "react-router-dom";

export default function ProductsPage() {
  const { isLoading, products } = useAppSelector((state) => state.product);
  const [genders, setGenders] = useState<string[]>([]);
  const [childcategory, setChildcategory] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [materials, setMaterials] = useState<string[]>([]);
const [isRefreshFunctionCalled,setISRefreshFunctionCalled]=useState<boolean>(false);
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    childcategory: "",
    priceRange: [0, 200],
    selectedBrands: [] as string[], // Updated to store selected brands
    selectedColors: [] as string[], // Updated to store selected colors
    selectedSizes: [] as string[], // Updated to store selected sizes
    selectedMaterials: [] as string[], // Updated to store selected materials
    sustainabilityRating: 0,
  });
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
  const [showFilters, setShowFilters] = useState(false);

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

      // const MinRating = Math.min(
      //   ...products.map((product) => product.sustainabilityRating)
      // );
      // setMinRating(MinRating);
    }
  }, [products]);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    if (JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)) {
      const params = {
        childcategory: filters.childcategory,

        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],

        brands: filters.selectedBrands,
        colors: filters.selectedColors,
        sizes: filters.selectedSizes,
        minRating: filters.sustainabilityRating,
        materials: filters.selectedMaterials,
      };

      dispatch(ApplyFilter(params))
        .then(() => {
          toast({
            title: "Filter applied successfully",
          });
        })
        .catch(() => {
          toast({
            title: "Sorry No results found ",
          });
        });
      prevFiltersRef.current = filters;
    }
  }, [filters]);

  const handleFilterChange = (
    key: string,
    value: string | number | number[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading && !isRefreshFunctionCalled) {
    return <Loader />;
  }
  const handleRefresh = () => {
    setISRefreshFunctionCalled(true);
    const { category, subcategory, childcategory } = location.state;
    dispatch(
      ApplyFilter({
        category,
        subcategory,
        childcategory,
      })
    )
      .then(() => {
        toast({
          title: "Refreshed Successfully",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to refresh",
        });
      }).finally(()=>{
        setISRefreshFunctionCalled(false);
      });
  };
  const location = useLocation();
  if (products.length === 0) {
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
            <RefreshCcw className="h-6 w-6 animate-spin " />
          ) : (
            "Refresh "
          )}
        </Button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">TrendSphere Products</h1>
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
            className={`w-full md:w-1/4 space-y-6 ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            {genders.length > 0 && (
              <div>
                <Label htmlFor="gender">Gender</Label>
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
              <Label htmlFor="childcategory">Category</Label>
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
              <Label>Price Range</Label>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1}
                value={filters.priceRange}
                onValueChange={(value) =>
                  handleFilterChange("priceRange", value)
                }
                className="mt-2"
              />
              <div className="flex justify-between mt-2">
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
              <Label htmlFor="sustainabilityRating">
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

          <section className="flex-1 ">
            <Breadcrumb className="mb-10">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id}>
                  <CardHeader>
                    <img
                      src={product.defaultImage}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      {product.brand}
                    </p>
                    <p className="font-bold mt-2">
                      ${product.basePrice.toFixed(2)}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Sustainability:</span>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < product.sustainabilityRating
                              ? "text-green-500"
                              : "text-gray-300"
                          }`}
                        >
                          ●
                        </span>
                      ))}
                    </div>
                    <Button variant="outline">View</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
