import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, Search, ShoppingCart, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import {
  ApplyFilter,
  searchProducts,
} from "@/state-manager/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import { Logout } from "@/state-manager/slices/authSlice";
import { useDebounce } from "@uidotdev/usehooks";
import { SearchResults } from "../product-pages/searchbar";
// import Loader from "@/helper/Loader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { isLoading } = useAppSelector((state) => state.product);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [currentSubCategory, setCurrentSubCategory] = useState<string>("");
  const [currentChildCategory, setCurrentChildCategory] = useState<string>("");
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedsearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedsearchQuery) {
      dispatch(searchProducts(debouncedsearchQuery))
        .then(() => {
          toast({
            title: "Searched successfully",
          });
        })
        .catch((error) => {
          toast({
            title: error,
          });
        });
    }
  }, [debouncedsearchQuery, dispatch, toast]);

  const handleClick = useCallback(() => {
    const params = {
      category: currentCategory,
      subcategory: currentSubCategory,
      childcategory: currentChildCategory,
    };
    dispatch(ApplyFilter(params))
      .then(() => {
        toast({
          title: "Fetched successfully your results",
        });
        navigate("/products", {
          replace: true, // This ensures it does not push multiple history entries
          state: {
            category: currentCategory,
            subcategory: currentSubCategory,
            childcategory: currentChildCategory,
            fromNavbar: true,
          },
        });
      })
      .catch(() => {
        toast({
          title: "Failed to Fetch results",
        });
      });
  }, [
    currentCategory,
    currentSubCategory,
    currentChildCategory,
    dispatch,
    navigate,
    location.pathname,
    toast,
  ]);

  const { categories } = useAppSelector((state) => state.product);
  const { userInfo } = useAppSelector((state) => state.auth);

  const handleCategoryHover = (category: string) => {
    setCurrentCategory(category);
    setCurrentSubCategory("");
    setCurrentChildCategory("");
  };

  const handleSubcategoryHover = (subcategory: string) => {
    setCurrentSubCategory(subcategory);
    setCurrentChildCategory("");
  };

  const handleChildCategoryClick = (childCategory: string) => {
    setCurrentChildCategory(childCategory);
  };

  const handleSubCategoryClick = () => {
    if (!currentSubCategory && !currentCategory) {
      return;
    }
    handleClick();
  };

  useEffect(() => {
    if (!currentChildCategory) {
      return;
    }
    handleClick();
  }, [currentChildCategory, handleClick]); // Added handleClick to dependencies

  const { carts } = useAppSelector((state) => state.auth);

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">
                Trendsphere
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="container px-4 md:px-6 py-4">
                {isLoading ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground animate-pulse flex ">
   <Loader2 className="animate-spin "/> Please wait while loading categories...
  </div>
                ) : (
                  <NavigationMenu>
                    <ScrollArea className="w-[500px] whitespace-nowrap rounded-md border">
                      <NavigationMenuList className="flex space-x-2 px-1">
                        {categories &&
                          categories.length > 0 &&
                          categories.map((categoryItem, index) => (
                            <NavigationMenuItem
                              key={index}
                              onMouseEnter={() => {
                                handleCategoryHover(categoryItem.category);
                              }}
                              onClick={handleClick}
                            >
                              <NavigationMenuTrigger>
                                {categoryItem.category}
                              </NavigationMenuTrigger>
                              <NavigationMenuContent className="cursor-pointer">
                                <div className="grid w-[600px] p-4 gap-4">
                                  {categoryItem.subcategories.map(
                                    (subcat, subIndex) => (
                                      <div key={subIndex} className="space-y-2">
                                        <NavigationMenuLink
                                          asChild
                                          onMouseEnter={() =>
                                            handleSubcategoryHover(
                                              subcat.subcategory
                                            )
                                          }
                                          onClick={handleSubCategoryClick}
                                        >
                                          <Link
                                            to="#"
                                            className="block text-lg font-semibold text-primary hover:underline"
                                          >
                                            {subcat.subcategory}
                                          </Link>
                                        </NavigationMenuLink>
                                        {subcat.childcategories &&
                                          subcat.childcategories.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2">
                                              {subcat.childcategories.map(
                                                (child, childIndex) => (
                                                  <span
                                                    key={childIndex}
                                                    onClick={() =>
                                                      handleChildCategoryClick(
                                                        child
                                                      )
                                                    }
                                                    className="text-sm text-muted-foreground hover:text-primary hover:underline cursor-pointer"
                                                  >
                                                    {child}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                          ))}
                      </NavigationMenuList>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </NavigationMenu>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isAuthenticated && (
              <Link to="/mycarts">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {carts && carts?.length > 0 && (
                    <div className="absolute top-0 right-0  flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {carts.length}
                    </div>
                  )}
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </Link>
            )}
            <Button variant={"outline"}>{userInfo?.loyaltyPoints}</Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {!isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                className={`font-semibold transition-colors duration-200 dark:text-black dark:bg-white text-white bg-black`}
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {userInfo?.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {userInfo?.username.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5 leading-none">
                      <div className="font-semibold">{userInfo?.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {userInfo?.email}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/u/orders" className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Link to="#" className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>
                  </DropdownMenuItem> */}
                  {isAuthenticated && userInfo?.Role === "admin" && (
                    <DropdownMenuItem>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAuthenticated && userInfo?.Role === "admin" && (
                    <DropdownMenuItem>
                      <Link
                        to="/add-product"
                        className="flex items-center gap-2"
                      >
                        <div className="h-4 w-4" />
                        <span>Add Product</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAuthenticated && userInfo?.Role === "delivery_boy" && (
                    <DropdownMenuItem>
                      <Link
                        to="/delivery-dashboard"
                        className="flex items-center gap-2"
                      >
                        <div className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(Logout())
                        .then(() => {
                          toast({ title: "Logged out successfully" });
                        })
                        .catch((error) => {
                          toast({ title: error, variant: "destructive" });
                        });
                    }}
                  >
                    <Link to="#" className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Accordion type="single" collapsible>
              {categories &&
                categories.length > 0 &&
                categories.map((categoryItem, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{categoryItem.category}</AccordionTrigger>
                    <AccordionContent>
                      {categoryItem.subcategories.map((subcat, subIndex) => (
                        <div key={subIndex} className="space-y-2 py-2">
                          <Link
                            to="#"
                            className="block text-lg font-semibold text-primary hover:underline"
                            onClick={() => {
                              handleSubcategoryHover(subcat.subcategory);
                              handleSubCategoryClick();
                            }}
                          >
                            {subcat.subcategory}
                          </Link>
                          {subcat.childcategories &&
                            subcat.childcategories.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 pl-4">
                                {subcat.childcategories.map(
                                  (child, childIndex) => (
                                    <span
                                      key={childIndex}
                                      onClick={() => {
                                        handleChildCategoryClick(child);
                                        setMobileMenuOpen(false);
                                      }}
                                      className="text-sm text-muted-foreground hover:text-primary hover:underline cursor-pointer"
                                    >
                                      {child}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
          <div className="pt-4 pb-3 border-t border-muted">
            <div className="flex flex-col items-center px-5 space-y-4">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated && (
                  <Link to="/mycarts">
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {carts && carts?.length > 0 && (
                        <div className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {carts.length}
                        </div>
                      )}
                      <span className="sr-only">Shopping cart</span>
                    </Button>
                  </Link>
                )}
                <Button variant={"outline"}>{userInfo?.loyaltyPoints}</Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-semibold transition-colors duration-200"
                  onClick={() => {
                    navigate("/sign-in");
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              ) : (
                <div className="w-full">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {userInfo?.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5 leading-none">
                      <div className="font-semibold">{userInfo?.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {userInfo?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 space-y-2">
                    <Link
                      to="/u/orders"
                      className="block px-2 py-1 hover:bg-accent rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    {/* <Link
                      to="#"
                      className="block px-2 py-1 hover:bg-accent rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Wishlist
                    </Link> */}
                    {isAuthenticated && userInfo?.Role === "admin" && (
                      <>
                        <Link
                          to="/dashboard"
                          className="block px-2 py-1 hover:bg-accent rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/add-product"
                          className="block px-2 py-1 hover:bg-accent rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Add Product
                        </Link>
                      </>
                    )}
                    {isAuthenticated && userInfo?.Role === "delivery_boy" && (
                      <Link
                        to="/delivery-dashboard"
                        className="block px-2 py-1 hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1 h-auto font-normal"
                      onClick={() => {
                        dispatch(Logout())
                          .then(() => {
                            toast({ title: "Logged out successfully" });
                            setMobileMenuOpen(false);
                          })
                          .catch((error) => {
                            toast({ title: error, variant: "destructive" });
                          });
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <SearchResults />
    </nav>
  );
}
